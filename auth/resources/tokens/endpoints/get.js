const tokenService = require('db').services.tokens;
const isAuthorized = require('middlewares/isAuthorized'); 
const test = require('middlewares/test'); 
const setCookie = require('services/setCookie'); 
const globalTest = require('services/globalTest'); 

module.exports.handler = async (ctx) => {
  let result = await tokenService.find();

  ctx.body = result;
}