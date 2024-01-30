/* this function redraws the current sentence and cards
  on a canvas, so that it can be shared as an image */
import { registerFont, createCanvas } from "canvas";
import path from "path";
// this line needs to be commented to run in dev mode
//registerFont(path.resolve("./public/Roboto-Regular.ttf"), {
//  family: "Roboto",
//});

// width and height are optional
export const drawCanvas = ({ sentence, cards, width, height, fontPath }) => {
  // default canvas size
  let cw = 1200; // canvas width
  let ch = 628; // canvas height
  // if given different canvas size, update
  if (width && !height) {
    cw = width;
    ch = Math.floor(width / 1.91);
  }
  if (height && width) {
    cw = width;
    ch = height;
  }
  if (height && !width) {
    ch = height;
    cw = Math.floor(height * 1.91);
  }

  // this path is only used for api calls in development mode
  let theFontPath = path.join(process.cwd(), "/public/Roboto-Regular.ttf");
  // when run in browser, registerfont isn't available,
  // but we don't need it; when run from an API call,
  // there is no css loaded, so we can't get fonts from @fontface
  // and the canvas element has no fonts installed by default;
  // in dev mode we can load them from local, but when run serverless
  // it gets complicated: basically, we have a local module whose only
  // job is to get loaded and piggyback the font file into the serverless
  // function (thread); the module default function copies the font to
  // /tmp then returns its absolute path; the function in the api
  // then passes that path here so we can load the font from it
  if (registerFont !== undefined) {
    //if (process.env.NODE_ENV === "production") {
    //  theFontPath = fontPath;
    //}
    registerFont(theFontPath, { family: "Roboto" });
  }
  const canvas = createCanvas(cw, ch);
  const ctx = canvas.getContext("2d");

  // we have to set and adjust the font several times
  // so we set constants, but they have to be proportional
  // to the width, so
  const sF = Math.floor(cw / 40); // originally small font, for buttons
  const mF = Math.floor(cw / 30); // medium font, for branding
  let lF = Math.floor(cw / 20); // this is the base sentence font size

  // there is no sans-serif fallback font when run outside of browser
  const sFont = `${sF}px Roboto, sans-serif`;
  const mFont = `${mF}px Roboto, sans-serif`;
  let lFont = `${lF}px Roboto, sans-serif`; // this is reset as needed

  // some constants for writing our sentence
  const margin = cw / 60; // sentence left/right margin
  const top_banner_height = cw / 18; // top banner should always be the same
  const card_row_height = sF * 3; // height of bottom row, the card buttons

  // room available for sentence
  let top_bottom_sentence_margin = cw / 55; // minimum value
  const space4sentence =
    ch -
    top_banner_height -
    top_bottom_sentence_margin -
    top_bottom_sentence_margin -
    card_row_height -
    margin;

  // and some variables
  let sentence_height = 0; // calculated height of sentence

  let rm = lF / 3.5; // "row margin" for between rows
  let rh = lF * 1.4; // average "row height"
  let blo = lF / 3; // baseline offset
  let wpr = lF / 3.5; // word padding right

  // do some pre-printing work, return an array with size and spacing info
  // it's important that the font is set to the correct font now for sizing
  ctx.font = lFont;
  let printArray = prePrintSentence(sentence, rm, rh, cw, wpr, margin, ctx);
  // calculate how tall the sentence block should be
  let numRows = printArray[printArray.length - 1].row;
  sentence_height = numRows * rh + rm * (numRows - 1);

  // some weirdness:
  // we want the whole sentence to fit on one image, but the bigger a sentence
  // is, the more room it needs, so we start at a big font, calculate how
  // many rows and how tall it would be; if that's too tall, we bump the font
  // down and recalculate until it fits
  while (sentence_height > space4sentence) {
    lF = Math.floor(lF * 0.85); // "large font" for the sentence itself
    rm = rm * 0.85; // "row margin" for between rows
    rh = rh * 0.85; // average "row height"
    blo = blo * 0.85; // baseline offset
    wpr = wpr * 0.85; // word padding right
    lFont = `${lF}px Roboto, sans-serif`;
    ctx.font = lFont;
    printArray = prePrintSentence(sentence, rm, rh, cw, wpr, margin, ctx);
    numRows = printArray[printArray.length - 1].row;
    sentence_height = numRows * rh + rm * (numRows - 1);
  }

  // because of how we adjusted the font size to make it fit, we have to
  // adjust the spacing above and below it
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
  let rb = top_banner_height; // "row beginning", initial value
  // background
  ctx.fillStyle = "#282c34";
  ctx.fillRect(0, 0, cw, canvas.height);

  // header
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
    rb - blo
  );

  // top margin
  rb += top_bottom_sentence_margin;

  // sentence
  ctx.font = lFont;
  printSentence(printArray, rb, wpr, blo, cw, ctx);
  rb += sentence_height;

  // bottom margin
  rb += top_bottom_sentence_margin;

  // card row
  ctx.lineWidth = lFont / 10;
  printCardRow(cards, margin, rb, cw, card_row_height, sFont, ctx);
  rb += card_row_height;

  // final margin
  rb += margin;

  // return canvas as dataURL so I can share it ;)
  return canvas.toDataURL();
};

