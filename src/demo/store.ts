import { type Campaign, type User } from "@prisma/client";

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  programme: string;
  studentNumber: string;
  institutionUserId: string;
  walletAddress: string;
  fundingRequestId: string;
};

export type FundingRequest = {
  id: string;
  studentId: string;
  institutionUserId: string;
  title: string;
  about: string;
  amount: number;
  walletAddress: string;
  imageUrl: string | null;
  status: "open" | "funded" | "closed";
};

export type Donor = {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  kind: "foundation" | "alumni" | "corporate" | "guest";
};

export type DemoTransaction = {
  id: string;
  donorId: string;
  donorName: string;
  fundingRequestId: string;
  studentId: string;
  amount: string;
  assetCode: string;
  assetScale: number;
  status: "completed" | "pending" | "failed";
  description: string;
  quoteId?: string;
  createdAt: string;
};

export type SimulatedIncomingPayment = {
  id: string;
  walletAddress: string;
  completed: boolean;
  incomingAmount: { value: string; assetCode: string; assetScale: number };
  receivedAmount: { value: string; assetCode: string; assetScale: number };
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  methods: [];
};

export type SimulatedQuote = {
  id: string;
  walletAddress: string;
  receiver: string;
  receiveAmount: { value: string; assetCode: string; assetScale: number };
  debitAmount: { value: string; assetCode: string; assetScale: number };
  method: "ilp";
  createdAt: string;
  incomingPaymentId: string;
};

export type SimulatedGrant = {
  token: string;
  continueUri: string;
  quoteId: string;
  walletAddress: string;
  debitAmount?: SimulatedQuote["debitAmount"];
  receiveAmount?: SimulatedQuote["receiveAmount"];
};

export type DemoStore = {
  users: User[];
  campaigns: Campaign[];
  students: Student[];
  fundingRequests: FundingRequest[];
  donors: Donor[];
  transactions: DemoTransaction[];
  incomingPayments: Map<string, SimulatedIncomingPayment>;
  quotes: Map<string, SimulatedQuote>;
  grants: Map<string, SimulatedGrant>;
};

const globalForDemo = globalThis as unknown as {
  demoStore?: DemoStore;
};

const UCT_IMAGE =
  "https://www.lstmed.ac.uk/sites/default/files/styles/mc-580-16x9-node/public/content/pages/images/UCT.jpeg?itok=O0dc31th";
const SUN_IMAGE =
  "https://yiba.co.za/wp-content/uploads/2021/04/Stellenbosch_University_new_logo_for-web-01.jpg";

