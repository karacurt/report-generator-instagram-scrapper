const puppeteer = require("puppeteer");
require("dotenv").config();

module.exports = async function grabPostsFrom(profiles) {
  let browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 764 });
  await page.goto("https://www.instagram.com/");
  await page.waitFor(2000);

  await page.click(`input[name='username']`);
  await page.keyboard.type(`${process.env.INSTAGRAM_USERNAME}`);
  await page.click("input[type='password']");
  await page.keyboard.type(`${process.env.INSTAGRAM_PASSWORD}`);
  await page.click(".sqdOP.L3NKy.y3zKF");
  await page.waitForNavigation();
  console.log("logged in");
  await page.waitFor(2000);
  let generalPosts = [];
  for (const profile of profiles) {
    await page.goto(`https://www.instagram.com/${profile}/`, {
      waitUntil: "networkidle2",
    });

    const postsFromProfile = await page.evaluate(async () => {
      const nodeList = document.querySelectorAll("article img");
      console.log(nodeList);
      const lineArray = Array.from(nodeList);
      const posts = [];
      const linksNode = document.querySelectorAll("article a");
      const linksArray = Array.from(linksNode);
      console.log("linksArray", linksArray);

      lineArray.forEach((imgPost, index) => {
        let a = "";
        a = a + imgPost.srcset ? imgPost.srcset : imgPost.src;

        const img = imgPost.srcset ? a.split(",")[4].split(" ")[0] : a;
        const description = imgPost.alt;
        console.log(img);
        console.log(description);
        console.log(linksArray[index].href);
        const post = {
          img,
          description,
          link: linksArray[index].href,
        };
        posts.push(post);
      });

      return posts;
    });
    generalPosts = generalPosts.concat(postsFromProfile);
  }
  await browser.close();
  console.log("generalPosts", generalPosts);
  return generalPosts;
};