export const tinyCanvas = ({ cards, wR }) => {
  // first thing, build sentence array from props
  //console.log(cards)
  //console.log(wR)
  let sentence = [];
  wR.forEach((x) => {
    sentence.push({
      id: x,
      type: cards[x].type,
      word: cards[x].word,
    });
  });

  let cw = 100; // canvas width
  let ch = 100; // canvas height
  const canvas = createCanvas(cw, ch);
  const ctx = canvas.getContext("2d");

  let lF = Math.floor(cw / 10); // this is the base sentence font size
  // there is no sans-serif fallback font when run outside of browser
  let lFont = `${lF}px Roboto, sans-serif`; // this is reset as needed
  // some constants for writing our sentence
  const margin = 0; // sentence left/right margin

  // room available for sentence
  let top_bottom_sentence_margin = 5; // minimum value

  // and some variables
  let sentence_height = 0; // calculated height of sentence

  let rm = lF / 3.5; // "row margin" for between rows
  let rh = lF * 1.4; // average "row height"
  let blo = lF / 3; // baseline offset
  let wpr = lF / 3.5; // word padding right

  // do some pre-printing work, return an array with size and spacing info
  // it's important that the font is set to the correct font now for sizing
  ctx.font = lFont;
  let printArray = prePrintSentence(sentence, rm, rh, cw, wpr, margin, ctx);
  // calculate how tall the sentence block should be
  let numRows = printArray[printArray.length - 1].row;
  sentence_height = numRows * rh + rm * (numRows - 1);

  let working_height =
    top_bottom_sentence_margin + sentence_height + top_bottom_sentence_margin;

  ctx.height = working_height;
  ctx.font = lFont; //setting font again because changing height can mess it up
  //////////////////////////////////// start drawing //////////////////////////
  let rb = 0; // "row beginning", initial value
  // no background
  // top margin
  rb += top_bottom_sentence_margin;

  // sentence
  ctx.font = lFont;
  printSentence(printArray, rb, wpr, blo, cw, ctx);
  rb += sentence_height;

  // bottom margin
  rb += top_bottom_sentence_margin;

  // return canvas as dataURL so I can share it ;)
  return canvas.toDataURL();
};

