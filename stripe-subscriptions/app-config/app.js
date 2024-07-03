const assertEnv = require('app-config/assertEnv');

// assertEnv(['STRIPE_SECRET', 'STRIPE_WEBHOOK_SECRET', 'STRIPE_PRICES']);

module.exports = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET,

    webhookSecret:
      process.env.STRIPE_WEBHOOK_SECRET,

    plans: (process.env.STRIPE_PRICES || '').split(',').map(priceId => ({
      priceId
    })),
  }
};