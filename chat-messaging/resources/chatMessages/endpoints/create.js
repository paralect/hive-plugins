const Joi = require('joi');

const chatMessageService = require('db').services.chatMessages;

module.exports.handler = async (ctx) => {
  const { messageHTML, attachments, chatRoomId, id, parentMessageId } = ctx.validatedData;

  const chatMessage = await chatMessageService.create({
    id,
    chatRoom: { _id: chatRoomId },
    fromUser: { _id: ctx.state.user._id },
    messageHTML,
    attachments,
    ...(parentMessageId ? { parentMessage: { _id: parentMessageId }} : { })
  });

  ctx.body = chatMessage;
};

module.exports.middlewares = [
  require('middlewares/attachUser'),
  require('middlewares/shouldExist')('chatRooms', {
    criteria: (ctx) => {
      return {
        _id: ctx.request.body.chatRoomId,
        'users._id': ctx.state.user._id
      };
    },
  }),
];

module.exports.endpoint = {
  url: '/',
  method: 'post',
};

module.exports.requestSchema = Joi.object({
  attachments: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().allow(null).allow(''),
      })
    )
    .allow(null),
  messageHTML: Joi.string().allow(null).allow(''),
  chatRoomId: Joi.string().allow(null).allow(''),
  id: Joi.string().allow(null).allow(''),
  parentMessageId:  Joi.string().allow(null).allow(''),
});