function createSeed(): DemoStore {
  const users: User[] = [
    {
      id: "inst_uct",
      userId: "user_demo_uct",
      email: "FinancialAid@uct.ac.za",
      firstName: "University of Cape Town",
      about:
        "UCT financial aid office. NSFAS and donor funds are paid to students over Open Payments on the Interledger network.",
      instagram: "https://www.instagram.com/uct",
      twitter: "https://twitter.com/uct",
      linkedin: "https://www.linkedin.com/school/university-of-cape-town/",
      imageUrl: UCT_IMAGE,
    },
    {
      id: "124",
      userId: "123457",
      email: "nsfas@sun.ac.za",
      firstName: "Stellenbosch University",
      about:
        "Stellenbosch University student funding office. Bursaries are disbursed to student wallet addresses.",
      instagram: "https://www.instagram.com/stellenboschuni",
      twitter: "https://twitter.com/StellenboschUni",
      linkedin: "https://www.linkedin.com/school/stellenbosch-university/",
      imageUrl: SUN_IMAGE,
    },
  ];

  const students: Student[] = [
    {
      id: "stu_amahle",
      firstName: "Amahle",
      lastName: "Dlamini",
      programme: "BSc Computer Science",
      studentNumber: "UCT20240018",
      institutionUserId: "user_demo_uct",
      walletAddress: "$ilp.rafiki.money/amahle",
      fundingRequestId: "fund_amahle",
    },
    {
      id: "stu_thabo",
      firstName: "Thabo",
      lastName: "Nkosi",
      programme: "MBChB Medicine",
      studentNumber: "UCT20240142",
      institutionUserId: "user_demo_uct",
      walletAddress: "$ilp.rafiki.money/thabo",
      fundingRequestId: "fund_thabo",
    },
    {
      id: "stu_lerato",
      firstName: "Lerato",
      lastName: "Molefe",
      programme: "BCom Accounting",
      studentNumber: "UCT20240881",
      institutionUserId: "user_demo_uct",
      walletAddress: "$ilp.rafiki.money/lerato",
      fundingRequestId: "fund_lerato",
    },
    {
      id: "stu_pieter",
      firstName: "Pieter",
      lastName: "van Wyk",
      programme: "BEng Mechanical Engineering",
      studentNumber: "SUN20240310",
      institutionUserId: "123457",
      walletAddress: "$ilp.rafiki.money/pieter",
      fundingRequestId: "fund_pieter",
    },
  ];

  const fundingRequests: FundingRequest[] = [
    {
      id: "fund_amahle",
      studentId: "stu_amahle",
      institutionUserId: "user_demo_uct",
      title: "Amahle Dlamini",
      about:
        "BSc Computer Science at UCT. Request covers 2024 tuition and residence for a first-generation student from Khayelitsha.",
      amount: 48000,
      walletAddress: "$ilp.rafiki.money/amahle",
      imageUrl: "https://picsum.photos/id/64/500/1000",
      status: "open",
    },
    {
      id: "fund_thabo",
      studentId: "stu_thabo",
      institutionUserId: "user_demo_uct",
      title: "Thabo Nkosi",
      about:
        "MBChB at UCT. Funding request for clinical-year tuition not fully covered by the NSFAS cap.",
      amount: 62000,
      walletAddress: "$ilp.rafiki.money/thabo",
      imageUrl: "https://picsum.photos/id/177/500/1000",
      status: "open",
    },
    {
      id: "fund_lerato",
      studentId: "stu_lerato",
      institutionUserId: "user_demo_uct",
      title: "Lerato Molefe",
      about:
        "BCom Accounting at UCT. Accommodation and learning-materials allowance for the 2024 academic year.",
      amount: 35000,
      walletAddress: "$ilp.rafiki.money/lerato",
      imageUrl: "https://picsum.photos/id/338/500/1000",
      status: "open",
    },
    {
      id: "fund_pieter",
      studentId: "stu_pieter",
      institutionUserId: "123457",
      title: "Pieter van Wyk",
      about:
        "BEng Mechanical Engineering at Stellenbosch. Workshop fees and residence shortfall.",
      amount: 41000,
      walletAddress: "$ilp.rafiki.money/pieter",
      imageUrl: "https://picsum.photos/id/433/500/1000",
      status: "open",
    },
  ];

  const campaigns: Campaign[] = fundingRequests.map((request) => ({
    id: request.id,
    title: request.title,
    about: request.about,
    amount: request.amount,
    walletAddress: request.walletAddress,
    imageUrl: request.imageUrl,
    userId: request.institutionUserId,
  }));

  const donors: Donor[] = [
    {
      id: "donor_ilf",
      name: "Interledger Foundation",
      email: "grants@interledger.org",
      walletAddress: "$ilp.rafiki.money/interledger",
      kind: "foundation",
    },
    {
      id: "donor_alumni",
      name: "UCT Alumni Fund",
      email: "alumni@uct.ac.za",
      walletAddress: "$ilp.rafiki.money/uct-alumni",
      kind: "alumni",
    },
    {
      id: "donor_finhub",
      name: "Cape Town Financial Hub",
      email: "hello@financialhub.capetown",
      walletAddress: "$ilp.rafiki.money/finhub",
      kind: "corporate",
    },
  ];

  const transactions: DemoTransaction[] = [
    {
      id: "txn_seed_1",
      donorId: "donor_ilf",
      donorName: "Interledger Foundation",
      fundingRequestId: "fund_amahle",
      studentId: "stu_amahle",
      amount: "5000.00",
      assetCode: "ZAR",
      assetScale: 2,
      status: "completed",
      description: "Hackathon seed bursary via simulated Open Payments",
      createdAt: "2024-06-12T09:00:00.000Z",
    },
    {
      id: "txn_seed_2",
      donorId: "donor_alumni",
      donorName: "UCT Alumni Fund",
      fundingRequestId: "fund_thabo",
      studentId: "stu_thabo",
      amount: "2500.00",
      assetCode: "ZAR",
      assetScale: 2,
      status: "completed",
      description: "Alumni top-up for clinical year costs",
      createdAt: "2024-07-03T11:30:00.000Z",
    },
    {
      id: "txn_seed_3",
      donorId: "donor_finhub",
      donorName: "Cape Town Financial Hub",
      fundingRequestId: "fund_lerato",
      studentId: "stu_lerato",
      amount: "1000.00",
      assetCode: "ZAR",
      assetScale: 2,
      status: "completed",
      description: "Financial Hub learning-materials grant",
      createdAt: "2024-08-19T15:10:00.000Z",
    },
  ];

  return {
    users,
    campaigns,
    students,
    fundingRequests,
    donors,
    transactions,
    incomingPayments: new Map(),
    quotes: new Map(),
    grants: new Map(),
  };
}

