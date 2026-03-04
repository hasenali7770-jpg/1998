import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/providers/stripe";
import { prisma } from "@/lib/prisma";

/**
 * Stripe webhook - requires raw body for signature verification.
 * Configure endpoint secret in STRIPE_WEBHOOK_SECRET
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const sig = headers().get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ ok: false, error: "Missing stripe signature/secret" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: any) {
    console.error("Stripe webhook signature verify failed:", err?.message ?? err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const orderId = session?.metadata?.orderId as string | undefined;

      if (orderId) {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (order && order.status !== "paid") {
          await prisma.$transaction([
            prisma.order.update({ where: { id: orderId }, data: { status: "paid" } }),
            prisma.payment.create({
              data: {
                orderId,
                provider: "stripe",
                status: "succeeded",
                amount: order.amount,
                currency: order.currency,
                raw: session,
              },
            }),
            prisma.enrollment.upsert({
              where: { userId_courseId: { userId: order.userId, courseId: order.courseId } },
              update: {},
              create: { userId: order.userId, courseId: order.courseId },
            }),
          ]);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("Stripe webhook handler error:", e);
    return NextResponse.json({ received: true });
  }
}
