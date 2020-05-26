// shorten json as much as possible and convert it to a string
export const gameStateToStr = ({ sentence, cards }) => {
  let sArray = (Object.keys(sentence))

  let outputArray = sArray.map(id => {
    return wordShorthand(sentence[id])
  })

  // remove the empty string in position 0
  outputArray.shift()
  // add a tilde to end of array,
  // because this will result in 2 tildes when
  // we join it later signalling end of the sentence part
  outputArray.push("~")
  //console.log(outputArray)

  // first part of output string
  let outputString = outputArray.join('~')

  let cArray = (Object.keys(cards))
  // let's reuse outputArray to process the cards
  outputArray = cArray.map(id => {
    return cardShorthand(cards[id])
  })

  // second part of output string
  let outputString2 = outputArray.join('~')

  // just in case there were weird characters, encode URI
  return encodeURI(outputString + outputString2)
}

// reverse the process (expand the string back into a useable game state)
export const strToGameState = ({ canvasURLstring }) => {
  // this shouldn't be necessary, but just in case
  let myString = decodeURI(canvasURLstring)

  // there will be cases where the sent string won't
  // be a valid sentence : any non-number nonsense
  // someone types in as the URL path, the routing will
  // bring it here, so we check at each step to make 
  // sure the string is valid 
  let nonsense = false
  // we return an error message sentence if the URL path is nonsense
  const errorSentence = [{ id: 0, type: "head", word: "" },
  { id: 1, type: "adj", word: "The" },
  { id: 2, type: "verb", word: "sent" },
  { id: 3, type: "noun", word: "link" },
  { id: 4, type: "verb", word: "is" },
  { id: 5, type: "adv", word: "not" },
  { id: 6, type: "adj", word: "a" },
  { id: 7, type: "adj", word: "valid" },
  { id: 8, type: "noun", word: "sentence" },
  { id: 9, type: "p_prd", word: "." }]
  const errorCards = []
  // 1xThe~2ysent~3zlink~4yis~5wnot~6xa~7xvalid~8zsentence~9f~~

  // method: look at each character in turn, determine
  // what it is based by it's position, content, place it into
  // the gameState object; but we split it into two arrays first
  let sArray = [] // sentence array
  let cArray = [] // card array
  let gameState = { "cards": [], "sentence": [] }

  // every good string will have two consecutive tildes
  // in it: if not, nonsense!
  let sE = myString.indexOf("~~")
  if (sE === -1) {
    nonsense = true
  } else {
    // split into substrings --which might still be nonsense!
    sArray = myString.substring(0, sE).split("~")
    // a valid string is "sentence encoded"~~"cards encoded"
    // if there are no cards, this next part fails, so check first
    if (myString.length > sE + 2) {
      cArray = myString.substring(sE + 2).split("~")
    }
  }

  ////// a few more constants we'll need //////
  // regular expression for separating the ID
  // from the rest of the string
  const idRE = /^\d*/
  // a dictionary for matching punctuation to type
  const typeDict = {
    "p_com": ",",
    "p_semi": ";",
    "p_cln": ":",
    "p_parL": "(",
    "p_dbldashL": "—",
    "p_prd": ".",
    "p_exc": "!",
    "p_parR": ")",
    "p_qm": "?",
    "p_dbldashR": "—",
    "p_Lqt": '“',
    "p_Rqt": '”',
    "p_Rsq": `’`,
    "p_Lsq": `‘`
  }

  // we skip the "head" element when we encode a sentence, so we
  // start by adding it at the beginning
  gameState.sentence.push({ id: 0, type: "head", word: "" })
  sArray.forEach((x) => {
    let xID = x.match(idRE)[0]
    let xTypecode = x[xID.length]
    let xType = decodeType(xTypecode)
    let xWord = x.substring(xID.length + 1)
    // if the word is type punc, we have to insert
    // the actual punctuation as the "word" value
    if (xType[1] === "_") {  // true for all punc types
      xWord = typeDict[xType]
    }
    gameState.sentence.push({
      id: parseInt(xID),
      type: xType,
      word: xWord,
    })
  })

  cArray.forEach((x) => {
    let working = false
    let y = x // we might have to edit it, so we make a copy
    // if first character is a t, working = true
    if (x[0] === "t") {
      working = true
      y = x.substring(1)
    }
    let xID = y.match(idRE)[0]
    let xTypecode = y[xID.length]
    let xType = decodeType(xTypecode)
    let xWord = y.substring(xID.length + 1)
    gameState.cards.push({
      id: parseInt(xID),
      type: xType,
      word: xWord,
      working: working
    })
  })

  if (nonsense === true) {
    gameState.cards = errorCards
    gameState.sentence = errorSentence
  }
  //console.log(gameState)

  return JSON.stringify(gameState)
}


