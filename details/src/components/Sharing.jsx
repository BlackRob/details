import React, { useEffect, createRef } from 'react';
import {
  EmailShareButton, EmailIcon,
  FacebookShareButton, FacebookIcon,
  TelegramShareButton, TelegramIcon,
  RedditShareButton, RedditIcon,
  TwitterShareButton, TwitterIcon,
  WhatsappShareButton, WhatsappIcon,
} from "react-share";
import "./Sharing.css";
import "./header_pages/header_pages.css";


// Clicking on the span opens an informative popup
const App = ({ sentence, cards, showSharing, setShowSharing, workingCards }) => {
  if (!showSharing) {
    return <div className="hidden"></div>
  } else {
    return <SharingPopUp sentence={sentence}
      cards={cards}
      setShowSharing={setShowSharing} />
  }
}

const SharingPopUp = ({ sentence, cards, setShowSharing, workingCards }) => {
  const canvasRef = createRef();
  let canvasDataURL = "";

  useEffect(() => {
    canvasDataURL = drawCanvas({ sentence, cards, canvasRef, workingCards });
  });

  return <div className="z2">
    <div className="sharing_popup">
      <div className="z2_title">
        Share your sentence!
      <span className="z2_hide" onClick={() => { setShowSharing(false) }}>x</span>
      </div>
      <canvas ref={canvasRef} width={1080} height={566} />

      <label htmlFor="my_comment">Enter your comment</label><br />
      <textarea id="my_comment"
        defaultValue="I'm playing details (the game)!"
        name="my_comment" rows="4" />
      <div className="sharing_button_row">
        <EmailShareButton children={<EmailIcon size={32} round={true} />} url={canvasDataURL} />
        <FacebookShareButton children={<FacebookIcon size={32} round={true} />} url={canvasDataURL} />
        <TelegramShareButton children={<TelegramIcon size={32} round={true} />} url={canvasDataURL} />
        <RedditShareButton children={<RedditIcon size={32} round={true} />} url={canvasDataURL} />
        <TwitterShareButton children={<TwitterIcon size={32} round={true} />} url={canvasDataURL} />
        <WhatsappShareButton children={<WhatsappIcon size={32} round={true} />} url={canvasDataURL} />
      </div>
    </div>
  </div>
}

/* this function redraws the current sentence and cards
  on a canvas, so that it can be shared as an image */
const drawCanvas = ({ sentence, cards, canvasRef, workingCards }) => {
  const ctx = canvasRef.current.getContext("2d");
  // we need to figure out how tall our image has to be first
  const min_height = 566;
  // we have to set and adjust the font several times
  // and firefox complains about "multiline support", so just in case 
  // these lines are looooong
  const font30 = 'normal normal 30px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';
  const font36 = 'normal normal 36px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'; // "comic sans ms"
  const font48 = 'normal normal 48px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';
  // sentence left/right margin
  const margin = 20;
  // top banner should always be the same
  const top_banner_height = 70;
  // margin at top of sentence should have a minimum value
  let top_bottom_sentence_margin = 30;
  // calculated height of sentence
  let sentence_height = 0;
  // if working row is empty, we don't show it
  let working_row_height = 120;
  // if sentence is complete (no cards left), we don't show card row
  let card_row_height = 100;

  // I don't know if this is necessary, but I want to use the same font as
  // the rest of the game is played in
  ctx.font = font48;

  // when working with text, with this font and size, assuming a lineheight
  // of 80px with the baseline at 60 looks good 
  // some convenience variables
  const rm = 30; // "row margin" for between rows
  const rh = 80; // average "row height" 
  const blo = 20; // baseline offset
  const wpr = 15; // word padding right
  const cw = canvasRef.current.width; // canvas width
  let rb = top_banner_height; // "row beginning" w/ initial value

  // do some pre-printing work, return an augmented array
  // it's important that the font is set to the correct font now for sizing
  let printArray = prePrintSentence(sentence, rm, rh, cw, wpr, margin, ctx);

  // calculate how tall sentence block should be
  let numRows = printArray[printArray.length - 1].row;
  sentence_height = numRows * rh + rm * (numRows - 1);

  let working_height = top_banner_height + top_bottom_sentence_margin +
    sentence_height + top_bottom_sentence_margin + working_row_height +
    margin + card_row_height + margin;
  // if a short sentence, we don't want our image to be too short

  canvasRef.current.height = Math.max(min_height, working_height);

  // resetting canvas height messes up font, so set it again
  ctx.font = font48;

  // if we're using minimum size, sentence margins to center sentence
  if (min_height > working_height) {
    top_bottom_sentence_margin = top_bottom_sentence_margin + (min_height - working_height) / 2;
    working_height = min_height;
  }

  // background
  ctx.fillStyle = "#282c34";
  ctx.fillRect(0, 0, cw, canvasRef.current.height);

  // header
  ctx.font = font36;
  ctx.fillStyle = "lightgray";
  ctx.fillText("details", 20, (rb - blo));
  ctx.fillStyle = "dodgerblue";
  let gamesWidth = ctx.measureText("games").width
  ctx.fillText("games", cw - 20 - gamesWidth, (rb - blo));
  ctx.fillStyle = "lightskyblue";
  let grumblyWidth = ctx.measureText("grumbly").width
  ctx.fillText("grumbly", cw - 20 - grumblyWidth - wpr - gamesWidth, (rb - blo));

  // top margin
  rb += top_bottom_sentence_margin;

  // sentence
  ctx.font = font48;
  printSentence(printArray, rb, wpr, blo, cw, ctx);
  rb += sentence_height;

  // bottom margin
  rb += top_bottom_sentence_margin;

  // working row
  ctx.fillStyle = 'whitesmoke';
  printWorkingRow(cards, margin, rb, cw, working_row_height, workingCards, ctx);
  rb += working_row_height;

  // between rows
  rb += margin;

  // card row
  ctx.lineWidth = 7;
  printCardRow(cards, margin, rb, cw, card_row_height, font30, ctx);
  rb += card_row_height;

  // final margin
  rb += margin;

  // return canvas as dataURL so I can share it ;)
  return canvasRef.current.toDataURL();
}

