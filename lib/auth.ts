import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function requireUser() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { user: null, profile: null };
  }

  const profile = await prisma.user.findUnique({
    where: { supabaseId: data.user.id },
  });

  return { user: data.user, profile };
}

export async function requireAdmin() {
  const { user, profile } = await requireUser();

  if (!user || !profile || profile.role !== Role.admin) {
    return { ok: false as const, user: null, profile: null };
  }

  return { ok: true as const, user, profile };
}
