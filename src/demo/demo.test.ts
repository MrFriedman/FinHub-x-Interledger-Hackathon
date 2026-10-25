import { beforeAll, describe, expect, test } from "vitest";
import { resolveDemoMode } from "$/src/demo/resolve-demo-mode.js";

const secrets = {
  DATABASE_URL: "postgresql://tippy_admin:tippy@localhost:5432/tippy",
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_example",
  CLERK_SECRET_KEY: "sk_test_example",
  OPEN_PAYMENTS_CLIENT_ADDRESS: "https://ilp.rafiki.money/demo",
  OPEN_PAYMENTS_SECRET_KEY_PATH: "private.key",
  OPEN_PAYMENTS_KEY_ID: "key-id",
};

describe("resolveDemoMode", () => {
  test("turns on when clerk or database env is missing", () => {
    expect(resolveDemoMode({})).toBe(true);
    expect(
      resolveDemoMode({
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        CLERK_SECRET_KEY: secrets.CLERK_SECRET_KEY,
      }),
    ).toBe(true);
    expect(resolveDemoMode({ DATABASE_URL: secrets.DATABASE_URL })).toBe(true);
  });

  test("stays off when clerk and database env are set", () => {
    expect(resolveDemoMode(secrets)).toBe(false);
  });

  test("honours an explicit flag", () => {
    expect(
      resolveDemoMode({ ...secrets, NEXT_PUBLIC_DEMO_MODE: "true" }),
    ).toBe(true);
    expect(resolveDemoMode({ NEXT_PUBLIC_DEMO_MODE: "false" })).toBe(false);
  });

  test("isDemoMode stays off when the public flag is false", async () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = "false";
    const { isDemoMode } = await import("$/src/demo/mode");
    expect(isDemoMode()).toBe(false);
    delete process.env.NEXT_PUBLIC_DEMO_MODE;
  });
});

describe("demo tRPC data", () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_DEMO_MODE = "true";
    process.env.SKIP_ENV_VALIDATION = "1";
    delete process.env.DATABASE_URL;
    delete process.env.CLERK_SECRET_KEY;
    delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    delete process.env.OPEN_PAYMENTS_CLIENT_ADDRESS;
    delete process.env.OPEN_PAYMENTS_SECRET_KEY_PATH;
    delete process.env.OPEN_PAYMENTS_KEY_ID;
  });

  test("serves seeded students, funding requests, donors, and transactions", async () => {
    const { resetDemoStore } = await import("$/src/demo/store");
    const { createCaller } = await import("$/src/server/api/root");
    const { createInnerTRPCContext } = await import("$/src/server/api/trpc");
    resetDemoStore();

    const caller = createCaller(
      await createInnerTRPCContext({
        sessionId: "demo_session",
        userId: "user_demo_uct",
      }),
    );

    const students = await caller.platform.students();
    const funding = await caller.platform.fundingRequests({
      institutionUserId: "user_demo_uct",
    });
    const donors = await caller.platform.donors();
    const transactions = await caller.platform.transactions({
      fundingRequestId: "fund_amahle",
    });
    const campaigns = await caller.campaigns.get({ userId: "user_demo_uct" });

    expect(students.data.map((student) => student.id)).toContain("stu_amahle");
    expect(funding.data).toHaveLength(3);
    expect(donors.data.map((donor) => donor.id)).toContain("donor_ilf");
    expect(transactions.data[0]?.donorName).toBe("Interledger Foundation");
    expect(campaigns.data.map((campaign) => campaign.id)).toContain(
      "fund_amahle",
    );
  });

  test("simulates an Open Payments disbursement without credentials", async () => {
    const { resetDemoStore } = await import("$/src/demo/store");
    const { createCaller } = await import("$/src/server/api/root");
    const { createInnerTRPCContext } = await import("$/src/server/api/trpc");
    resetDemoStore();

    const caller = createCaller(
      await createInnerTRPCContext({
        sessionId: "demo_session",
        userId: "user_demo_uct",
      }),
    );

    const wallet = await caller.openPayments.getWalletDetails({
      walletAddress: "$ilp.rafiki.money/amahle",
    });
    expect(wallet.data.assetCode).toBe("ZAR");
    expect(wallet.data.authServer).toContain("demo.auth.interledger.test");

    const incoming = await caller.openPayments.createIncomingPayment({
      walletAddress: "$ilp.rafiki.money/uct-alumni",
      receiverAddress: "$ilp.rafiki.money/amahle",
      value: "150",
    });
    const quote = await caller.openPayments.createQoute({
      walletAddress: "$ilp.rafiki.money/uct-alumni",
      incomingPaymentUrl: incoming.data.id,
    });
    const authorization =
      await caller.openPayments.getOutgoingPaymentAuthorization({
        walletAddress: "$ilp.rafiki.money/uct-alumni",
        qouteId: quote.data.id,
        redirectUrl: "https://demo.example/campaign/fund_amahle",
        debitAmount: quote.data.debitAmount,
        receiveAmount: quote.data.receiveAmount,
      });

    expect(authorization.data.interact.redirect).toContain(
      "interact_ref=demo_interact_ref",
    );

    const outgoing = await caller.openPayments.createOutgoingPayment({
      walletAddress: "$ilp.rafiki.money/uct-alumni",
      qouteId: quote.data.id,
      interactRef: "demo_interact_ref",
      continueAccessToken: authorization.data.continue.access_token.value,
      continueUri: authorization.data.continue.uri,
    });

    expect(outgoing.data.failed).toBe(false);

    const transactions = await caller.platform.transactions({
      fundingRequestId: "fund_amahle",
    });
    expect(transactions.data.some((transaction) => transaction.amount === "150")).toBe(
      true,
    );
  });
});
