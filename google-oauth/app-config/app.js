const config = require('app-config');
const assertEnv = require('app-config/assertEnv');

assertEnv(['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']);

module.exports = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${config.domain}/auth/google/sign-in`,
  },
};