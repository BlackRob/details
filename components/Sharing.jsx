import React, { useState, useEffect } from 'react';
import {
  EmailShareButton, EmailIcon,
  FacebookShareButton, FacebookIcon,
  TelegramShareButton, TelegramIcon,
  WeiboShareButton, WeiboIcon,
  TwitterShareButton, TwitterIcon,
  WhatsappShareButton, WhatsappIcon,
} from "react-share";
import { drawCanvas } from "./drawCanvas";
import { gameStateToStr } from "./gameStatePack"


// Clicking on the span opens an informative popup
const Sharing = ({ sentence, cards, showSharing, setShowSharing, wih }) => {
  if (!showSharing) {
    return <></>
  } else {
    return <SharingPopUp sentence={sentence}
      cards={cards}
      setShowSharing={setShowSharing}
      wih={wih} />
  }
}

const SharingPopUp = ({ sentence, cards, setShowSharing, wih }) => {
  // have to run a script to get the skype button
  /* useEffect(() => {
    (function (r, d, s) {
      r.loadSkypeWebSdkAsync = r.loadSkypeWebSdkAsync || function (p) {
        var js, sjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(p.id)) { return; }
        js = d.createElement(s);
        js.id = p.id;
        js.src = p.scriptToLoad;
        js.onload = p.callback
        sjs.parentNode.insertBefore(js, sjs);
      };
      var p = {
        scriptToLoad: 'https://swx.cdn.skype.com/shared/v/latest/skypewebsdk.js',
        id: 'skype_web_sdk'
      };
      r.loadSkypeWebSdkAsync(p);
    })(window, document, 'script')
  }, []) */

  //console.log(gameStateToStr({ sentence, cards }))
  const canvasDataURL = drawCanvas({ sentence, cards })
  const gameAsString = gameStateToStr({ sentence, cards })
  const readableSentence = makeReadable({ sentence })
  console.log(readableSentence)
  const canvasURLstring = Buffer.from(gameAsString, 'utf8').toString('base64')
  const gameURL = `https://details.grumbly.games/${canvasURLstring}`
  const imageURL = `https://details.grumbly.games/api/${canvasURLstring}`

  return <div className="z2">
    <div className="sharing_popup">
      <div className="z2_title">
        Share your sentence! {wih}
        <span className="z2_hide" onClick={() => { setShowSharing(false) }}>x</span>
      </div>
      <img src={canvasDataURL} />

      <div className="sharing_button_row">
        <EmailShareButton children={<EmailIcon size={32} round={true} />} url={gameURL} subject="I'm playing details"
          body={`Click the link to play.
          
          Current sentence:
          ${readableSentence}`} />
        <FacebookShareButton children={<FacebookIcon size={32} round={true} />} url={gameURL} hashtag="ClickToPlay" />
        <TelegramShareButton children={<TelegramIcon size={32} round={true} />} url={gameURL} title="grumbly.games" />
        <WeiboShareButton children={<WeiboIcon size={32} round={true} />} url={gameURL} title="grumbly.games" image={imageURL} />
        <TwitterShareButton children={<TwitterIcon size={32} round={true} />} url={gameURL} hashtags={["ClickToPlay"]} />
        <WhatsappShareButton children={<WhatsappIcon size={32} round={true} />} url={gameURL} title="grumbly.games" />
        {/* <div className='skype-share' data-href={gameURL} data-lang='en-US' data-text='' data-style='' >
          <img className="skypeShareLogo" src='/s_logo.svg' width="18px" height="18px" />
        </div> */}
        <ClipboardButton toCopy={gameURL} />
      </div>
    </div>
    <style jsx>
      {`
        .sharing_popup {
          position: relative;
          box-sizing: border-box;
          width: 90%;
          max-width: 960px;
          text-align: left;
          background: gainsboro;
          border: 1px solid black;
          color: black;
          padding: 30px;
          margin-left: auto;
          margin-right: auto;
        }

        .sharing_popup button {
          display: inline-block;
          text-decoration: none;
          border: none;
          box-sizing: border-box;
          background-color: inherit;
          padding: none;
          font-weight: 300;
          font-size: 1em;
          color: var(--active_outline);
          transition: all 0.2s;
          width: auto;
        }

        .sharing_popup button:visited {
          color: var(--active_outline);
        }

        .sharing_popup button:hover {
          color: lightslategray;
          cursor: pointer;
        }

        .sharing_popup button:active {
          color: darkslategray;
        }

        .sharing_popup label {
          font-size: 0.8em;
        }

        .sharing_popup img {
          width: 100%; 
          min-height: 100%;
          margin: 0.8em 0;
          box-shadow: 2px 2px 5px slategray;
        }


        .sharing_button_row {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 100%;
          height: auto;
        }
        
        .z2 {
          display: block;
          box-sizing: border-box;
          min-height: 100vh;
          width: 100%;
          margin: 0;
          position: absolute; /* Stay in place */
          z-index: 2; /* Sit on top */
          left: 0;
          top: 0;
          padding: 20px 0px;
          background: rgba(0, 0, 0, 0.5);
          font-size: 1rem;
          overflow-y: scroll;
          scrollbar-width: none;
        }
        .z2::-webkit-scrollbar {
          display: none;
        }

        .z2_body {
          position: relative;
          box-sizing: border-box;
          width: 90%;
          max-width: 960px;
          text-align: left;
          background: white;
          border: 1px solid black;
          color: black;
          padding: 30px;
          margin-left: auto;
          margin-right: auto;
        }

        .z2_title {
          font-size: 1.5rem;
          color: #444;
          width: 100%;
          line-height: 1.8rem;
        }

        .z2_hide {
          float: right;
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: -0.5rem;
        }
        .z2_hide:hover {
          cursor: pointer;
        } 
        .skype-share {
          margin: 0px;
          width: 32px;
          height: 32px;
          padding: 0px;
          border-radius: 50%;
          background-color: #00AFF0;
          color: white;
        }
        .skype-share img {
          width: 18px;
          height: 18px;
          min-height: 18px;
          margin: 7px;
          box-shadow: none;
        }
        .skype-share:hover, .skype-share:focus {
          outline: 0;
          box-shadow: 0 0 3px 3px rgba(0, 0, 0, .5);
          transition: all 0.2s;
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
        button[class="react-share__ShareButton"]:hover, button[class="react-share__ShareButton"]:focus {
          outline: 0;
          box-shadow: 0 0 3px 3px rgba(0, 0, 0, .5);
        }
      `}
    </style>
  </div>
}

