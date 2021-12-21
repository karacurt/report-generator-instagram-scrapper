const grabPostsFrom = require("./grabPosts");
const slide = require("./makeppt");
const { downloadImages } = require("./downloadImages");
const { cleanFolder } = require("./cleanFolder");
const { makeJson } = require("./makeJson");
/**
 * @dev in case of failure, uncomment the following line to grab posts again
 * */
//const savedPostsJson = require("./savedPosts.json");
//const downloadedPostsJson = require("./postsDownloaded.json");

/**
 * @notice set profiles names to download posts from
 */
profiles = [
  "ricocomvc",
  "nu_invest",
  "modalmais",
  "guideinvestimentos",
  "interinveste",
  "oramainvestimentos",
  "itauasset",
  "clearcorretora",
  "warrenbrasil",
  "_vitreo",
  "genialinvestimentos",
  "btg_pactual",
  "btgpactualdigital",
  "xpinvestimentos",
  "novafuturainvestimentos",
  "xp.inc",
];

async function main(profiles) {
  /**
   * @notice set profiles names to download posts from
   */
  const posts = await grabPostsFrom(profiles);

  /**
   * @dev uncomment the following line to save posts to a json file
   *  */
  makeJson(posts, "savedPosts.json");

  /**
   * @dev comment the following line to not clean the folder before downloading images
   */
  cleanFolder("imgs");

  /**
   * @notice put in MM-DD-YYYY format
   * @param from: string, optional - default: last week
   * @param until: string, optional - default: today
   * @param to: string, optional - default: imgs
   * */
  const postsDownloaded = await downloadImages(posts, "12-17-2021");

  /**
   * @dev uncomment the following line to save posts to a json file
   *  */
  makeJson(postsDownloaded, "postsDownloaded.json");

  /**
   * @notice function to make a pptx file
   * @params postsDownloaded: array of posts downloaded with downloadImages path and descriptions
   */
  slide.makeppt(postsDownloaded);
}
main(profiles);
