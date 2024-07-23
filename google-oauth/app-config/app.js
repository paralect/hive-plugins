import config from "app-config";
import assertEnv from "app-config/assertEnv";
assertEnv(["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"]);
export const google = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${config.domain}/auth/google/sign-in`,
};
export default {
  google,
};
