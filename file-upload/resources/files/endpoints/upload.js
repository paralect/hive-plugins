import Joi from "joi";
import isAuthorized from "middlewares/isAuthorized";
import uploadFile from "middlewares/uploadFile";
import uploadAndStoreFile from "resources/files/methods/uploadAndStoreFile";
export const handler = async (ctx) => {
  const { file } = ctx.request;
  let createdFile = await uploadAndStoreFile({
    file,
    userId: ctx.state.user._id,
  });
  ctx.body = createdFile;
};
export const middlewares = [isAuthorized, uploadFile.single("file")];
export const endpoint = {
  url: "/",
  method: "post",
};
export const requestSchema = Joi.object({});
