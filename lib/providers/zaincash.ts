import { randomUUID } from "crypto";

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
};

let cachedToken: { token: string; expiresAt: number } | null = null;

function getBaseUrl() {
  return process.env.ZAINCASH_BASE_URL ?? "https://pg-api-uat.zaincash.iq";
}

export async function getZainCashAccessToken(scopes = "payment:read payment:write") {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 30_000) return cachedToken.token;

  const clientId = process.env.ZAINCASH_CLIENT_ID;
  const clientSecret = process.env.ZAINCASH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing ZAINCASH_CLIENT_ID or ZAINCASH_CLIENT_SECRET");
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: scopes,
  });

  const res = await fetch(`${getBaseUrl()}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`ZainCash token error: ${res.status} ${txt}`);
  }

  const json = (await res.json()) as TokenResponse;
  cachedToken = { token: json.access_token, expiresAt: now + json.expires_in * 1000 };
  return json.access_token;
}

export type ZainCashInitResponse = {
  transactionId: string;
  redirectUrl: string;
};

export async function zaincashInitPayment(params: {
  orderId: string;
  amountIQD: number;
  customerPhone?: string | null;
  successUrl: string;
  failureUrl: string;
  notificationUrl?: string;
  serviceType: string;
  language?: "En" | "Ar" | "Ku";
}) {
  const token = await getZainCashAccessToken("payment:read payment:write");
  const externalReferenceId = randomUUID();

  const payload: any = {
    language: params.language ?? "Ar",
    externalReferenceId,
    orderId: params.orderId,
    serviceType: params.serviceType,
    amount: { value: params.amountIQD, currency: "IQD" },
    redirectUrls: {
      successUrl: params.successUrl,
      failureUrl: params.failureUrl,
    },
  };

  if (params.customerPhone) payload.customer = { phone: params.customerPhone };
  if (params.notificationUrl) payload.notificationUrl = params.notificationUrl;

  const res = await fetch(`${getBaseUrl()}/api/v2/payment-gateway/transaction/init`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`ZainCash init error: ${res.status} ${txt}`);
  }

  const json = (await res.json()) as ZainCashInitResponse;
  return { ...json, externalReferenceId };
}
