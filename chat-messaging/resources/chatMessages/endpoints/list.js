const Joi = require('joi');

const chatMessageService = require('db').services.chatMessages;
const chatRoomService = require('db').services.chatRooms;

module.exports.handler = async (ctx) => {
  const {
    page,
    perPage,
    sort = '-createdOn',
    beforeDate,
    chatRoomId,
  } = ctx.validatedData;

  let chatRoom = await chatRoomService.findOne({
    _id: ctx.request.query.chatRoomId,
    'users._id': ctx.state.user._id,
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

      'chatRoom._id': chatRoomId,
    },
    { page, perPage, sort }
  );

  ctx.body = { results, pagesCount, count };
};

module.exports.middlewares = [
  require('middlewares/isAuthorized'),
];

module.exports.endpoint = {
  url: '/',
  method: 'get',
};

module.exports.requestSchema = Joi.object({
  page: Joi.number(),
  perPage: Joi.number(),
  sort: Joi.string().allow(null).allow(''),
  afterDate: Joi.string().allow(null).allow(''),
  beforeDate: Joi.date(),
  chatRoomId: Joi.string().allow(null).allow(''),
});