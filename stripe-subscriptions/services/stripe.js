import config from "app-config";
import stripe$0 from "stripe";

config.assert("stripe");
const stripe = stripe$0(config.stripe.secretKey);

export default stripe;
