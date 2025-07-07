const connection = require("./db");

async function executeQuery(query, params) {
  return new Promise(function (resolve, reject) {
    connection.query(query, params, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(result);
    });
  });
}

module.exports = {
  executeQuery
};
