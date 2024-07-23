import assertEnv from "app-config/assertEnv";
assertEnv([
  "STORAGE_ENDPOINT",
  "STORAGE_ACCESS_KEY",
  "STORAGE_SECRET_ACCESS_KEY",
  "STORAGE_BUCKET",
]);
export const cloudStorage = {
  endpoint: process.env.STORAGE_ENDPOINT,
  accessKeyId: process.env.STORAGE_ACCESS_KEY,
  secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY,
  bucket: process.env.STORAGE_BUCKET,
};
export default {
  cloudStorage,
};