const ClipboardButton = ({ toCopy }) => {
  const [copied, setCopied] = useState(false);
  let imgSrc = "/clipboard_unchecked.svg"
  let altText = "empty clipboard icon by Zach Bogart from the Noun Project"
  if (copied) {
    imgSrc = "/clipboard_checked.svg"
    altText = "checked clipboard icon by Zach Bogart from the Noun Project"
  }

  return <button
    className="react-share__ShareButton"
    onClick={(e) => {
      e.preventDefault();
      updateClipboard({ newClip: toCopy, result: setCopied })
    }}><img src={imgSrc} width="32" height="32" alt={altText} />
    <style jsx>
      {`
        button {
          border: none;
          margin: 0px;
          width: 32px;
          height: 32px;
          padding: 0px;
        }
      `}
    </style>
  </button >;
}

const updateClipboard = ({ newClip, result }) => {
  navigator.clipboard.writeText(newClip).then(function () {
    result(true)
  }, function () {
    /* clipboard write failed */
    result(false)
    console.log("copy to clipboard failed!")
  });
}

const makeReadable = ({ sentence }) => {
  // produce a readable string for some methods of sharing
  let inArray = (Object.keys(sentence))

  let x = null
  let y = null
  let next = null
  let outputArray = inArray.map(id => {
    // if it's a word, get ready to add it to the sentence
    if (sentence[id].type === "noun" || sentence[id].type === "verb" ||
      sentence[id].type === "pron" || sentence[id].type === "adj" || sentence[id].type === "adv" ||
      sentence[id].type === "intrj" || sentence[id].type === "conj" || sentence[id].type === "prep") {
      x = sentence[id].word
      y = ""
      // if we're not at the end of the array, and the next word is a word type
      // (not punctuation) then add a space
      next = (parseInt(id) + 1).toString()
      if (parseInt(id) + 1 < inArray.length && (sentence[next].type === "noun" || sentence[next].type === "verb" ||
        sentence[next].type === "pron" || sentence[next].type === "adj" || sentence[next].type === "adv" ||
        sentence[next].type === "intrj" || sentence[next].type === "conj" || sentence[next].type === "prep")) {
        y = " "
      }
    } else {
      x = ""
      y = puncsAndSpaces(sentence[id])
    }
    return `${x}${y}`
  })

  let outputString = outputArray.join('')

  outputString = outputString.replace(/\s+/g, ' ');

  // probably still have an extra space at end of sentence
  if (outputString[outputString.length - 1] === " ") {
    outputString = outputString.substring(0, outputString.length - 1)
  }

  return outputString
}

const puncsAndSpaces = (wordObj) => {
  // look at the type and either return the word and a space
  // or punctuation and a space or whatever as needed
  let output = null

  let x = wordObj.type
  switch (true) {
    case (x === "head"):
      output = ``;
      break;
    case (x === "p_com"):
      output = `, `;
      break;
    case (x === "p_semi"):
      output = `; `;
      break;
    case (x === "p_cln"):
      output = `: `;
      break;
    case (x === "p_parL"):
      output = ` (`;
      break;
    case (x === "p_dbldashL"):
      output = ` —`;
      break;
    case (x === "p_prd"):
      output = `. `;
      break;
    case (x === "p_exc"):
      output = `! `;
      break;
    case (x === "p_parR"):
      output = `) `;
      break;
    case (x === "p_qm"):
      output = `? `;
      break;
    case (x === "p_dbldashR"):
      output = `— `;
      break;
    case (x === "p_Rqt"):
      output = `” `;
      break;
    case (x === "p_Lqt"):
      output = ` “`;
      break;
    case (x === "p_Rsq"):
      output = `’ `;
      break;
    case (x === "p_Lsq"):
      output = ` ‘`;
      break;
    default:
      output = ``;
  }

  return output
}

export default Sharing;


