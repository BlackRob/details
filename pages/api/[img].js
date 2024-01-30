import { drawCanvas } from "../../components/drawCanvas";
import { registerFont } from "canvas";
import { stringIsValid, strToGameState } from "../../components/gameStatePack";
//import fonttrick from "fonttrick";
import path from "path";

/* registerFont(path.resolve("../public/Roboto-Regular.ttf"), {
  family: "Roboto",
}); */
if (registerFont !== undefined) {
  let theFontPath = path.join(process.cwd(), "./public/Roboto-Regular.ttf");
  registerFont(path.join(process.cwd(), "./public/Roboto-Regular.ttf"), {
    family: "Roboto",
  });
}

const drawImage = (req, res) => {
  // { query: { img } }
  // some constants
  const fallbackString =
    "1xThe~2ysent~3zlink~4yis~5wnot~6xa~7xvalid~8zsentence~9f~~";
  // const fbs64 = Buffer.from(fallbackString,'utf8').toString('base64')

  // some variables
  let imageWidth = 1200; // standard for fb ogimage
  let imageHeight = 628; // standard for fb ogimage

  // we need to remove the initial "/api/" before we can use the req string
  const reqString64 = req.url.split("/")[2];
  // and also it's base64 encoded, so convert to utf8
  const reqString = Buffer.from(reqString64, "base64").toString("utf8");

  //const pathToRoboto = path.join(process.cwd(), 'node_modules/fonttrick/Roboto-Regular.ttf')
  let output = null;

  if (stringIsValid({ sentenceString: reqString })) {
    let data = JSON.parse(strToGameState({ canvasURLstring: reqString }));
    console.log("from api, string is valid");
    output = drawCanvas({
      sentence: data.sentence,
      cards: data.cards,
      width: imageWidth,
      height: imageHeight,
      fontPath: "/roboto-regular.ttf",
    });
  } else {
    let data = JSON.parse(strToGameState({ canvasURLstring: fallbackString }));
    console.log("from api, string is not valid");
    output = drawCanvas({
      sentence: data.sentence,
      cards: data.cards,
      width: imageWidth,
      height: imageHeight,
      fontPath: "/roboto-regular.ttf",
    });
  }

  const buffy = Buffer.from(output.split(",")[1], "base64");
  res.statusCode = 200;
  res.setHeader("Content-Type", "image/png");
  res.end(buffy);
};

export default drawImage;
