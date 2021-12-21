const nodepptx = require("nodejs-pptx");
let pptx = new nodepptx.Composer();

async function makeppt(postsDownloaded) {
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

module.exports = { makeppt };
