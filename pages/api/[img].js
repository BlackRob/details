import { renderShareCard } from "../../components/shareCardServer";
import { stringIsValid, strToGameState } from "../../components/gameStatePack";

export const dynamic = "force-dynamic";

const drawImage = async (req, res) => {
  const fallbackString =
    "1xThe~2ysent~3zlink~4yis~5wnot~6xa~7xvalid~8zsentence~9f~~";

  let imageWidth = 1200;
  let imageHeight = 628;

  try {
    const reqString64png = req.url.split("/")[2];
    const reqString64 = reqString64png.substring(0, reqString64png.length - 4);
    const reqString = Buffer.from(reqString64, "base64").toString("utf8");

    let pngBuffer;
    if (stringIsValid({ sentenceString: reqString })) {
      let data = JSON.parse(strToGameState({ canvasURLstring: reqString }));
      pngBuffer = await renderShareCard({
        sentence: data.sentence,
        cards: data.cards,
        width: imageWidth,
        height: imageHeight,
      });
    } else {
      let data = JSON.parse(strToGameState({ canvasURLstring: fallbackString }));
      pngBuffer = await renderShareCard({
        sentence: data.sentence,
        cards: data.cards,
        width: imageWidth,
        height: imageHeight,
      });
    }

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.end(pngBuffer);
  } catch (err) {
    console.error("Error generating image:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    return res.end(`Error generating image: ${err.message}`);
  }
};

export default drawImage;
