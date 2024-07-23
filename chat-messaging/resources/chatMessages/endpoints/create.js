import Joi from "joi";
import db from "db";
import attachUser from "middlewares/attachUser";
import shouldExist from "middlewares/shouldExist";
const chatMessageService = db.services.chatMessages;
export const handler = async (ctx) => {
  const { messageHTML, attachments, chatRoomId, id, parentMessageId } =
    ctx.validatedData;
  const chatMessage = await chatMessageService.create({
    id,
    chatRoom: { _id: chatRoomId },
    fromUser: { _id: ctx.state.user._id },
    messageHTML,
    attachments,
    ...(parentMessageId ? { parentMessage: { _id: parentMessageId } } : {}),
  });
  ctx.body = chatMessage;
};
export const middlewares = [
  attachUser,
  shouldExist("chatRooms", {
    criteria: (ctx) => {
      return {
        _id: ctx.request.body.chatRoomId,
        "users._id": ctx.state.user._id,
      };
    },
  }),
];
export const endpoint = {
  url: "/",
  method: "post",
};
export const requestSchema = Joi.object({
  attachments: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().allow(null).allow(""),
      }),
    )
    .allow(null),
  messageHTML: Joi.string().allow(null).allow(""),
  chatRoomId: Joi.string().allow(null).allow(""),
  id: Joi.string().allow(null).allow(""),
  parentMessageId: Joi.string().allow(null).allow(""),
});
