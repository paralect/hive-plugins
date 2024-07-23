import Joi from "joi";
import stripe from "services/stripe";
import isAuthorized from "middlewares/isAuthorized";
export const handler = async (ctx) => {
  if (ctx.state.user.subscription) {
    const subscription = await stripe.subscriptions.update(
      ctx.state.user.subscription.id,
      {
        cancel_at_period_end: true,
      },
    );
    ctx.body = { isCancelled: true, subscription };
  } else {
    ctx.body = { isCancelled: true };
  }
};
export const middlewares = [isAuthorized];
export const endpoint = {
  url: "/cancel",
  method: "post",
};
export const requestSchema = Joi.object({});
