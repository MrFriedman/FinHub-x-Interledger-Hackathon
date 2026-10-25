import { isDemoMode } from "$/src/demo/mode";

export function DemoBanner() {
  if (!isDemoMode()) return null;

  return (
    <a
      href="https://dylanfriedman.co.za"
      className="relative z-50 block bg-amber-400 px-4 py-2 text-center text-sm font-semibold text-neutral-950 underline-offset-2 hover:underline"
    >
      Hackathon demo, 3rd place UCT Financial Hub x Interledger 2024
    </a>
  );
}
