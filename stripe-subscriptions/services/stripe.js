const config = require('app-config');

config.assert('stripe');

const stripe = require('stripe')(config.stripe.secretKey);

module.exports = stripe;