import { renderShareCard } from "../../components/shareCardServer";
import { stringIsValid, strToGameState } from "../../components/gameStatePack";

export const dynamic = "force-dynamic";

const drawImage = (req, res) => {
  const fallbackString =
    "1xThe~2ysent~3zlink~4yis~5wnot~6xa~7xvalid~8zsentence~9f~~";

  let imageWidth = 1200;
  let imageHeight = 628;

  try {
    const reqString64png = req.url.split("/")[2];
    const reqString64 = reqString64png.substring(0, reqString64png.length - 4);
    const reqString = Buffer.from(reqString64, "base64").toString("utf8");

    if (stringIsValid({ sentenceString: reqString })) {
      let data = JSON.parse(strToGameState({ canvasURLstring: reqString }));
      console.log("from api, string is valid");
      return renderShareCard({
        sentence: data.sentence,
        cards: data.cards,
        width: imageWidth,
        height: imageHeight,
      });
    } else {
      let data = JSON.parse(strToGameState({ canvasURLstring: fallbackString }));
      console.log("from api, string is not valid");
      return renderShareCard({
        sentence: data.sentence,
        cards: data.cards,
        width: imageWidth,
        height: imageHeight,
      });
    }
  } catch (err) {
    console.error("Error generating image:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    return res.end(`Error generating image: ${err.message}`);
  }
};

export default drawImage;
