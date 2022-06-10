import React, { useState } from "react";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  TelegramShareButton,
  TelegramIcon,
  WeiboShareButton,
  WeiboIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import Image from "next/image";
import { drawCanvas } from "./drawCanvas";
import { gameStateToStr } from "./gameStatePack";

// Clicking on the span opens an informative popup
const Sharing = ({ sentence, cards, showSharing, setShowSharing }) => {
  if (!showSharing) {
    return <></>;
  } else {
    return (
      <SharingPopUp
        sentence={sentence}
        cards={cards}
        setShowSharing={setShowSharing}
      />
    );
  }
};

const SharingPopUp = ({ sentence, cards, setShowSharing }) => {
  // variable to show if copy to clipboard worked
  const [copied, setCopied] = useState(false);
  // variable to show info if copy to clipboard failed
  const [copyFailed, setCopyFailed] = useState(false);

  const canvasDataURL = drawCanvas({ sentence, cards });
  const gameAsString = gameStateToStr({ sentence, cards });
  const readableSentence = makeReadable({ sentence });

  const canvasURLstring = Buffer.from(gameAsString, "utf8").toString("base64");
  const gameURL = `https://details.grumbly.games/${canvasURLstring}`;
  const imageURL = `https://details.grumbly.games/api/${canvasURLstring}`;

  return (
    <div className="z2">
      <div className="popup">
        <div className="z2_title">
          Share your sentence!
          <span
            className="z2_hide"
            onClick={() => {
              setShowSharing(false);
            }}
          >
            x
          </span>
        </div>
        <div className="shareableImageContainer">
          <Image
            src={canvasDataURL}
            height="628"
            width="1200"
            alt="sentence as image"
          />
        </div>

        <div className="sharing_button_row">
          <EmailShareButton
            url={gameURL}
            subject="I'm playing details"
            body={`Click the link to play.
          
          Current sentence:
          ${readableSentence}`}
          >
            <EmailIcon size={32} round={true} />
          </EmailShareButton>
          <FacebookShareButton url={gameURL} hashtag="ClickToPlay">
            <FacebookIcon size={32} round={true} />
          </FacebookShareButton>
          <TelegramShareButton url={gameURL} title="grumbly.games">
            <TelegramIcon size={32} round={true} />
          </TelegramShareButton>
          <WeiboShareButton
            url={gameURL}
            title="grumbly.games"
            image={imageURL}
          >
            <WeiboIcon size={32} round={true} />
          </WeiboShareButton>
          <TwitterShareButton url={gameURL} hashtags={["ClickToPlay"]}>
            <TwitterIcon size={32} round={true} />
          </TwitterShareButton>
          <WhatsappShareButton url={gameURL} title={`${readableSentence}`}>
            <WhatsappIcon size={32} round={true} />
          </WhatsappShareButton>
          <ClipboardButton
            toCopy={gameURL}
            copied={copied}
            setCopied={setCopied}
            setCopyFailed={setCopyFailed}
          />
        </div>
        <ClipFailedAdvice
          copyFailed={copyFailed}
          gameURL={gameURL}
          readableSentence={readableSentence}
        />
      </div>
      <style jsx>
        {`
          .sharing_button_row {
            display: flex;
            align-items: center;
            justify-content: space-around;
            width: 100%;
            height: auto;
          }
        `}
      </style>
      <style jsx global>
        {`
          button[class="react-share__ShareButton"] {
            margin: 0px;
            width: 32px;
            height: 32px;
            padding: 0px;
            border-radius: 50%;
          }
          button[class="react-share__ShareButton"]:hover,
          button[class="react-share__ShareButton"]:focus {
            outline: 0;
            box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.5);
          }
        `}
      </style>
    </div>
  );
};

const ClipboardButton = ({ toCopy, copied, setCopied, setCopyFailed }) => {
  let imgSrc = "/clipboard_unchecked.svg";
  let altText = "empty clipboard icon by Zach Bogart from the Noun Project";
  if (copied) {
    imgSrc = "/clipboard_checked.svg";
    altText = "checked clipboard icon by Zach Bogart from the Noun Project";
  }

  return (
    <button
      className="react-share__ShareButton"
      onClick={(e) => {
        e.preventDefault();
        navigator.clipboard.writeText(toCopy).then(
          function () {
            setCopied(true);
          },
          function () {
            // clipboard write failed
            setCopyFailed(true);
            console.log("copy to clipboard failed!");
          }
        );
        //updateClipboard({ newClip: toCopy, result: setCopied })
      }}
    >
      <Image src={imgSrc} width="32" height="32" alt={altText} />
      <style jsx>
        {`
          button {
            border: none;
            margin: 0px;
            width: 32px;
            height: 32px;
            padding: 0px;
          }
          img {
            margin: 0;
            box-shadow: none;
          }
        `}
      </style>
    </button>
  );
};

