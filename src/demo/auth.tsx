"use client";

import {
  SignedIn as ClerkSignedIn,
  SignedOut as ClerkSignedOut,
  UserButton as ClerkUserButton,
  useUser,
} from "@clerk/nextjs";
import { demoClerkUser } from "$/src/demo/demo-user";

const demo =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
  process.env.NEXT_PUBLIC_DEMO_MODE === "1";

type AppUserState = {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: {
    id: string;
    firstName: string | null;
    primaryEmailAddress: { emailAddress: string } | null;
    imageUrl?: string;
  } | null;
};

function useDemoAppUser(): AppUserState {
  return {
    isLoaded: true,
    isSignedIn: true,
    user: demoClerkUser,
  };
}

function useClerkAppUser(): AppUserState {
  const clerk = useUser();
  return {
    isLoaded: clerk.isLoaded,
    isSignedIn: Boolean(clerk.isSignedIn),
    user: clerk.user
      ? {
          id: clerk.user.id,
          firstName: clerk.user.firstName,
          primaryEmailAddress: clerk.user.primaryEmailAddress
            ? {
                emailAddress: clerk.user.primaryEmailAddress.emailAddress,
              }
            : null,
          imageUrl: clerk.user.imageUrl,
        }
      : null,
  };
}

export const useAppUser = demo ? useDemoAppUser : useClerkAppUser;

function DemoSignedIn({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function DemoSignedOut(_props: { children?: React.ReactNode }) {
  return null;
}

function DemoUserButton(_props: {
  afterSignOutUrl?: string;
  userProfileUrl?: string;
  userProfileMode?: "navigation" | "modal";
}) {
  return (
    <a
      href="/profile"
      className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground"
    >
      UCT demo
    </a>
  );
}

export const SignedIn = demo ? DemoSignedIn : ClerkSignedIn;

export const SignedOut = demo ? DemoSignedOut : ClerkSignedOut;

export const UserButton = demo ? DemoUserButton : ClerkUserButton;