// printing the sentence is complicated because we need to figure
// out how many words go on each row, what color to make them,
// set the margins... so we do some pre-printing work
const prePrintSentence = (sentence, rm, rh, cw, wpr, margin, ctx) => {
  // sentence is an array of objects, we're mapping each object
  // to a different object with a bit of extra information
  let printArray = sentence.map((word) => ({
    id: word.id,
    word: word.word,
    type: word.type,
    color: typeColor(word.type),
    width: ctx.measureText(word.word).width + wpr,
    row: 1, // default to row 1, will check and update later
    wordX: 0, // x position
    wordY: 0, // y position
  }));

  // horizontal spacing is the next issue
  // each word has it's own width, plus some space after it,
  // plus each row has a left and right margin
  const ww = cw - margin - margin; // working width
  let currentRow = 1;
  let currentRowWidth = 0;

  for (let i = 0; i < printArray.length; i++) {
    // first check, is there enough room in row for word?
    // most of the time there is (more words are in one row
    // than have to wrap to the next), but we need to check
    // for several situations that require wrapping:
    // first, is the word too long for the remaining space? wrap!
    if (
      printArray[i].width >= ww - currentRowWidth ||
      // or, if not too long, but it is followed by punctuation,
      // we want the punctuation to stay with it, so is it
      // too long with the punctuation? wrap!
      (i + 1 < printArray.length && // make sure this isn't last element
        isPunc(printArray[i + 1].type) && // if so, is next punctuation
        // if yes, and they both won't fit on this row, then wrap
        printArray[i].width + printArray[i + 1].width > ww - currentRowWidth)
    ) {
      currentRow += 1;
      // if we're here, we wrapped... so we need to put current word
      // on new line
      printArray[i].row = currentRow;
      // we also need to update the working width of the current row
      currentRowWidth = printArray[i].width + wpr;
      // if we did wrap because of punctuation, we should add
      // the punctuation right now
      if (isPunc(printArray[i + 1].type)) {
        printArray[i + 1].row = currentRow;
        currentRowWidth = currentRowWidth + printArray[i + 1].width;
        // and since i+1 has been dealt with
        i++;
      }
    } else {
      printArray[i].row = currentRow;
      currentRowWidth = currentRowWidth + printArray[i].width;
    }
  }

  // now we know what row each word goes in, we loop through printArray
  // again to figure out the x and y position of each word --not
  // absolute position though, left margin gets added when drawn
  currentRow = 1;
  let currentRowOffset = 0;
  for (let i = 0; i < printArray.length; i++) {
    printArray[i].wordX = currentRowOffset;
    // adjust for puctuation  :)
    if (isPunc(printArray[i].type)) {
      printArray[i].wordX += puncShift(printArray[i].type, wpr);
    }
    //// temporary adjustment to let period-as-separator (like in URL) work
    //// if (printArray[i].type === "p_prd") {
    ////   currentRowOffset -= 40
    //// }
    currentRowOffset = currentRowOffset + printArray[i].width;
    printArray[i].wordY = rh * currentRow + rm * (currentRow - 1);
    // if there is a next element, look ahead and see if we need
    // to increment the row number / reset row offset
    if (i + 1 < printArray.length && printArray[i + 1].row !== currentRow) {
      currentRow += 1;
      currentRowOffset = 0;
    }
  }

  return printArray;
};

// function to actually write the sentence
const printSentence = (printArray, rb, wpr, blo, cw, ctx) => {
  // printArray contains the words broken out into rows
  // with their lengths and colors, but it doesn't have
  // info about offsets for drawing: offset from top of
  // canvas for Y, from left for X, and margin adjustments
  // to center texts

  // calculate width of content in each row
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
      }, 0)
    );
  }

  // calculate indentation for each row
  let indent = [0];
  // except for 1st row, we need to add a left margin
  // equal to the right margin for balance
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
      printArray[i].wordY + rb - blo
    );
  }
};

// currently not showing the working row
const printWorkingRow = (
  cards,
  margin,
  rb,
  cw,
  working_row_height,
  workingCards,
  ctx
) => {
  ctx.fillRect(margin, rb, cw - margin - margin, working_row_height);
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
  const w = cw / 9.4; // card width
  const gap = (cw - margin - margin - 8 * w) / 7; // between cards
  const r = cw / 150; // corner radius of button
  const y = rb;
  const h = card_row_height;
  const r1y = y + card_row_height / 2.5;
  const r2y = y + card_row_height / 1.25;
  let x = margin; // cards are arranged horizontally, this is initial value

  ctx.lineWidth = cw / 400;
  ctx.textAlign = "center";

  cardbuttons.forEach((element) => {
    let fill = false;
    let cardsByType = cards.filter((kard) => kard.type === element); // && !kard.working
    if (cardsByType.length > 0) {
      fill = true;
      ctx.fillStyle = typeColor(element);
    } else {
      ctx.strokeStyle = "gray";
      ctx.fillStyle = "gray";
    }

    roundedRectangle(x, y, w, h, r, ctx, fill);

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
  // I don't know why the previous line doesn't
  // close the rectangle, so added a final segment
  ctx.lineTo(x + w / 2, y);
  if (fill) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
  ctx.closePath();
};

// a bunch of different types of punctuation ;)
// but they all start "p_", so we look for the underscore
const isPunc = (type) => {
  let punc = false;
  if (type[1] === "_") {
    punc = true;
  }
  return punc;
};

// sometimes punctuation needs to be adjusted,
// moved a little left or right depending on the type
// types: p_exc, p_com, p_cln, p_semi, p_prd, p_parL, p_parR, p_qm,
// p_dbldashL, p_dbldashR, p_Lqt, p_Rqt, p_Lsq, p_Rsq
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
