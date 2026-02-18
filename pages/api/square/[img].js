import {
  stringIsValid,
  strToGameState,
} from "../../../components/gameStatePack";

export const dynamic = "force-dynamic";

const typeColors = {
  conj: "#ffe377",
  adj: "#89f0d1",
  noun: "#73cef4",
  adv: "#fcc8c8",
  verb: "#ff5c8f",
  intrj: "orange",
  prep: "#2cd946",
  pron: "#c09aeb",
  default: "lavender",
};

const getTypeColor = (type) => typeColors[type] || typeColors.default;

const cardTypes = ["adj", "adv", "conj", "pron", "noun", "verb", "prep", "intrj"];

const generateSVG = ({ sentence, cards, width, height }) => {
  const margin = Math.floor(width / 60);
  const bannerHeight = Math.floor(width / 18);
  const fontSize = Math.floor(width / 20);
  const cardRowHeight = Math.floor(width / 13.33);
  const cardFontSize = Math.floor(width / 40);
  const cardWidth = Math.floor(width / 9.4);
  const cardGap = Math.floor((width - margin * 2 - 8 * cardWidth) / 7);
  const radius = Math.floor(width / 150);
  
  const words = Object.values(sentence);
  const wordsSVG = words.map(w => {
    const color = getTypeColor(w.type);
    return `<tspan fill="${color}">${w.word}</tspan>`;
  }).join(' ');
  
  const cardRowY = height - margin - cardRowHeight;
  
  const cardsSVG = cardTypes.map((type, i) => {
    const count = cards.filter(c => c.type === type).length;
    const hasCards = count > 0;
    const color = hasCards ? getTypeColor(type) : 'transparent';
    const stroke = hasCards ? 'none' : 'gray';
    const fill = hasCards ? color : 'transparent';
    const textColor = hasCards ? 'black' : 'gray';
    const x = margin + i * (cardWidth + cardGap) + cardWidth / 2;
    
    return `
      <rect x="${margin + i * (cardWidth + cardGap)}" y="${cardRowY}" width="${cardWidth}" height="${cardRowHeight}" rx="${radius}" fill="${fill}" stroke="${stroke}"/>
      <text x="${x}" y="${cardRowY + cardRowHeight * 0.4}" text-anchor="middle" fill="${textColor}" font-size="${cardFontSize}">${type}</text>
      <text x="${x}" y="${cardRowY + cardRowHeight * 0.75}" text-anchor="middle" fill="${textColor}" font-size="${cardFontSize}">${count}</text>
    `;
  }).join('');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#282c34"/>
  
  <!-- Header -->
  <text x="${margin}" y="${bannerHeight * 0.8}" fill="lightgray" font-size="${Math.floor(width / 30)}" font-family="sans-serif">details</text>
  <text x="${width - margin}" y="${bannerHeight * 0.8}" text-anchor="end" fill="#89f0d1" font-size="${Math.floor(width / 30)}" font-family="sans-serif">grumbly.</text>
  <text x="${width - margin}" y="${bannerHeight * 0.8}" text-anchor="end" fill="lavender" font-size="${Math.floor(width / 30)}" font-family="sans-serif" dx="-100">games</text>
  
  <!-- Sentence -->
  <text x="${width / 2}" y="${height / 2}" text-anchor="middle" font-size="${fontSize}" font-family="sans-serif">
    ${wordsSVG}
  </text>
  
  <!-- Card Row -->
  ${cardsSVG}
</svg>`;
};

const square = (req, res) => {
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
      svg = generateSVG({
        sentence: data.sentence,
        cards: data.cards,
        width: imageWidth,
        height: imageHeight,
      });
    } else {
      let data = JSON.parse(strToGameState({ canvasURLstring: fallbackString }));
      svg = generateSVG({
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
