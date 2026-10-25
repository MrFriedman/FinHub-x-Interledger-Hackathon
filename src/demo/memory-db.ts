import { type Campaign, type User } from "@prisma/client";
import {
  getDemoStore,
  removeCampaignRecord,
  syncCampaignRecord,
} from "$/src/demo/store";

type Where = Record<string, unknown> | undefined;

function matches(row: object, where?: Where): boolean {
  if (!where) return true;
  return Object.entries(where).every(([key, value]) => {
    if (value === undefined) return true;
    return (row as Record<string, unknown>)[key] === value;
  });
}

function assignDefined(target: object, data: Record<string, unknown>) {
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    if (key === "user") continue;
    (target as Record<string, unknown>)[key] = value;
  }
}

function campaignFromCreate(data: Record<string, unknown>): Campaign {
  const connect = data.user as { connect?: { userId?: string } } | undefined;
  const connectedUserId = connect?.connect?.userId;
  const userId =
    typeof data.userId === "string" && data.userId
      ? data.userId
      : (connectedUserId ?? "");

  return {
    id: typeof data.id === "string" && data.id ? data.id : crypto.randomUUID(),
    title: typeof data.title === "string" ? data.title : "",
    about: typeof data.about === "string" ? data.about : "",
    amount: Number(data.amount ?? 0),
    walletAddress:
      typeof data.walletAddress === "string" ? data.walletAddress : "",
    imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : null,
    userId,
  };
}

function userFromCreate(data: Record<string, unknown>): User {
  return {
    id: typeof data.id === "string" && data.id ? data.id : crypto.randomUUID(),
    userId: typeof data.userId === "string" ? data.userId : crypto.randomUUID(),
    email: typeof data.email === "string" ? data.email : "",
    firstName: typeof data.firstName === "string" ? data.firstName : "",
    about: typeof data.about === "string" ? data.about : null,
    instagram: typeof data.instagram === "string" ? data.instagram : null,
    twitter: typeof data.twitter === "string" ? data.twitter : null,
    linkedin: typeof data.linkedin === "string" ? data.linkedin : null,
    imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : null,
  };
}

export function getMemoryDb() {
  const store = getDemoStore();

  return {
    campaign: {
      findMany: ({ where }: { where?: Where } = {}) =>
        Promise.resolve(store.campaigns.filter((row) => matches(row, where))),
      findUnique: ({ where }: { where?: Where }) =>
        Promise.resolve(
          store.campaigns.find((row) => matches(row, where)) ?? null,
        ),
      delete: ({ where }: { where?: Where }) => {
        const row = store.campaigns.find((item) => matches(item, where));
        if (!row) {
          return Promise.reject(new Error("Campaign not found"));
        }
        removeCampaignRecord(row.id);
        return Promise.resolve(row);
      },
      deleteMany: ({ where }: { where?: Where } = {}) => {
        const removed = store.campaigns.filter((row) => matches(row, where));
        for (const row of removed) removeCampaignRecord(row.id);
        return Promise.resolve({ count: removed.length });
      },
      create: ({ data }: { data: Record<string, unknown> }) => {
        const campaign = campaignFromCreate(data);
        store.campaigns.push(campaign);
        syncCampaignRecord(campaign);
        return Promise.resolve(campaign);
      },
      upsert: ({
        where,
        update,
        create,
      }: {
        where?: Where;
        update: Record<string, unknown>;
        create: Record<string, unknown>;
      }) => {
        const existing = store.campaigns.find((row) => matches(row, where));
        if (!existing) {
          const campaign = campaignFromCreate(create);
          store.campaigns.push(campaign);
          syncCampaignRecord(campaign);
          return Promise.resolve(campaign);
        }
        assignDefined(existing, update);
        syncCampaignRecord(existing);
        return Promise.resolve(existing);
      },
    },
    user: {
      findMany: ({ where }: { where?: Where } = {}) =>
        Promise.resolve(store.users.filter((row) => matches(row, where))),
      findUnique: ({ where }: { where?: Where }) =>
        Promise.resolve(store.users.find((row) => matches(row, where)) ?? null),
      count: ({ where }: { where?: Where } = {}) =>
        Promise.resolve(store.users.filter((row) => matches(row, where)).length),
      create: ({ data }: { data: Record<string, unknown> }) => {
        const user = userFromCreate(data);
        store.users.push(user);
        return Promise.resolve(user);
      },
      update: ({
        where,
        data,
      }: {
        where?: Where;
        data: Record<string, unknown>;
      }) => {
        const existing = store.users.find((row) => matches(row, where));
        if (!existing) return Promise.reject(new Error("User not found"));
        assignDefined(existing, data);
        return Promise.resolve(existing);
      },
      delete: ({ where }: { where?: Where }) => {
        const index = store.users.findIndex((row) => matches(row, where));
        const existing = index >= 0 ? store.users[index] : undefined;
        if (!existing) return Promise.reject(new Error("User not found"));
        store.users.splice(index, 1);
        return Promise.resolve(existing);
      },
      deleteMany: ({ where }: { where?: Where } = {}) => {
        const before = store.users.length;
        const kept = store.users.filter((row) => !matches(row, where));
        store.users.splice(0, store.users.length, ...kept);
        return Promise.resolve({ count: before - kept.length });
      },
      upsert: ({
        where,
        update,
        create,
      }: {
        where?: Where;
        update: Record<string, unknown>;
        create: Record<string, unknown>;
      }) => {
        const existing = store.users.find((row) => matches(row, where));
        if (!existing) {
          const user = userFromCreate({ ...create, ...update });
          store.users.push(user);
          return Promise.resolve(user);
        }
        assignDefined(existing, update);
        return Promise.resolve(existing);
      },
    },
  };
}
