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
      const lineArray = Array.from(nodeList);
      const posts = [];
      lineArray.forEach((imgPost) => {
        let a = "";
        a = a + imgPost.srcset;
        const img = a.split(",")[4].split(" ")[0];
        const description = imgPost.alt;
        console.log(img);
        console.log(description);
        const post = {
          img,
          description,
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
