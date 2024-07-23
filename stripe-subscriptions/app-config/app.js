import assertEnv from "app-config/assertEnv";
export const stripe = {
  secretKey: process.env.STRIPE_SECRET,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  plans: (process.env.STRIPE_PRICES || "").split(",").map((priceId) => ({
    priceId,
  })),
};
export default {
  stripe,
};
