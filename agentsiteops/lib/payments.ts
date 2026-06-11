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
    "Best when the buyer is not ready to commit to the full blueprint and needs a fast go, narrow, or stop decision.",
  delivery:
    "A manual 24-hour fit review covering buyer readiness, evidence gaps, purchase blockers, and whether the full Launch Blueprint is worth buying.",
  timeline: "Manual delivery after payment confirmation and usable intake details."
};

export const primaryOffer = {
  name: "AgentSiteOps Launch Blueprint",
  price: 99,
  currency: "USD",
  href: paypal.launchBlueprintUrl,
  fit:
    "Best for an AI-capable solo builder who can execute but needs one clear offer, buyer, page structure, and outreach path.",
  delivery:
    "A manual 24-72 hour blueprint covering the first sellable offer, target buyer, landing page structure, pricing angle, outreach scripts, and 7-day validation sequence.",
  timeline: "Manual delivery after payment confirmation and intake details."
};

export const paidOffers = [starterOffer, primaryOffer];
