const fs = require("fs");
const path = require("path");
const nodepptx = require("nodejs-pptx");
const puppeteer = require("puppeteer");

let pptx = new nodepptx.Composer();
async function downloadImages(posts) {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const postsDownloaded = [];
  for await (const post of posts) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1200 });
    const fileName = post.img.split("/").pop().split("?")[0];
    console.log(fileName);
    var viewSource = await page.goto(post.img);
    const pathToFile = await path.resolve(`./imgs/${fileName}`);
    await fs.writeFile(pathToFile, await viewSource.buffer(), function (err) {
      if (err) {
        return console.log(err);
      }
    });
    await page.waitFor(400);
    console.log("The file was saved!");
    postsDownloaded.push({ img: fileName, description: post.description });
    await page.close();
  }
  await browser.close();

  return postsDownloaded;
}

async function makeppt(posts) {
  const postsDownloaded = await downloadImages(posts);
  console.log(postsDownloaded);

  let count = 0;
  await pptx.compose(async (pres) => {
    console.log("entrou no compose");
    while (count < postsDownloaded.length) {
      console.log("adicionando slide");
      pres.addSlide(async (slide) => {
        let pos = 1;
        console.log("entrou no slide");
        for (let i = count; i < postsDownloaded.length; i = i + 1) {
          let textpos = pos != 1 ? (pos == 2 ? 40 * pos : 50 * pos) : 0;
          let imgpos = pos != 1 ? (pos == 2 ? 75 * pos : 100 * pos) : 0;
          slide
            .addText((text) => {
              text
                .value(postsDownloaded[i].description)
                .x(200)
                .y(90 * pos + textpos)
                .cx(500);
            })
            .addImage(async (image) => {
              image
                .file(`./imgs/${postsDownloaded[i].img}`)
                .x(30)
                .y(20 * pos + imgpos)
                .cx(168)
                .cy(168);
            });
          pos = pos + 1;
          count = count + 1;
          if (count % 3 === 0) break;
        }
      });
    }
  });

  await pptx.save(`./report.pptx`);
}

module.exports = { makeppt, downloadImages };