// check if string represents a properly formatted game state
export const stringIsValid = ({ sentenceString }) => {
  let good = true     // #optimism

  let sArray = []
  let cArray = []
  // every good string will have two consecutive tildes
  // in it: if not, nonsense!
  console.log(sentenceString)
  let sE = sentenceString.indexOf("~~")
  if (sE === -1) {
    console.log("no tildes")
    good = false
  } else {
    // split into substrings --which might still be nonsense!
    sArray = sentenceString.substring(0, sE).split("~")
    // a valid string is "sentence encoded"~~"cards encoded"
    // if there are no cards, this next part fails, so check first
    if (sE + 2 > sentenceString.length) {
      cArray = sentenceString.substring(sE + 2).split("~")
    }
    // test each substring against a pattern
    const sArrayRE = /^\d*[a-ms-z]\w*$/
    sArray.forEach((x) => {
      if (!sArrayRE.test(x)) {
        console.log(x)
        good = false
      }
    })
    const cArrayRE = /^t*\d*[s-z]\w*$/
    cArray.forEach((x) => {
      if (!cArrayRE.test(x)) {
        console.log(x)
        good = false
      }
    })
  }
  return good
}

// convert "word" object into a string
const wordShorthand = (wordObj) => {
  let typeCode = null

  // each code is number (id), single char, then word
  let x = wordObj.type
  switch (true) {
    case (x === "p_com"):
      typeCode = `${wordObj.id}a`;
      break;
    case (x === "p_semi"):
      typeCode = `${wordObj.id}b`;
      break;
    case (x === "p_cln"):
      typeCode = `${wordObj.id}c`;
      break;
    case (x === "p_parL"):
      typeCode = `${wordObj.id}d`;
      break;
    case (x === "p_dbldashL"):
      typeCode = `${wordObj.id}e`;
      break;
    case (x === "p_prd"):
      typeCode = `${wordObj.id}f`;
      break;
    case (x === "p_exc"):
      typeCode = `${wordObj.id}g`;
      break;
    case (x === "p_parR"):
      typeCode = `${wordObj.id}h`;
      break;
    case (x === "p_qm"):
      typeCode = `${wordObj.id}i`;
      break;
    case (x === "p_dbldashR"):
      typeCode = `${wordObj.id}j`;
      break;
    case (x === "p_Rqt"):
      typeCode = `${wordObj.id}l`;
      break;
    case (x === "p_Lqt"):
      typeCode = `${wordObj.id}m`;
      break;
    case (x === "p_Rsq"):
      typeCode = `${wordObj.id}n`;
      break;
    case (x === "p_Lsq"):
      typeCode = `${wordObj.id}o`;
      break;
    case (x === "head"):
      // we don't write anything for head
      typeCode = "";
      break;
    // notice, we skip from the beginning of the alphabet
    // for letters to stand for punctuation types, but skip to
    // the end and go backwards for word types
    case (x === "intrj"):
      typeCode = `${wordObj.id}s${wordObj.word}`;
      break;
    case (x === "pron"):
      typeCode = `${wordObj.id}t${wordObj.word}`;
      break;
    case (x === "conj"):
      typeCode = `${wordObj.id}u${wordObj.word}`;
      break;
    case (x === "prep"):
      typeCode = `${wordObj.id}v${wordObj.word}`;
      break;
    case (x === "adv"):
      typeCode = `${wordObj.id}w${wordObj.word}`;
      break;
    case (x === "adj"):
      typeCode = `${wordObj.id}x${wordObj.word}`;
      break;
    case (x === "verb"):
      typeCode = `${wordObj.id}y${wordObj.word}`;
      break;
    case (x === "noun"):
      typeCode = `${wordObj.id}z${wordObj.word}`;
      break;
    default:
      typeCode = "";
  }

  return typeCode
}

