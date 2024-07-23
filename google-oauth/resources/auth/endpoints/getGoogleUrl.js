import Joi from "joi";
import googleAuth from "services/googleAuth";
export const handler = async (ctx) => {
  if (ctx.get("Content-Type") === "application/json") {
    ctx.status = 302;
    ctx.body = {
      url: googleAuth.oAuthURL({ url: ctx.request.query.redirect_to }),
    };
  } else {
    ctx.redirect(
      googleAuth.oAuthURL({
        url: ctx.request.query.redirect_to,
      }),
    );
  }
};
export const endpoint = {
  url: "/google/url",
  method: "get",
};
export const requestSchema = Joi.object({});
