const Joi = require("joi");

const users = {
  subscription: Joi.object({
    id: Joi.string(),
    priceId: Joi.string(),
    activatedOn: Joi.date(),
    cancelledOn: Joi.date(),
    isStopped: Joi.boolean(),
  }),

  stripe: Joi.object({
    id:  Joi.string(),
  }),
};

module.exports = users;
