const AWS = require('aws-sdk');
const config = require('app-config');

config.assert('cloudStorage');

const Bucket = config.cloudStorage.bucket;
const spacesEndpoint = new AWS.Endpoint(config.cloudStorage.endpoint);

const storage = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: config.cloudStorage.accessKeyId,
  secretAccessKey: config.cloudStorage.secretAccessKey,
});

function getSignedUrl(fileName) {
  const params = {
    Bucket,
    Key: fileName,
    Expires: 1800,
  };

  return storage.getSignedUrl('getObject', params);
}

function upload(filePath, file) {
  const params = {
    Bucket,
    ContentType: file.mimetype,
    Body: file.buffer,
    Key: filePath,
    ACL: 'private',
  };

  return storage.upload(params).promise();
}

function uploadPublic(filePath, file) {
  const params = {
    Bucket,
    ContentType: file.mimetype,
    Body: file.buffer,
    Key: filePath,
    ACL: 'public-read',
  };

  return storage.upload(params).promise();
}

function copy(filePath, copyFilePath) {
  const params = {
    Bucket,
    CopySource: `${Bucket}/${copyFilePath}`,
    Key: filePath,
  };

  return storage.copyObject(params).promise();
}

function remove(filePath) {
  const params = {
    Bucket,
    Key: filePath,
  };

  return storage.deleteObject(params).promise();
}

module.exports = {
  getSignedUrl,
  copy,
  upload,
  uploadPublic,
  remove,
};