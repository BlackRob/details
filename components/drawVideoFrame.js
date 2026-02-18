/* this function draws the SQUARE video frames
   It includes the move counter and is optimized for 1080x1080 resolution. */

export const drawVideoFrame = ({ sentence, cards, moveCount = 0 }) => {
  // HARDCODED SQUARE RESOLUTION FOR VIDEO
  const cw = 1080;
  const ch = 1080;

  // --- ENVIRONMENT DETECTION ---
  let canvas, ctx, registerFont;

  if (typeof window === "undefined") {
    // Server-side (Node.js)
    const canvasModule = require("canvas");
    canvas = canvasModule.createCanvas(cw, ch);
    ctx = canvas.getContext("2d");
    registerFont = canvasModule.registerFont;
    const path = require("path");

    const theFontPath = path.join(process.cwd(), "/public/Roboto-Regular.ttf");
    if (registerFont) {
      try {
        registerFont(theFontPath, { family: "Roboto" });
      } catch (e) {
        // Font might already be registered
      }
    }
  } else {
    // Client-side (Browser)
    canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    ctx = canvas.getContext("2d");
  }

  // Calculate Fonts based on Width
  let sF = Math.floor(cw / 40);
  let mF = Math.floor(cw / 30);
  let lF = Math.floor(cw / 20);

  // Font strings
  const sFont = `${sF}px Roboto, sans-serif`;
  const mFont = `${mF}px Roboto, sans-serif`;
  let lFontString = `${lF}px Roboto, sans-serif`;

  const margin = cw / 60;
  const top_banner_height = cw / 18;
  const card_row_height = sF * 3;

  let top_bottom_sentence_margin = cw / 55;
  const space4sentence =
    ch -
    top_banner_height -
    top_bottom_sentence_margin -
    top_bottom_sentence_margin -
    card_row_height -
    margin;

  let sentence_height = 0;
  let rm = lF / 3.5;
  let rh = lF * 1.4;
  let blo = lF / 3;
  let wpr = lF / 3.5;

  ctx.font = lFontString;
  let printArray = prePrintSentence(sentence, rm, rh, cw, wpr, margin, ctx);
  let numRows = printArray[printArray.length - 1].row;
  sentence_height = numRows * rh + rm * (numRows - 1);

  // Safety loop to prevent freezing on long sentences
  let safety = 0;
  // Ensure we have a minimum positive space to avoid infinite negative loops
  const safeSpace = Math.max(space4sentence, 100);

  while (sentence_height > safeSpace && safety < 100) {
    lF = Math.floor(lF * 0.85);
    rm = rm * 0.85;
    rh = rh * 0.85;
    blo = blo * 0.85;
    wpr = wpr * 0.85;
    lFontString = `${lF}px Roboto, sans-serif`;
    ctx.font = lFontString;
    printArray = prePrintSentence(sentence, rm, rh, cw, wpr, margin, ctx);
    numRows = printArray[printArray.length - 1].row;
    sentence_height = numRows * rh + rm * (numRows - 1);
    safety++;
  }

  let working_height =
    top_banner_height +
    top_bottom_sentence_margin +
    sentence_height +
    top_bottom_sentence_margin +
    card_row_height +
    margin;
  top_bottom_sentence_margin =
    top_bottom_sentence_margin + (ch - working_height) / 2;

  //////////////////////////////////// start drawing //////////////////////////
  let rb = top_banner_height;

  // Background
  ctx.fillStyle = "#282c34";
  ctx.fillRect(0, 0, cw, canvas.height);

  // Header
  ctx.font = mFont;
  ctx.fillStyle = "lightgray";
  ctx.fillText("details", margin, rb - blo);
  ctx.fillStyle = "#73cef4";
  let gamesWidth = ctx.measureText("games").width;
  ctx.fillText("games", cw - margin - gamesWidth, rb - blo);
  ctx.fillStyle = "lavender";
  let dotWidth = ctx.measureText(".").width + lF / 9;
  ctx.fillText(".", cw - margin - dotWidth - gamesWidth, rb - blo);
  ctx.fillStyle = "#89f0d1";
  let grumblyWidth = ctx.measureText("grumbly").width;
  ctx.fillText(
    "grumbly",
    cw - margin - grumblyWidth - dotWidth - lF / 9 - gamesWidth,
    rb - blo,
  );

  rb += top_bottom_sentence_margin;

  // Sentence
  ctx.font = lFontString;
  printSentence(printArray, rb, wpr, blo, cw, ctx);
  rb += sentence_height;

  rb += top_bottom_sentence_margin;

  // --- MOVE COUNTER (Always ON for Video) ---
  ctx.save();
  ctx.fillStyle = "lightgray";
  ctx.textAlign = "right";
  ctx.font = `${sF}px Roboto, sans-serif`;
  const moveText = `moves: ${moveCount}`;
  ctx.fillText(moveText, cw - margin, rb - sF);
  ctx.restore();

  // Card Row
  printCardRow(cards, margin, rb, cw, card_row_height, sFont, ctx);
  rb += card_row_height;

  rb += margin;

  return canvas.toDataURL();
};

// --- HELPER FUNCTIONS ---

