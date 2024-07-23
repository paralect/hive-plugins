import Joi from "joi";
import config from "app-config";
import ensureUserCreated from "resources/users/methods/ensureUserCreated";
import storeToken from "resources/tokens/methods/storeToken";
import googleAuth from "services/googleAuth";
import base64 from "services/base64";
const { decode } = base64;
export const handler = async (ctx) => {
  const { code } = ctx.validatedData;
  const { isValid, payload: googleAuthPayload } =
    await googleAuth.exchangeCodeForToken(code);
  ctx.assert(isValid, 404);
  let state = decode(ctx.request.query.state);
  const { _id: userId } = await ensureUserCreated({
    fullName: `${googleAuthPayload.given_name} ${googleAuthPayload.family_name || ""}`,
    email: googleAuthPayload.email,
    avatarUrl: googleAuthPayload.picture,
    oauth: {
      google: {
        clientId: googleAuthPayload.sub,
      },
    },
  });
  const { otp } = await storeToken(ctx, { userId });
  if (state?.url)
    ctx.redirect(
      (state?.url || config.webUrl) +
        (state?.url && state?.url.includes("?") ? "&" : "?") +
        "otp=" +
        otp,
    );
};
export const endpoint = {
  url: "/google/sign-in",
  method: "get",
};
export const requestSchema = Joi.object({
  code: Joi.string().required(),
});
