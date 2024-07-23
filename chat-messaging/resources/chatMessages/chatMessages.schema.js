import Joi from "joi";
export default Joi.object({
  _id: Joi.string(),
  id: Joi.string().allow(null).allow(""),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  attachments: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().allow(null).allow(""),
      }),
    )
    .allow(null),
  messageHTML: Joi.string().allow(null).allow(""),
  chatRoom: Joi.object({
    _id: Joi.string(),
  }).allow(null),
  fromUser: Joi.object({
    _id: Joi.string(),
    avatarUrl: Joi.string().allow(null).allow(""),
    fullName: Joi.string().allow(null).allow(""),
  }).allow(null),
  metadata: Joi.object({}).allow(null),
  parentMessage: Joi.object({
    _id: Joi.string(),
  }).allow(null),
  childMessagesCount: Joi.number(),
});
