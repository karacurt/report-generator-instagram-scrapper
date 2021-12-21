const fs = require("fs");
const path = require("path");
const cleanFolder = (folderName) => {
  const directory = folderName;
  if (!fs.existsSync(directory)) return;
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
};

module.exports = { cleanFolder };