const ClipFailedAdvice = ({ copyFailed, gameURL, readableSentence }) => {
  if (copyFailed) {
    return (
      <>
        <p>
          Oh no! It looks like &quot;copy to clipboard&quot; didn&apos;t work!
        </p>
        <p>Maybe try to manually select and copy one of the strings below.</p>
        <p>
          <b>The game URL</b> --copy this to share the current game
        </p>
        <p>{gameURL}</p>
        <p>
          <b>The sentence itself</b>
        </p>
        <p>{readableSentence}</p>
        <style jsx>
          {`
            p {
              overflow-wrap: break-word;
              word-wrap: break-word;
              -ms-word-break: break-all;
              word-break: break-word;
            }
          `}
        </style>
      </>
    );
  } else {
    return null;
  }
};

const updateClipboard = ({ newClip, result }) => {
  navigator.clipboard.writeText(newClip).then(
    function () {
      result(true);
    },
    function () {
      // clipboard write failed
      result(false);
      console.log("copy to clipboard failed!");
    }
  );
};

const makeReadable = ({ sentence }) => {
  // produce a readable string for some methods of sharing
  let inArray = Object.keys(sentence);

  let x = null;
  let y = null;
  let next = null;
  let outputArray = inArray.map((id) => {
    // if it's a word, get ready to add it to the sentence
    if (
      sentence[id].type === "noun" ||
      sentence[id].type === "verb" ||
      sentence[id].type === "pron" ||
      sentence[id].type === "adj" ||
      sentence[id].type === "adv" ||
      sentence[id].type === "intrj" ||
      sentence[id].type === "conj" ||
      sentence[id].type === "prep"
    ) {
      x = sentence[id].word;
      y = "";
      // if we're not at the end of the array, and the next word is a word type
      // (not punctuation) then add a space
      next = (parseInt(id) + 1).toString();
      if (
        parseInt(id) + 1 < inArray.length &&
        (sentence[next].type === "noun" ||
          sentence[next].type === "verb" ||
          sentence[next].type === "pron" ||
          sentence[next].type === "adj" ||
          sentence[next].type === "adv" ||
          sentence[next].type === "intrj" ||
          sentence[next].type === "conj" ||
          sentence[next].type === "prep")
      ) {
        y = " ";
      }
    } else {
      x = "";
      y = puncsAndSpaces(sentence[id]);
    }
    return `${x}${y}`;
  });

  let outputString = outputArray.join("");

  outputString = outputString.replace(/\s+/g, " ");

  // probably still have an extra space at end of sentence
  if (outputString[outputString.length - 1] === " ") {
    outputString = outputString.substring(0, outputString.length - 1);
  }

  return outputString;
};

const puncsAndSpaces = (wordObj) => {
  // look at the type and either return the word and a space
  // or punctuation and a space or whatever as needed
  let output = null;

  let x = wordObj.type;
  switch (true) {
    case x === "head":
      output = ``;
      break;
    case x === "p_com":
      output = `, `;
      break;
    case x === "p_semi":
      output = `; `;
      break;
    case x === "p_cln":
      output = `: `;
      break;
    case x === "p_parL":
      output = ` (`;
      break;
    case x === "p_dbldashL":
      output = ` —`;
      break;
    case x === "p_prd":
      output = `. `;
      break;
    case x === "p_exc":
      output = `! `;
      break;
    case x === "p_parR":
      output = `) `;
      break;
    case x === "p_qm":
      output = `? `;
      break;
    case x === "p_dbldashR":
      output = `— `;
      break;
    case x === "p_Rqt":
      output = `” `;
      break;
    case x === "p_Lqt":
      output = ` “`;
      break;
    case x === "p_Rsq":
      output = `’ `;
      break;
    case x === "p_Lsq":
      output = ` ‘`;
      break;
    default:
      output = ``;
  }

  return output;
};

export default Sharing;
