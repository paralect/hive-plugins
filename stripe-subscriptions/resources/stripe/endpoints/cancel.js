const Joi = require('joi');

const stripe = require('services/stripe');

module.exports.handler = async (ctx) => {
  if (ctx.state.user.subscription) {
    const subscription = await stripe.subscriptions.update(
      ctx.state.user.subscription.id,
      {
        cancel_at_period_end: true,
      }
    );

    ctx.body = { isCancelled: true, subscription };
  } else {
    ctx.body = { isCancelled: true };
  }
};

module.exports.middlewares = [
  require('middlewares/isAuthorized'),
];

module.exports.endpoint = {
  url: '/cancel',
  method: 'post',
};

module.exports.requestSchema = Joi.object({
});