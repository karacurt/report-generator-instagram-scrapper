const fs = require("fs");

const makeJson = (posts, fileName) => {
  fs.writeFile(fileName, JSON.stringify(posts), "utf8", function (err) {
    console.log(err);
  });
};
module.exports = { makeJson };
