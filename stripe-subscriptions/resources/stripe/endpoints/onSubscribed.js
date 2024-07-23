import Joi from "joi";
import config from "app-config";
import stripe from "services/stripe";
import db from "db";
const stripeService = db.services.stripe;
let userService = db.services.users;
export const handler = async (ctx) => {
  const sig = ctx.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      ctx.request.rawBody,
      sig,
      config.stripe.webhookSecret,
    );
  } catch (err) {
    console.log("webhook error", err.message);
    ctx.status = 400;
    ctx.body = { msg: `Webhook Error: ${err.message}` };
    return;
  }
  if (event.type === "customer.subscription.created") {
    let priceId = event.data.object.items.data[0].price.id;
    await userService.atomic.update(
      { _id: event.data.object.metadata.userId },
      {
        $set: {
          subscription: {
            id: event.data.object.id,
            priceId,
            activatedOn: new Date(),
          },
        },
      },
    );
  } else if (event.type === "customer.subscription.updated") {
    let priceId = event.data.object.items.data[0].price.id;
    let updateQuery = {
      "subscription.status": event.data.object.status,
      "subscription.priceId": priceId,
    };
    if (event.data.object.cancel_at_period_end) {
      updateQuery["subscription.cancelledOn"] = new Date();
    } else {
      updateQuery["subscription.cancelledOn"] = null;
    }
    await userService.atomic.update(
      { "subscription.id": event.data.object.id },
      {
        $set: updateQuery,
      },
    );
  } else if (event.type === "customer.subscription.deleted") {
    await userService.atomic.update(
      { "subscription.id": event.data.object.id },
      {
        $set: {
          "subscription.isStopped": true,
        },
      },
    );
  }
  stripeService.create(event.data.object);
  // // Handle the event
  // switch (event.type) {
  //   case 'charge.captured':
  //     const chargeCaptured = event.data.object;
  //     // Then define and call a function to handle the event charge.captured
  //     break;
  //   case 'charge.succeeded':
  //     const chargeSucceeded = event.data.object;
  //     // Then define and call a function to handle the event charge.succeeded
  //     break;
  //   // ... handle other event types
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }
  // const { } = ctx.validatedData;
  // const results = stripeService.find({ });
  ctx.body = {};
};
export const endpoint = {
  url: "/on-subscribed",
  method: "post",
};
export const requestSchema = Joi.object({});
