const { default: axios } = require("axios");

const net = axios.create({ baseURL: "" });

function apiCall(method, path, data) {
  return new Promise((resolve, reject) => {
    net[method](path, data)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err.response));
  });
}

module.exports = apiCall;
