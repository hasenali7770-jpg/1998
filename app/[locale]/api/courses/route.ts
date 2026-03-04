import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const CourseCreateSchema = z.object({
  slug: z.string().min(2).max(120),
  title: z.string().min(2).max(200),
  description: z.string().min(10),
  price: z.number().int().nonnegative(), // IQD
  currency: z.string().min(3).max(6).optional(),
  imagePath: z.string().url().optional().nullable(),
  isPublished: z.boolean().optional(),
});

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        price: true,
        currency: true,
        imagePath: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ ok: true, data: courses });
  } catch (error) {
    console.error("GET /api/courses Error:", error);
    return NextResponse.json({ ok: false, error: "فشل جلب البيانات" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: "غير مخول" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = CourseCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "بيانات غير صالحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const created = await prisma.course.create({
      data: {
        slug: parsed.data.slug,
        title: parsed.data.title,
        description: parsed.data.description,
        price: parsed.data.price,
        currency: parsed.data.currency ?? "IQD",
        imagePath: parsed.data.imagePath ?? null,
        isPublished: parsed.data.isPublished ?? false,
      },
    });

    return NextResponse.json({ ok: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/courses Error:", error);
    return NextResponse.json({ ok: false, error: "فشل حفظ الكورس" }, { status: 500 });
  }
}
