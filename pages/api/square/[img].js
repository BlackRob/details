import { drawCanvas } from "../../../components/drawCanvas";
import { registerFont } from "canvas";
import {
  stringIsValid,
  strToGameState,
} from "../../../components/gameStatePack";
import path from "path";
//import fonttrick from "fonttrick";

if (registerFont !== undefined) {
  console.log("registerFont is not undefined");
  registerFont(path.join(process.cwd(), "/public/Roboto-Regular.ttf"), {
    family: "Roboto",
  });
  console.log(path.join(process.cwd(), "/public/Roboto-Regular.ttf"));
}

const square = (req, res) => {
  // some constants
  const fallbackString =
    "1xThe~2ysent~3zlink~4yis~5wnot~6xa~7xvalid~8zsentence~9f~~";
  // const fbs64 = Buffer.from(fallbackString,'utf8').toString('base64')

  // some variables
  let imageWidth = 600; // standard for fb ogimage
  let imageHeight = 600; // standard for fb ogimage

  // we need to remove the initial "/api/square/" before we can use the req string
  const reqString64png = req.url.split("/")[3];
  //console.log(reqString64png)
  const reqString64 = reqString64png.substring(0, reqString64png.length - 4);
  // and also it's base64 encoded, so convert to utf8
  const reqString = Buffer.from(reqString64, "base64").toString("utf8");

  //const pathToRoboto = path.join(process.cwd(), 'node_modules/fonttrick/Roboto-Regular.ttf')
  let output = null;

  if (stringIsValid({ sentenceString: reqString })) {
    let data = JSON.parse(strToGameState({ canvasURLstring: reqString }));
    console.log("from api/square, string is valid");
    output = drawCanvas({
      sentence: data.sentence,
      cards: data.cards,
      width: imageWidth,
      height: imageHeight,
      //fontPath: "/Roboto-Regular.ttf",
    });
  } else {
    let data = JSON.parse(strToGameState({ canvasURLstring: fallbackString }));
    console.log("from api/square, string is valid");
    output = drawCanvas({
      sentence: data.sentence,
      cards: data.cards,
      width: imageWidth,
      height: imageHeight,
      //fontPath: "/Roboto-Regular.ttf",
    });
  }

  const buffy = Buffer.from(output.split(",")[1], "base64");
  res.statusCode = 200;
  res.setHeader("Content-Type", "image/png");
  res.end(buffy);
};

export default square;
