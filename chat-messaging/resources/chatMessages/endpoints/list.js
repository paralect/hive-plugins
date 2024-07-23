import Joi from "joi";
import db from "db";
import isAuthorized from "middlewares/isAuthorized";
const chatMessageService = db.services.chatMessages;
const chatRoomService = db.services.chatRooms;
export const handler = async (ctx) => {
  const {
    page,
    perPage,
    sort = "-createdOn",
    beforeDate,
    chatRoomId,
  } = ctx.validatedData;
  let chatRoom = await chatRoomService.findOne({
    _id: ctx.request.query.chatRoomId,
    "users._id": ctx.state.user._id,
  });
  if (!chatRoom) {
    ctx.body = {
      isNoChatRoom: true,
      results: [],
      pagesCount: 1,
      count: 0,
    };
    return;
  }
  const { results, pagesCount, count } = await chatMessageService.find(
    {
      ...(beforeDate ? { createdOn: { $lte: beforeDate } } : {}),
      "chatRoom._id": chatRoomId,
    },
    { page, perPage, sort },
  );
  ctx.body = { results, pagesCount, count };
};
export const middlewares = [isAuthorized];
export const endpoint = {
  url: "/",
  method: "get",
};
export const requestSchema = Joi.object({
  page: Joi.number(),
  perPage: Joi.number(),
  sort: Joi.string().allow(null).allow(""),
  afterDate: Joi.string().allow(null).allow(""),
  beforeDate: Joi.date(),
  chatRoomId: Joi.string().allow(null).allow(""),
});