// convert "card" object into a string
const cardShorthand = (cardObj) => {
  let typeCode = null

  ///////////////////////////////////////////////////////////////////
  /////// ATTENTION 
  /////// the t function is supposed to add a t to the beginning of
  /////// a string that's "working" -- the t functional is 
  /////// currently cobbled with by comment markers, because the 
  /////// (intentionally) not being passed when a game is shared
  //////////////////////// (for now)
  // each code is number (id), single char, then word
  let x = cardObj.type
  switch (true) {
    case (x === "intrj"):
      typeCode = `${t(cardObj.working)}${cardObj.id}s${cardObj.word}`;
      break;
    case (x === "pron"):
      typeCode = `${t(cardObj.working)}${cardObj.id}t${cardObj.word}`;
      break;
    case (x === "conj"):
      typeCode = `${t(cardObj.working)}${cardObj.id}u${cardObj.word}`;
      break;
    case (x === "prep"):
      typeCode = `${t(cardObj.working)}${cardObj.id}v${cardObj.word}`;
      break;
    case (x === "adv"):
      typeCode = `${t(cardObj.working)}${cardObj.id}w${cardObj.word}`;
      break;
    case (x === "adj"):
      typeCode = `${t(cardObj.working)}${cardObj.id}x${cardObj.word}`;
      break;
    case (x === "verb"):
      typeCode = `${t(cardObj.working)}${cardObj.id}y${cardObj.word}`;
      break;
    case (x === "noun"):
      typeCode = `${t(cardObj.working)}${cardObj.id}z${cardObj.word}`;
      break;
    default:
      // we should never get here
      typeCode = "";
  }

  return typeCode
}

const t = (w) => {
  let returnValue = ""
  // w should be a boolean
  ////if (w) {
  ////  returnValue = "t"
  ////}

  return returnValue
}

const decodeType = (x) => {
  let typeCode = null
  switch (true) {
    case (x === "a"):
      typeCode = "p_com";
      break;
    case (x === "b"):
      typeCode = "p_semi";
      break;
    case (x === "c"):
      typeCode = "p_cln";
      break;
    case (x === "d"):
      typeCode = "p_parL";
      break;
    case (x === "e"):
      typeCode = "p_dbldashL";
      break;
    case (x === "f"):
      typeCode = "p_prd";
      break;
    case (x === "g"):
      typeCode = "p_exc";
      break;
    case (x === "h"):
      typeCode = "p_parR";
      break;
    case (x === "i"):
      typeCode = "p_qm";
      break;
    case (x === "j"):
      typeCode = "p_dbldashR";
      break;
    case (x === "l"):
      typeCode = "p_Rqt";
      break;
    case (x === "m"):
      typeCode = "p_Lqt";
      break;
    case (x === "n"):
      typeCode = "p_Rsq";
      break;
    case (x === "o"):
      typecode = "p_Lsq";
      break;
    // notice, we skip from the beginning of the alphabet
    // for letters to stand for punctuation types, but skip to
    // the end and go backwards for word types
    case (x === "s"):
      typeCode = "intrj";
      break;
    case (x === "t"):
      typeCode = "pron";
      break;
    case (x === "u"):
      typeCode = "conj";
      break;
    case (x === "v"):
      typeCode = "prep";
      break;
    case (x === "w"):
      typeCode = "adv";
      break;
    case (x === "x"):
      typeCode = "adj";
      break;
    case (x === "y"):
      typeCode = "verb";
      break;
    case (x === "z"):
      typeCode = "noun";
      break;
    default:
      // should never get here
      typeCode = "";
  }

  return typeCode
}
