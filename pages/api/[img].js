import { renderShareCard } from "../../components/shareCardServer";
import { stringIsValid, strToGameState } from "../../components/gameStatePack";

const drawImage = (req, res) => {
  const fallbackString =
    "1xThe~2ysent~3zlink~4yis~5wnot~6xa~7xvalid~8zsentence~9f~~";

  let imageWidth = 1200;
  let imageHeight = 628;

  const reqString64 = req.url.split("/")[2];
  const reqString = Buffer.from(reqString64, "base64").toString("utf8");

  let pngBuffer = null;

  if (stringIsValid({ sentenceString: reqString })) {
    let data = JSON.parse(strToGameState({ canvasURLstring: reqString }));
    console.log("from api, string is valid");
    pngBuffer = renderShareCard({
      sentence: data.sentence,
      cards: data.cards,
      width: imageWidth,
      height: imageHeight,
    });
  } else {
    let data = JSON.parse(strToGameState({ canvasURLstring: fallbackString }));
    console.log("from api, string is not valid");
    pngBuffer = renderShareCard({
      sentence: data.sentence,
      cards: data.cards,
      width: imageWidth,
      height: imageHeight,
    });
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "image/png");
  res.end(pngBuffer);
};

export default drawImage;
