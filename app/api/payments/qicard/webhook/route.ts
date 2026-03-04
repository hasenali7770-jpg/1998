import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * QiCard webhook: will send full payment object with status and paymentId.
 * Must respond 200 OK, otherwise they retry. (Per QiCard docs)
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => null);
    if (!payload?.paymentId) return NextResponse.json({ ok: true });

    const paymentId = String(payload.paymentId);
    const status = String(payload.status ?? "");

    const order = await prisma.order.findFirst({ where: { provider: "qicard", providerRef: paymentId } });
    if (!order) return NextResponse.json({ ok: true });

    if (order.status === "paid" || order.status === "failed" || order.status === "refunded") {
      return NextResponse.json({ ok: true });
    }

    if (status === "SUCCESS") {
      await prisma.$transaction([
        prisma.order.update({ where: { id: order.id }, data: { status: "paid" } }),
        prisma.payment.create({
          data: {
            orderId: order.id,
            provider: "qicard",
            status: "succeeded",
            amount: order.amount,
            currency: order.currency,
            raw: payload,
          },
        }),
        prisma.enrollment.upsert({
          where: { userId_courseId: { userId: order.userId, courseId: order.courseId } },
          update: {},
          create: { userId: order.userId, courseId: order.courseId },
        }),
      ]);
    } else if (status === "FAILED" || status === "AUTHENTICATION_FAILED") {
      await prisma.$transaction([
        prisma.order.update({ where: { id: order.id }, data: { status: "failed" } }),
        prisma.payment.create({
          data: {
            orderId: order.id,
            provider: "qicard",
            status: "failed",
            amount: order.amount,
            currency: order.currency,
            raw: payload,
          },
        }),
      ]);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("QiCard webhook error:", e);
    return NextResponse.json({ ok: true });
  }
}
