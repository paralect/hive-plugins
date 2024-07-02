const { OAuth2Client } = require('google-auth-library');

const config = require('app-config');
const logger = require('logger');
const { encode } = require('services/base64');

config.assert('google');

const client = new OAuth2Client(
  config.google.clientId,
  config.google.clientSecret,
  config.google.redirectUri
);

module.exports.oAuthURL = ({ url, fingerprint }) =>
  client.generateAuthUrl({
    access_type: 'offline',
    scope: ['email', 'profile'],
    include_granted_scopes: true,
    state: encode({ url, fingerprint }),
  });

module.exports.exchangeCodeForToken = async (code) => {
  try {
    const { tokens } = await client.getToken(code);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: config.google.clientId,
    });

    return {
      isValid: true,
      payload: ticket.getPayload(),
    };
  } catch ({ message, ...rest }) {
    logger.error(`Exchange code for token error: ${message}`);

    return {
      isValid: false,
      payload: { message },
    };
  }
};