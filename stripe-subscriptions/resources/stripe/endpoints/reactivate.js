import Joi from "joi";
import config from "app-config";
import stripe from "services/stripe";
import isAuthorized from "middlewares/isAuthorized";
export const handler = async (ctx) => {
  if (ctx.state.user.subscription) {
    const subscription = await stripe.subscriptions.update(
      ctx.state.user.subscription.id,
      {
        cancel_at_period_end: false,
      },
    );
    ctx.body = { isReactivated: true, subscription };
  } else {
    ctx.body = { isReactivated: true };
  }
};
export const middlewares = [isAuthorized];
export const endpoint = {
  url: "/reactivate",
  method: "post",
};
export const requestSchema = Joi.object({});
