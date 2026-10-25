import { type OPAuthSchema, type OPCreateSchema } from "$/src/server/api/schemas/openPayments";
import {
  findOrCreateDonor,
  getDemoStore,
  normalizeWalletAddress,
  recordTransaction,
  walletKey,
} from "$/src/demo/store";

const ASSET = { assetCode: "ZAR", assetScale: 2 };
const AUTH_SERVER = "https://demo.auth.interledger.test";
const RESOURCE_SERVER = "https://demo.resource.interledger.test";

function amount(value: string) {
  return { value, ...ASSET };
}

function ok<T>(message: string, data: T) {
  return { success: true as const, message, data };
}

export function withDemoInteractRef(redirectUrl: string): string {
  try {
    const url = new URL(redirectUrl);
    url.searchParams.set("interact_ref", "demo_interact_ref");
    return url.toString();
  } catch {
    const joiner = redirectUrl.includes("?") ? "&" : "?";
    return `${redirectUrl}${joiner}interact_ref=demo_interact_ref`;
  }
}

export const demoOpenPayments = {
  getWalletDetails: (input: { walletAddress: string }) => {
    const id = normalizeWalletAddress(input.walletAddress);
    const store = getDemoStore();
    const key = walletKey(input.walletAddress);
    const known =
      store.fundingRequests.find((request) => walletKey(request.walletAddress) === key) ??
      store.donors.find((donor) => walletKey(donor.walletAddress) === key);

    return ok("wallet details obtained", {
      id,
      publicName: known
        ? "title" in known
          ? known.title
          : known.name
        : "Simulated Open Payments wallet",
      assetCode: ASSET.assetCode,
      assetScale: ASSET.assetScale,
      authServer: AUTH_SERVER,
      resourceServer: RESOURCE_SERVER,
      simulated: true,
    });
  },

  createIncomingPayment: (input: {
    walletAddress: string;
    receiverAddress: string;
    value: string;
  }) => {
    const store = getDemoStore();
    const id = `${RESOURCE_SERVER}/incoming-payments/${crypto.randomUUID()}`;
    const incoming = {
      id,
      walletAddress: normalizeWalletAddress(input.receiverAddress),
      completed: false,
      incomingAmount: amount(input.value || "0"),
      receivedAmount: amount("0"),
      expiresAt: new Date(Date.now() + 60_000 * 10).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      methods: [] as [],
    };
    store.incomingPayments.set(id, incoming);
    return ok("incoming payment created", incoming);
  },

  createQuote: (input: { walletAddress: string; incomingPaymentUrl: string }) => {
    const store = getDemoStore();
    const incoming = store.incomingPayments.get(input.incomingPaymentUrl);
    const value = incoming?.incomingAmount.value ?? "0";
    const id = `${RESOURCE_SERVER}/quotes/${crypto.randomUUID()}`;
    const quote = {
      id,
      walletAddress: normalizeWalletAddress(input.walletAddress),
      receiver: input.incomingPaymentUrl,
      receiveAmount: amount(value),
      debitAmount: amount(value),
      method: "ilp" as const,
      createdAt: new Date().toISOString(),
      incomingPaymentId: input.incomingPaymentUrl,
    };
    store.quotes.set(id, quote);
    return ok("qoute created", quote);
  },

  getOutgoingPaymentAuthorization: (input: OPAuthSchema) => {
    const store = getDemoStore();
    const token = `demo_continue_${crypto.randomUUID()}`;
    const continueUri = `${AUTH_SERVER}/continue/${token}`;
    store.grants.set(token, {
      token,
      continueUri,
      quoteId: input.qouteId,
      walletAddress: input.walletAddress,
      debitAmount: input.debitAmount,
      receiveAmount: input.receiveAmount,
    });

    return ok("wallet details obtained", {
      continue: {
        access_token: { value: token },
        uri: continueUri,
      },
      interact: {
        redirect: withDemoInteractRef(input.redirectUrl),
      },
    });
  },

  createOutgoingPayment: (input: OPCreateSchema) => {
    const store = getDemoStore();
    const grant = store.grants.get(input.continueAccessToken);
    if (!grant || !input.interactRef) {
      return ok("outgoing payment created", { failed: true });
    }

    const quote = store.quotes.get(input.qouteId);
    const incoming = quote
      ? store.incomingPayments.get(quote.incomingPaymentId)
      : undefined;
    const receiverWallet = incoming?.walletAddress ?? "";
    const request = store.fundingRequests.find(
      (item) => walletKey(item.walletAddress) === walletKey(receiverWallet),
    );
    const value =
      quote?.debitAmount.value ??
      grant.debitAmount?.value ??
      incoming?.incomingAmount.value ??
      "0";
    const donor = findOrCreateDonor(input.walletAddress);

    if (request) {
      recordTransaction({
        donor,
        fundingRequestId: request.id,
        studentId: request.studentId,
        amount: value,
        quoteId: quote?.id,
        description: "Simulated Open Payments disbursement",
      });
    }

    if (incoming) incoming.completed = true;

    return ok("outgoing payment created", {
      id: `${RESOURCE_SERVER}/outgoing-payments/${crypto.randomUUID()}`,
      walletAddress: normalizeWalletAddress(input.walletAddress),
      quoteId: input.qouteId,
      failed: false,
      receiver: quote?.receiver ?? receiverWallet,
      receiveAmount: amount(value),
      debitAmount: amount(value),
      sentAmount: amount(value),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      simulated: true,
    });
  },
};
