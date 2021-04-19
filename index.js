const aes = require("aes256");
const Response = require("./model/response");
var jwt_decode = require("jwt-decode");

exports.Encrypt = (token, key) => {
  const { error, Message } = checkTokenAndKey(token, key);

  if (!error) {
    // console.log(error, Message);
    return new Response(true, Message);
  }

  try {
    const encryptedToken = aes.encrypt(key, token);

    return new Response(false, encryptedToken);
  } catch (error) {
    return new Response(true, error.message);
  }
};

exports.Decrypt = (token, key) => {
  const { error, Message } = checkTokenAndKey(token, key);

  if (!error) {
    return new Response(true, Message);
  }

  try {
    const decryptedToken = aes.decrypt(key, token);

    return new Response(false, decryptedToken);
  } catch (error) {
    return new Response(true, error.message);
  }
};

exports.GetExpireIn = (token, key) => {
  const { error, Message } = checkTokenAndKey(token, key);

  if (!error) {
    return new Response(true, Message);
  }

  try {
    const decryptedToken = aes.decrypt(key, token);

    const { exp } = jwt_decode(decryptedToken);

    const date = Date(exp);

    return new Response(false, date);
  } catch (error) {
    return new Response(true, error.message);
  }
};

exports.IsTokenOutdate = (token, key) => {
  const { error, Message } = checkTokenAndKey(token, key);

  if (!error) {
    return new Response(false, Message);
  }

  try {
    const decryptedToken = aes.decrypt(key, token);

    const { exp } = jwt_decode(decryptedToken);

    if (Date.now() >= exp * 1000) {
      return new Response(true, "Token expired.");
    }

    return new Response(false, "Token is valid.");
  } catch (error) {
    return new Response(false, error.message);
  }
};

function checkTokenAndKey(token, key) {
  //   console.log(token);
  if (!token) {
    return { error: false, Message: "No token present" };
  }

  if (!key) {
    return { error: false, Message: "No key present" };
  }

  return { error: true, Message: "" };
}
