const Joi = require('joi');

const userService = require('db').services.users;

const config = require('app-config');

const stripe = require('services/stripe');

let createCheckoutSession = async (ctx, { priceId }) => {
  const session = await stripe.checkout.sessions.create({
    customer: ctx.state.user.stripe.id,

    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],

    customer_update: {
      address: 'auto',
    },

    mode: 'subscription',
    success_url: config.stripe.successURl,
    metadata: { userId: ctx.state.user._id },
  });

  return session;
};

module.exports.handler = async (ctx) => {
  let { priceId = config.stripe.plans[0].priceId } = ctx.validatedData;

  if (!ctx.state.user.stripe) {
    let stripeCustomer = await stripe.customers.create({
      name: ctx.state.user.fullName,
      email: ctx.state.user.email,
    });

    await userService.atomic.update(
      { _id: ctx.state.user._id },
      { $set: { stripe: { id: stripeCustomer.id } } }
    );

    ctx.state.user.stripe = stripeCustomer;
  }

  if (ctx.state.user.subscription && !ctx.state.user.subscription.isStopped) {
    const currentSubscription = await stripe.subscriptions.retrieve(
      ctx.state.user.subscription.id
    );

    let itemId = currentSubscription.items.data[0].id;

    const subscription = await stripe.subscriptions.update(
      currentSubscription.id,
      {
        proration_behavior: 'always_invoice',
        items: [
          {
            id: itemId,
            price: priceId,
          },
        ],
      }
    );

    return (ctx.body = { isUpgraded: true, subscription });
  }

  let { data: customerPaymentMethods } =
    await stripe.customers.listPaymentMethods(ctx.state.user.stripe.id, {
      limit: 1,
    });
  if (customerPaymentMethods.length) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: ctx.state.user.stripe.id,
        collection_method: 'charge_automatically',
        payment_behavior: 'error_if_incomplete',
        default_payment_method: customerPaymentMethods[0].id,
        items: [
          {
            price: priceId,
          },
        ],
        metadata: { userId: ctx.state.user._id },
      });

      userService.atomic.update(
        { _id: ctx.state.user._id },
        {
          $set: {
            subscription: {
              id: subscription.id,
              priceId,
              activatedOn: new Date(),
            },
          },
        }
      );

      ctx.body = { isUpgraded: true, subscription };
    } catch (err) {
      console.log('stripe err', err);
      let session = await createCheckoutSession(ctx, { priceId });

      return (ctx.body = { url: session.url });
    }
  } else {
    let session = await createCheckoutSession(ctx, { priceId });

    ctx.body = { url: session.url };
  }
};

module.exports.middlewares = [
  require('middlewares/isAuthorized'),
];

module.exports.endpoint = {
  url: '/subscribe',
  method: 'get',
};

module.exports.requestSchema = Joi.object({
  priceId: Joi.string(),
});