const prePrintSentence = (sentence, rm, rh, cw, wpr, margin, ctx) => {
  let printArray = sentence.map((word) => ({
    id: word.id,
    word: word.word,
    type: word.type,
    color: typeColor(word.type),
    width: ctx.measureText(word.word).width + wpr,
    row: 1,
    wordX: 0,
    wordY: 0,
  }));

  const ww = cw - margin - margin;
  let currentRow = 1;
  let currentRowWidth = 0;

  for (let i = 0; i < printArray.length; i++) {
    if (
      printArray[i].width >= ww - currentRowWidth ||
      (i + 1 < printArray.length &&
        isPunc(printArray[i + 1].type) &&
        printArray[i].width + printArray[i + 1].width > ww - currentRowWidth)
    ) {
      currentRow += 1;
      printArray[i].row = currentRow;
      currentRowWidth = printArray[i].width + wpr;

      // FIX: Check if next word exists before checking if it's punctuation
      // The previous code crashed here when wrapping the LAST word of a sentence.
      if (i + 1 < printArray.length && isPunc(printArray[i + 1].type)) {
        printArray[i + 1].row = currentRow;
        currentRowWidth = currentRowWidth + printArray[i + 1].width;
        i++;
      }
    } else {
      printArray[i].row = currentRow;
      currentRowWidth = currentRowWidth + printArray[i].width;
    }
  }

  currentRow = 1;
  let currentRowOffset = 0;
  for (let i = 0; i < printArray.length; i++) {
    printArray[i].wordX = currentRowOffset;
    if (isPunc(printArray[i].type)) {
      printArray[i].wordX += puncShift(printArray[i].type, wpr);
    }
    currentRowOffset = currentRowOffset + printArray[i].width;
    printArray[i].wordY = rh * currentRow + rm * (currentRow - 1);
    if (i + 1 < printArray.length && printArray[i + 1].row !== currentRow) {
      currentRow += 1;
      currentRowOffset = 0;
    }
  }

  return printArray;
};

const printSentence = (printArray, rb, wpr, blo, cw, ctx) => {
  let rowWordsWidth = [0];
  let numRows = printArray[printArray.length - 1].row;
  for (let i = 1; i <= numRows; i++) {
    rowWordsWidth.push(
      printArray.reduce((a, b) => {
        if (b.row === i) {
          return a + b.width;
        } else {
          return a;
        }
      }, 0),
    );
  }

  let indent = [0];
  let extraLeftMargin = wpr;
  for (let i = 1; i <= numRows; i++) {
    if (i === 1) {
      extraLeftMargin = 0;
    }
    indent.push((cw - rowWordsWidth[i] + extraLeftMargin) / 2.0);
  }

  for (let i = 0; i < printArray.length; i++) {
    ctx.fillStyle = printArray[i].color;
    ctx.fillText(
      printArray[i].word,
      printArray[i].wordX + indent[printArray[i].row],
      printArray[i].wordY + rb - blo,
    );
  }
};

const printCardRow = (cards, margin, rb, cw, card_row_height, font, ctx) => {
  const cardbuttons = [
    "adj",
    "adv",
    "conj",
    "pron",
    "noun",
    "verb",
    "prep",
    "intrj",
  ];
  const w = cw / 9.4;
  const gap = (cw - margin - margin - 8 * w) / 7;
  const r = cw / 150;
  const r1y = rb + card_row_height / 2.5;
  const r2y = rb + card_row_height / 1.25;
  let x = margin;

  ctx.lineWidth = cw / 400;
  ctx.textAlign = "center";

  cardbuttons.forEach((element) => {
    let fill = false;
    let cardsByType = cards.filter((kard) => kard.type === element);
    if (cardsByType.length > 0) {
      fill = true;
      ctx.fillStyle = typeColor(element);
    } else {
      ctx.strokeStyle = "gray";
      ctx.fillStyle = "gray";
    }

    roundedRectangle(x, rb, w, card_row_height, r, ctx, fill);

    ctx.font = font;
    if (fill) {
      ctx.fillStyle = "black";
    }
    ctx.fillText(element, x + w / 2, r1y);
    ctx.fillText(cardsByType.length, x + w / 2, r2y);
    x = x + w + gap;
  });
};

const typeColor = (type) => {
  let color = "";
  switch (true) {
    case type === "conj":
      color = "#ffe377";
      break;
    case type === "adj":
      color = "#89f0d1";
      break;
    case type === "noun":
      color = "#73cef4";
      break;
    case type === "adv":
      color = "#fcc8c8";
      break;
    case type === "verb":
      color = "#ff5c8f";
      break;
    case type === "intrj":
      color = "orange";
      break;
    case type === "prep":
      color = "#2cd946";
      break;
    case type === "pron":
      color = "#c09aeb";
      break;
    default:
      color = "lavender";
  }
  return color;
};

const roundedRectangle = (x, y, w, h, r, ctx, fill) => {
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.arcTo(x + w, y, x + w, y + h / 2, r);
  ctx.arcTo(x + w, y + h, x + w / 2, y + h, r);
  ctx.arcTo(x, y + h, x, y + h / 2, r);
  ctx.arcTo(x, y, x + w / 2, y, r);
  ctx.lineTo(x + w / 2, y);
  if (fill) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
  ctx.closePath();
};

const isPunc = (type) => {
  return type[1] === "_";
};

const puncShift = (type, wpr) => {
  let shift = -wpr * 0.8;
  if (
    type === "p_parL" ||
    type === "p_dbldashL" ||
    type === "p_Lqt" ||
    type === "p_Lsq"
  ) {
    shift = wpr * 0.8;
  }
  return shift;
};
