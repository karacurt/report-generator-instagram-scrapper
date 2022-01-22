const fs = require("fs");
const path = require("path");
const request = require("request");

const downloadImages = async (posts, from, until, to) => {
  const postsDownloaded = [];
  const untilDate = until ? new Date(until) : new Date();
  const lastWeek = new Date(
    untilDate.getFullYear(),
    untilDate.getMonth(),
    untilDate.getDate() - 7
  );
  const fromDate = from ? new Date(from) : lastWeek;
  const toFolder = to ? to : "imgs";
  if (!fs.existsSync(toFolder)) fs.mkdirSync(toFolder);

  for (const post of posts) {
    const fileName = post.img.split("/").pop().split("?")[0];
    const pathToFile = path.resolve(`./${toFolder}/${fileName}`);
    const isValid = await new Promise(function (resolve, reject) {
      request.head(post.img, function (err, res, body) {
        const postDate = new Date(res.headers["last-modified"]);
        console.log("fileName", fileName);
        console.log("from:", fromDate);
        console.log("postDate:", postDate);
        console.log("until:", untilDate);
        console.log("isValid?:", postDate > fromDate && postDate < untilDate);
        resolve(postDate > fromDate && postDate < untilDate);
      });
    });

    if (!isValid) continue;

    request(post.img).pipe(fs.createWriteStream(pathToFile));
    console.log("The file was saved! ->", pathToFile);

    postsDownloaded.push({
      img: fileName,
      description: post.description,
      link: post.link,
    });
  }
  return postsDownloaded;
};

module.exports = { downloadImages };
