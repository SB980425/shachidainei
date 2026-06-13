export const paypal = {
  profileUrl: "https://paypal.me/agentsiteops",
  starterReviewUrl: "https://paypal.me/agentsiteops/29USD",
  launchBlueprintUrl: "https://paypal.me/agentsiteops/99USD",
  businessName: "AgentSiteOps",
  supportEmail: "sun19980425s@gmail.com"
};

export const starterOffer = {
  name: "AgentSiteOps Fit Review",
  price: 29,
  currency: "USD",
  href: paypal.starterReviewUrl,
  fit:
    "Best when the buyer is not ready to commit to the full Route File and needs a fast go, narrow, or stop decision.",
  delivery:
    "A manual 24-hour fit review covering buyer readiness, evidence gaps, purchase blockers, and whether the full Route File is worth buying.",
  timeline: "Manual delivery after payment confirmation and usable intake details."
};

export const primaryOffer = {
  name: "AgentSiteOps Research-to-Route File",
  price: 99,
  currency: "USD",
  href: paypal.launchBlueprintUrl,
  fit:
    "Best for an AI-capable solo builder or operator who can execute but needs one checked route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule.",
  delivery:
    "A manual 24-72 hour Route File covering the selected route, rejected alternatives, evidence ledger, first proof asset, validation channel, and stop rule.",
  timeline: "Manual delivery after payment confirmation and intake details."
};

export const paidOffers = [starterOffer, primaryOffer];
