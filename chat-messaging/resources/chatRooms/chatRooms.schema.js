import Joi from "joi";
export default Joi.object({
  _id: Joi.string(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  users: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string(),
      }).allow(null),
    )
    .allow(null),
  lastMessageHTML: Joi.string().allow(null).allow(""),
  lastMessageUser: Joi.object({
    _id: Joi.string(),
  }).allow(null),
  lastMessageSentOn: Joi.date(),
});
