const Joi = require('joi');

const config = require('app-config');

const ensureUserCreated = require('resources/users/methods/ensureUserCreated');
const storeToken = require('resources/tokens/methods/storeToken');

const googleAuth = require('services/googleAuth');
const { decode } = require('services/base64');

module.exports.handler = async (ctx) => {
  const { code } = ctx.validatedData;

  const { isValid, payload: googleAuthPayload } =
    await googleAuth.exchangeCodeForToken(code);

  ctx.assert(isValid, 404);

  let state = decode(ctx.request.query.state);

  const { _id: userId } = await ensureUserCreated({
    fullName:  `${googleAuthPayload.given_name} ${googleAuthPayload.family_name || ''}`,
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
        (state?.url && state?.url.includes('?') ? '&' : '?') +
        'otp=' +
        otp
    );
};

module.exports.endpoint = {
  url: '/google/sign-in',
  method: 'get',
};

module.exports.requestSchema = Joi.object({
  code: Joi.string().required(),
});