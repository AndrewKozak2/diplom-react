// Client-side format check for a promo code, independent of whether it
// actually exists on the server (src/pages/Checkout.jsx handles that lookup
// separately via handlePromoApply).

const PROMO_CODE_PATTERN = /^[A-Z0-9]{4,12}$/;

export function isValidPromoCodeFormat(code) {
  return PROMO_CODE_PATTERN.test((code || "").trim().toUpperCase());
}
