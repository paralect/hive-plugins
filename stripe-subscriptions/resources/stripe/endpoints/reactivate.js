const Joi = require('joi');

const config = require('app-config');

const stripe = require('services/stripe');

module.exports.handler = async (ctx) => {
  if (ctx.state.user.subscription) {
    const subscription = await stripe.subscriptions.update(
      ctx.state.user.subscription.id,
      {
        cancel_at_period_end: false,
      }
    );

    ctx.body = { isReactivated: true, subscription };
  } else {
    ctx.body = { isReactivated: true };
  }
};

module.exports.middlewares = [
  require('middlewares/isAuthorized'),
];

module.exports.endpoint = {
  url: '/reactivate',
  method: 'post',
};

module.exports.requestSchema = Joi.object({});