const fileService = require('db').services.files;
const cloudStorageService = require('services/storageService');

module.exports = async ({ file, userId, customerId }) => {
  const fileName = `${Date.now()}-${file.originalname}`;

  const data = await cloudStorageService.uploadPublic(
    `stream/${customerId || userId}/${fileName}`,
    file
  );
  let { Location:url } = data;

  const createdFile = await fileService.create({
    creator: { _id: userId },
    name: file.originalname,
    url,
  });

  return createdFile;
};