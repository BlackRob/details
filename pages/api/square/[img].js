import { renderShareCardSVG } from "../../../components/shareCardServer";
import {
  stringIsValid,
  strToGameState,
} from "../../../components/gameStatePack";

export const dynamic = "force-dynamic";

const square = async (req, res) => {
  const fallbackString =
    "1xThe~2ysent~3zlink~4yis~5wnot~6xa~7xvalid~8zsentence~9f~~";

  let imageWidth = 600;
  let imageHeight = 600;

  try {
    const reqString64png = req.url.split("/")[3];
    const reqString64 = reqString64png.substring(0, reqString64png.length - 4);
    const reqString = Buffer.from(reqString64, "base64").toString("utf8");

    let svg;
    if (stringIsValid({ sentenceString: reqString })) {
      let data = JSON.parse(strToGameState({ canvasURLstring: reqString }));
      svg = await renderShareCardSVG({
        sentence: data.sentence,
        cards: data.cards,
        width: imageWidth,
        height: imageHeight,
      });
    } else {
      let data = JSON.parse(strToGameState({ canvasURLstring: fallbackString }));
      svg = await renderShareCardSVG({
        sentence: data.sentence,
        cards: data.cards,
        width: imageWidth,
        height: imageHeight,
      });
    }

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.send(svg);
  } catch (err) {
    console.error("Error generating square image:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    return res.end(`Error generating image: ${err.message}`);
  }
};

export default square;
