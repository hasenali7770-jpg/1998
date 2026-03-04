import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/providers/stripe";
import { requireUser } from "@/lib/auth";

const BodySchema = z.object({
  orderId: z.string().uuid(),
});

/**
 * Creates Stripe Checkout session for the given order.
 * NOTE: Stripe currency support depends on your account and region.
 */
export async function POST(req: Request) {
  const { user, profile } = await requireUser();
  if (!user || !profile) return NextResponse.json({ ok: false, error: "يجب تسجيل الدخول" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ ok: false, error: "بيانات غير صالحة" }, { status: 400 });

    const order = await prisma.order.findFirst({
      where: { id: parsed.data.orderId, userId: profile.id, provider: "stripe" },
      include: { course: true },
    });
    if (!order) return NextResponse.json({ ok: false, error: "الطلب غير موجود" }, { status: 404 });

    const appUrl = process.env.APP_URL;
    if (!appUrl) throw new Error("Missing APP_URL");

    // Stripe amount is in the smallest currency unit (e.g., cents).
    // If you use USD, convert IQD to USD in your pricing strategy.
    const currency = (process.env.STRIPE_CURRENCY ?? "usd").toLowerCase();

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${appUrl}/payment/success?provider=stripe&orderId=${order.id}`,
      cancel_url: `${appUrl}/payment/failed?provider=stripe&orderId=${order.id}`,
      metadata: { orderId: order.id, courseId: order.courseId, userId: order.userId },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: order.amount, // make sure it's in smallest unit for selected currency
            product_data: {
              name: order.course.title,
              description: order.course.slug,
            },
          },
        },
      ],
    });

    await prisma.$transaction([
      prisma.order.update({ where: { id: order.id }, data: { providerRef: session.id } }),
      prisma.payment.create({
        data: {
          orderId: order.id,
          provider: "stripe",
          status: "pending",
          amount: order.amount,
          currency,
          raw: { sessionId: session.id },
        },
      }),
    ]);

    return NextResponse.json({ ok: true, data: { checkoutUrl: session.url } });
  } catch (e) {
    console.error("Stripe checkout error:", e);
    return NextResponse.json({ ok: false, error: "فشل إنشاء جلسة الدفع" }, { status: 500 });
  }
}
