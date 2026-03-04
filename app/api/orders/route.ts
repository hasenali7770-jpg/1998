import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateOrderSchema } from "@/lib/payments";
import { requireUser } from "@/lib/auth";

/**
 * Create a pending order for a course and return provider-specific checkout info.
 *
 * Providers:
 * - zaincash: returns { redirectUrl }
 * - qicard: returns { redirectUrl }
 * - stripe: returns { checkoutUrl }
 */
export async function POST(req: Request) {
  const { user, profile } = await requireUser();
  if (!user || !profile) {
    return NextResponse.json({ ok: false, error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "بيانات غير صالحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const course = await prisma.course.findFirst({
      where: { id: parsed.data.courseId, isPublished: true },
    });

    if (!course) {
      return NextResponse.json({ ok: false, error: "الكورس غير موجود" }, { status: 404 });
    }

    // If already enrolled, no need to pay again
    const existing = await prisma.enrollment.findFirst({
      where: { userId: profile.id, courseId: course.id },
    });
    if (existing) {
      return NextResponse.json({ ok: true, data: { alreadyEnrolled: true } });
    }

    const order = await prisma.order.create({
      data: {
        userId: profile.id,
        courseId: course.id,
        amount: course.price,
        currency: course.currency,
        status: "pending",
        provider: parsed.data.provider,
      },
    });

    // Provider integration is handled by dedicated endpoints:
    // - /api/payments/zaincash/initiate
    // - /api/payments/qicard/initiate
    // - /api/payments/stripe/checkout
    //
    // Client can call those endpoints with { orderId }.
    return NextResponse.json({ ok: true, data: { orderId: order.id } }, { status: 201 });
  } catch (e) {
    console.error("POST /api/orders error:", e);
    return NextResponse.json({ ok: false, error: "فشل إنشاء الطلب" }, { status: 500 });
  }
}
