const grabPostsFrom = require("./grabPosts");
const slide = require("./makeppt");

async function main() {
  profiles = [
    "ricocomvc",
    "nu_invest",
    "modalmais",
    "guideinvestimentos",
    "interinveste",
  ];
  const posts = await grabPostsFrom(profiles);
  console.log(posts);
  await slide.makeppt(posts);
}
main();
