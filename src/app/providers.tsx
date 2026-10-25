/* eslint-disable @typescript-eslint/unbound-method */
"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { TRPCReactProvider } from "$/src/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { isDemoMode } from "$/src/demo/mode";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  const tree = (
    <TRPCReactProvider>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </NextUIProvider>
    </TRPCReactProvider>
  );

  if (isDemoMode()) return tree;

  return <ClerkProvider>{tree}</ClerkProvider>;
}
