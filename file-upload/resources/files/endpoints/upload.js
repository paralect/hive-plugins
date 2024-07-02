const Joi = require('joi');

const isAuthorized = require('middlewares/isAuthorized');
const uploadFile = require('middlewares/uploadFile');

const uploadAndStoreFile = require('resources/files/methods/uploadAndStoreFile');

module.exports.handler = async (ctx) => {
  const { file } = ctx.request;
  let createdFile = await uploadAndStoreFile({
    file,
    userId: ctx.state.user._id,
  });
  ctx.body = createdFile;
};

module.exports.middlewares = [isAuthorized, uploadFile.single('file')];

module.exports.endpoint = {
  url: '/',
  method: 'post',
};

module.exports.requestSchema = Joi.object({});