// printing the sentence is complicated because we need to figure
// out how many words go on each row, what color to make them, 
// set the margins... so we do some pre-printing work
const prePrintSentence = (sentence, rm, rh, cw, wpr, margin, ctx) => {
  // sentence is an array of objects, we're mapping each object
  // to a different object with a bit of extra information
  let printArray = sentence.map(word => ({
    id: word.id,
    word: word.word,
    type: word.type,
    color: typeColor(word.type),
    width: ctx.measureText(word.word).width + wpr,
    row: 1,  // default to row 1, will check and update later
    wordX: 0, // x position
    wordY: 0, // y position
  }));

  // horizontal spacing is the next issue
  // each word has it's own width, plus some space after it,
  // plus each row has a left and right margin
  const ww = cw - margin - margin;  // working width
  let currentRow = 1;
  let currentRowWidth = 0;

  for (let i = 0; i < printArray.length; i++) {
    // first check, is there enough room in row for word?
    // most of the time there is (more words are in one row
    // than have to wrap to the next), but we need to check
    // for several situations that require wrapping:
    // first, is the word too long for the remaining space? wrap!
    if (((printArray[i].width) >= (ww - currentRowWidth)) ||
      // or, if not too long, but it is followed by punctuation,
      // we want the punctuation to stay with it, so is it
      // too long with the punctuation? wrap!
      ((i + 1 < printArray.length) && // make sure this isn't last element
        isPunc(printArray[i + 1].type) && // if so, is next punctuation
        // if yes, and they both won't fit on this row, then wrap
        (printArray[i].width + printArray[i + 1].width) > (ww - currentRowWidth))) {
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
    currentRowOffset = currentRowOffset + printArray[i].width;
    printArray[i].wordY = rh * currentRow + rm * (currentRow - 1);
    // if there is a next element, look ahead and see if we need
    // to increment the row number / reset row offset
    if ((i + 1 < printArray.length) && (printArray[i + 1].row !== currentRow)) {
      currentRow += 1;
      currentRowOffset = 0;
    }
  }

  return printArray;
}

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
    rowWordsWidth.push(printArray.reduce((a, b) => {
      if (b.row === i) {
        return a + b.width;
      } else {
        return a;
      }
    }, 0));
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
    ctx.fillText(printArray[i].word,
      (printArray[i].wordX + indent[printArray[i].row]),
      (printArray[i].wordY + rb - blo));
  }
}

const printWorkingRow = (cards, margin, rb, cw, working_row_height, workingCards, ctx) => {
  ctx.fillRect(margin, rb, cw - margin - margin, working_row_height);
}

const printCardRow = (cards, margin, rb, cw, card_row_height, font, ctx) => {
  const cardbuttons = ["adj", "adv", "conj", "pron", "noun", "verb", "prep", "intrj"];
  const w = 110; // card width
  const gap = (cw - margin - margin - 8 * w) / 7;  // between cards
  const r = 10; // corner radius of button
  const y = rb;
  const h = card_row_height;
  const r1y = y + 40;
  const r2y = y + 80;
  let x = margin; // cards are arranged horizontally, this is initial value

  ctx.lineWidth = 5;
  ctx.textAlign = "center";

  cardbuttons.forEach(element => {
    let fill = false;
    let cardsByType = cards.filter(kard => (kard.type === element && !kard.working));
    if (cardsByType.length > 0) {
      fill = true;
      ctx.fillStyle = typeColor(element);
    } else {
      ctx.strokeStyle = 'gray';
      ctx.fillStyle = 'gray';
    }

    roundedRectangle(x, y, w, h, r, ctx, fill);

    ctx.font = font;
    if (fill) {
      ctx.fillStyle = 'black';
    }
    ctx.fillText(element, (x + w / 2), r1y);
    ctx.fillText(cardsByType.length, x + w / 2, r2y);
    x = x + w + gap;
  });
}

const typeColor = (type) => {
  let color = "";
  switch (true) {
    case (type === "conj"):
      color = "yellow"
      break;
    case (type === "adj"):
      color = "lightskyblue"
      break;
    case (type === "noun"):
      color = "dodgerblue"
      break;
    case (type === "adv"):
      color = "pink"
      break;
    case (type === "verb"):
      color = "#CE3175"
      break;
    case (type === "intrj"):
      color = "orange"
      break;
    case (type === "prep"):
      color = "lime"
      break;
    case (type === "pron"):
      color = "fuchsia"
      break;
    default:
      color = "lavender";
  }

  return color;
}

const roundedRectangle = (x, y, w, h, r, ctx, fill) => {
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.arcTo(x + w, y, x + w, y + h / 2, r);
  ctx.arcTo(x + w, y + h, x + w / 2, y + h, r);
  ctx.arcTo(x, y + h, x, y + h / 2, r);
  ctx.arcTo(x, y, x + w / 2, y, r);
  // I don't know why the previous ine doesn't
  // close the rectangle, so added a final segment
  ctx.lineTo(x + w / 2, y);
  if (fill) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
  ctx.closePath();
}

// a bunch of different types of punctuation ;)
// but they all start "p_", so we look for the underscore
const isPunc = (type) => {
  let punc = false;
  if (type[1] === "_") {
    punc = true;
  };
  return punc;
}

export default App;