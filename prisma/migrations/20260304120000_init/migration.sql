-- Enable uuid generation (Supabase usually has this enabled)
create extension if not exists "pgcrypto";

-- Enums
do $$ begin
  create type "Role" as enum ('admin','student');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type "OrderStatus" as enum ('pending','paid','failed','refunded');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type "PaymentStatus" as enum ('pending','succeeded','failed');
exception
  when duplicate_object then null;
end $$;

-- Tables
create table if not exists "users" (
  "id" uuid primary key default gen_random_uuid(),
  "supabaseId" uuid not null unique,
  "email" text not null unique,
  "fullName" text,
  "role" "Role" not null default 'student',
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "courses" (
  "id" uuid primary key default gen_random_uuid(),
  "slug" text not null unique,
  "title" text not null,
  "description" text not null,
  "price" integer not null,
  "currency" text not null default 'IQD',
  "imagePath" text,
  "isPublished" boolean not null default false,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index if not exists "courses_isPublished_idx" on "courses" ("isPublished");

create table if not exists "modules" (
  "id" uuid primary key default gen_random_uuid(),
  "courseId" uuid not null references "courses"("id") on delete cascade,
  "title" text not null,
  "order" integer not null default 0,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index if not exists "modules_courseId_order_idx" on "modules" ("courseId","order");

create table if not exists "lessons" (
  "id" uuid primary key default gen_random_uuid(),
  "moduleId" uuid not null references "modules"("id") on delete cascade,
  "title" text not null,
  "order" integer not null default 0,
  "videoUrl" text,
  "notes" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index if not exists "lessons_moduleId_order_idx" on "lessons" ("moduleId","order");

create table if not exists "enrollments" (
  "id" uuid primary key default gen_random_uuid(),
  "userId" uuid not null references "users"("id") on delete cascade,
  "courseId" uuid not null references "courses"("id") on delete cascade,
  "createdAt" timestamptz not null default now(),
  constraint "enrollments_userId_courseId_key" unique ("userId","courseId")
);

create index if not exists "enrollments_courseId_idx" on "enrollments" ("courseId");

create table if not exists "orders" (
  "id" uuid primary key default gen_random_uuid(),
  "userId" uuid not null references "users"("id") on delete cascade,
  "courseId" uuid not null references "courses"("id") on delete cascade,
  "amount" integer not null,
  "currency" text not null default 'IQD',
  "status" "OrderStatus" not null default 'pending',
  "provider" text not null,
  "providerRef" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index if not exists "orders_userId_status_idx" on "orders" ("userId","status");
create index if not exists "orders_courseId_idx" on "orders" ("courseId");

create table if not exists "payments" (
  "id" uuid primary key default gen_random_uuid(),
  "orderId" uuid not null references "orders"("id") on delete cascade,
  "provider" text not null,
  "status" "PaymentStatus" not null default 'pending',
  "amount" integer not null,
  "currency" text not null default 'IQD',
  "raw" jsonb,
  "createdAt" timestamptz not null default now()
);

create index if not exists "payments_orderId_idx" on "payments" ("orderId");
