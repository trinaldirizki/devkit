/**
 * Build-time desktop (macOS app) flag.
 *
 * Set via NEXT_PUBLIC_DESKTOP=1 in desktop/build-app.sh only — Next inlines
 * NEXT_PUBLIC_* vars at compile time, so web (Vercel) builds evaluate this
 * to false and every desktop branch below is dead-code eliminated.
 */
export const IS_DESKTOP = process.env.NEXT_PUBLIC_DESKTOP === "1";