export function getDemoStore(): DemoStore {
  globalForDemo.demoStore ??= createSeed();
  return globalForDemo.demoStore;
}

export function resetDemoStore(): DemoStore {
  const next = createSeed();
  const current = getDemoStore();
  current.users = next.users;
  current.campaigns = next.campaigns;
  current.students = next.students;
  current.fundingRequests = next.fundingRequests;
  current.donors = next.donors;
  current.transactions = next.transactions;
  current.incomingPayments = next.incomingPayments;
  current.quotes = next.quotes;
  current.grants = next.grants;
  return current;
}

export function normalizeWalletAddress(walletAddress: string): string {
  if (walletAddress.startsWith("$")) {
    return walletAddress.replace("$", "https://");
  }
  return walletAddress;
}

export function walletKey(walletAddress: string): string {
  return normalizeWalletAddress(walletAddress).replace(/\/$/, "").toLowerCase();
}

export function syncCampaignRecord(campaign: Campaign): void {
  const store = getDemoStore();
  const existingRequest = store.fundingRequests.find(
    (request) => request.id === campaign.id,
  );
  const existingStudent = store.students.find(
    (student) => student.fundingRequestId === campaign.id,
  );
  const studentId = existingRequest?.studentId ?? existingStudent?.id ?? `stu_${campaign.id}`;
  const [firstName, ...rest] = campaign.title.split(" ");
  const lastName = rest.join(" ");

  const request: FundingRequest = {
    id: campaign.id,
    studentId,
    institutionUserId: campaign.userId,
    title: campaign.title,
    about: campaign.about,
    amount: campaign.amount,
    walletAddress: campaign.walletAddress,
    imageUrl: campaign.imageUrl,
    status: existingRequest?.status ?? "open",
  };

  if (existingRequest) {
    Object.assign(existingRequest, request);
  } else {
    store.fundingRequests.push(request);
  }

  const student: Student = {
    id: studentId,
    firstName: firstName ? firstName : campaign.title,
    lastName,
    programme: existingStudent?.programme ?? "Student funding request",
    studentNumber: existingStudent?.studentNumber ?? campaign.id,
    institutionUserId: campaign.userId,
    walletAddress: campaign.walletAddress,
    fundingRequestId: campaign.id,
  };

  if (existingStudent) {
    Object.assign(existingStudent, student);
  } else {
    store.students.push(student);
  }
}

export function removeCampaignRecord(id: string): void {
  const store = getDemoStore();
  const request = store.fundingRequests.find((item) => item.id === id);
  store.fundingRequests = store.fundingRequests.filter((item) => item.id !== id);
  store.students = store.students.filter(
    (student) => student.fundingRequestId !== id && student.id !== request?.studentId,
  );
  store.campaigns = store.campaigns.filter((campaign) => campaign.id !== id);
}

export function findOrCreateDonor(walletAddress: string): Donor {
  const store = getDemoStore();
  const key = walletKey(walletAddress);
  const existing = store.donors.find(
    (donor) => walletKey(donor.walletAddress) === key,
  );
  if (existing) return existing;

  const donor: Donor = {
    id: `donor_${crypto.randomUUID()}`,
    name: walletAddress,
    email: "demo-payer@example.com",
    walletAddress,
    kind: "guest",
  };
  store.donors.push(donor);
  return donor;
}

export function recordTransaction(input: {
  donor: Donor;
  fundingRequestId: string;
  studentId: string;
  amount: string;
  quoteId?: string;
  description: string;
}): DemoTransaction {
  const store = getDemoStore();
  const transaction: DemoTransaction = {
    id: `txn_${crypto.randomUUID()}`,
    donorId: input.donor.id,
    donorName: input.donor.name,
    fundingRequestId: input.fundingRequestId,
    studentId: input.studentId,
    amount: input.amount,
    assetCode: "ZAR",
    assetScale: 2,
    status: "completed",
    description: input.description,
    quoteId: input.quoteId,
    createdAt: new Date().toISOString(),
  };
  store.transactions.unshift(transaction);
  return transaction;
}
