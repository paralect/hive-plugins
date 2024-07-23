import Joi from "joi";
export default Joi.object({
  _id: Joi.string(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  name: Joi.string().allow(null).allow(""),
  url: Joi.string().allow(null).allow(""),
  size: Joi.object({}).allow(null),
  customerId: Joi.string().allow(null).allow(""),
  creator: Joi.object({
    _id: Joi.string(),
  }).allow(null),
  customer: Joi.object({
    _id: Joi.string(),
  }).allow(null),
});
