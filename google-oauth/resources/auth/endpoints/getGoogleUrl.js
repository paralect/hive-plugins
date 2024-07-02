const Joi = require('joi');

const googleAuth = require('services/googleAuth');

module.exports.handler = async (ctx) => {
  if (ctx.get('Content-Type') === 'application/json') {
    ctx.status = 302;

    ctx.body = {
      url: googleAuth.oAuthURL({ url: ctx.request.query.redirect_to }),
    };
  } else {
    ctx.redirect(
      googleAuth.oAuthURL({
        url: ctx.request.query.redirect_to,
      })
    );
  }
};

module.exports.endpoint = {
  url: '/google/url',
  method: 'get',
};

module.exports.requestSchema = Joi.object({});