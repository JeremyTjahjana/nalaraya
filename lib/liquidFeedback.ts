import type { State } from "./lab";

// Observe accepted state changes, so rejected actions never look successful.
export function liquidFeedback(before: State, after: State) {
  if (after.step < before.step || after.feedback || after.finished) return null;
  if (before.step === 2 && after.step === 3) return "rinse";
  if (before.step === 3 && after.step === 4) return "fill";
  if (!before.pipetteLoaded && after.pipetteLoaded) return "aspirate";
  if (before.step === 5 && after.step === 6) return "transfer";
  if (!before.indicator && after.indicator) return "indicator";
  if (after.volume > before.volume) return "dose";
  if (
    after.step === 8 &&
    after.log !== before.log &&
    after.log.at(-1)?.text === "Labu diaduk perlahan."
  )
    return "swirl";
  return null;
}
export type LiquidFeedback = NonNullable<ReturnType<typeof liquidFeedback>>;
