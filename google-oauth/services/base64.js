export const encode = (obj) =>
  Buffer.from(JSON.stringify(obj)).toString("base64");
export const decode = (str) => {
  let decodedStr = Buffer.from(str, "base64").toString();
  try {
    let obj = JSON.parse(decodedStr);
    return obj;
  } catch (err) {
    return decodedStr;
  }
};
export default {
  encode,
  decode,
};
