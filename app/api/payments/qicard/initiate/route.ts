import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { qicardCreatePayment } from "@/lib/providers/qicard";
import { requireUser } from "@/lib/auth";

const BodySchema = z.object({
  orderId: z.string().uuid(),
});

export async function POST(req: Request) {
  const { user, profile } = await requireUser();
  if (!user || !profile) {
    return NextResponse.json({ ok: false, error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ ok: false, error: "بيانات غير صالحة" }, { status: 400 });

    const order = await prisma.order.findFirst({
      where: { id: parsed.data.orderId, userId: profile.id, provider: "qicard" },
      include: { course: true },
    });
    if (!order) return NextResponse.json({ ok: false, error: "الطلب غير موجود" }, { status: 404 });

    const appUrl = process.env.APP_URL;
    if (!appUrl) throw new Error("Missing APP_URL");

    const payment = await qicardCreatePayment({
      amountIQD: order.amount,
      finishPaymentUrl: `${appUrl}/payment/success?provider=qicard&orderId=${order.id}`,
      notificationUrl: `${appUrl}/api/payments/qicard/webhook`,
      locale: "ar_IQ",
      additionalInfo: { orderId: order.id, courseId: order.courseId },
    });

    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { providerRef: payment.paymentId },
      }),
      prisma.payment.create({
        data: {
          orderId: order.id,
          provider: "qicard",
          status: "pending",
          amount: order.amount,
          currency: order.currency,
          raw: payment as any,
        },
      }),
    ]);

    return NextResponse.json({ ok: true, data: { formUrl: payment.formUrl, paymentId: payment.paymentId } });
  } catch (e) {
    console.error("QiCard initiate error:", e);
    return NextResponse.json({ ok: false, error: "فشل تهيئة الدفع" }, { status: 500 });
  }
}
