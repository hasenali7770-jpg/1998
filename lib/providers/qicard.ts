import { randomUUID } from "crypto";

function getBaseUrl() {
  return process.env.QICARD_API_HOST ?? "https://uat-sandbox-3ds-api.qi.iq";
}

function getBasicAuth() {
  const username = process.env.QICARD_USERNAME;
  const password = process.env.QICARD_PASSWORD;
  if (!username || !password) throw new Error("Missing QICARD_USERNAME or QICARD_PASSWORD");
  const token = Buffer.from(`${username}:${password}`).toString("base64");
  return `Basic ${token}`;
}

export type QiCardCreatePaymentResponse = {
  requestId: string;
  paymentId: string;
  status: string;
  amount: number;
  currency: string;
  formUrl: string;
};

export async function qicardCreatePayment(params: {
  amountIQD: number;
  finishPaymentUrl: string;
  notificationUrl: string;
  locale?: string; // e.g. en_US, ar_IQ
  additionalInfo?: Record<string, any>;
}) {
  const terminalId = process.env.QICARD_TERMINAL_ID;
  if (!terminalId) throw new Error("Missing QICARD_TERMINAL_ID");

  const requestId = randomUUID();

  const res = await fetch(`${getBaseUrl()}/api/v1/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Terminal-Id": terminalId,
      Authorization: getBasicAuth(),
    },
    body: JSON.stringify({
      requestId,
      amount: params.amountIQD,
      currency: "IQD",
      locale: params.locale ?? "ar_IQ",
      finishPaymentUrl: params.finishPaymentUrl,
      notificationUrl: params.notificationUrl,
      additionalInfo: params.additionalInfo ?? {},
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`QiCard create payment error: ${res.status} ${txt}`);
  }

  return (await res.json()) as QiCardCreatePaymentResponse;
}
