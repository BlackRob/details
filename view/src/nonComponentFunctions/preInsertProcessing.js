import uuid from 'uuid';

// this function turns the words on the working cards into a properly
// formatted sentence chunk, which means parsing cards for punctuation,
// spaces, etc.; "cards" is the array of cards, but only the ones in
// the working row will be processed in order ("workingCards" is just
// an array of card ID numbers)
export const preInsertProcessing = (cards, workingCards) => {
  let toBeInserted = [];

  // "workingCards" may have more than one card, so we process them in order
  workingCards.forEach((element, index) => {
    let thisCard = getCardById(cards, element);
    // get word and remove leading/trailing whitespace
    let werd = thisCard.word.trim();
    // check if first char is punctuation
    let punctoo = puncStartCheck(werd);
    if (punctoo.type !== "nopunc") {
      // if there's punctuation, we have to make a block and insert it
      toBeInserted.push({
        id: uuid.v4(),
        type: punctoo.type,
        word: punctoo.content,
      });
      // if we did remove punctuation, we must update werd
      werd = punctoo.newWerd;
    }
    // check if word is a noun and if it has an article
    if (thisCard.type === "noun") {
      let hasArticle = checkForArticle(werd);
      if (hasArticle) {
        //let article = getArticle(werd);
        toBeInserted.push({
          id: uuid.v4(),
          type: "adj",
          word: getArticle(werd),
        })
        werd = removeArticle(werd);
      }
    }
    // check if last char is punctuation; if not push werd then a space
    // char, if yes depunc werd, then push it, then push punctuation
    punctoo = puncEndCheck(werd);
    if (punctoo.type === "nopunc") {
      toBeInserted.push({
        id: thisCard.id,
        type: thisCard.type,
        word: werd,
      })
    } else {
      toBeInserted.push({
        id: thisCard.id,
        type: thisCard.type,
        word: punctoo.newWerd,
      })
      toBeInserted.push({
        id: uuid.v4(),
        type: punctoo.type,
        word: punctoo.content,
      })
    }
  })

  return toBeInserted;
}

const getCardById = (cards, cardId) => {
  let x = cards.filter(x => x.id === cardId);
  let y = null;
  if (x.length === 1) {
    y = x[0];
  } else {
    console.log("getCardById failed?!");
    console.log(x);
  }
  return y;
}

// given a short string (werd) to check if it starts with punctuation
const puncStartCheck = (werd) => {
  let punc = { type: "", content: "", newWerd: werd };
  switch (true) {
    case (werd[0] === ","):
      punc.type = "p_com";
      punc.content = ",";
      punc.newWerd = werd.slice(1).trim();
      break;
    case (werd[0] === ";"):
      punc.type = "p_semi";
      punc.content = ";";
      punc.newWerd = werd.slice(1).trim();
      break;
    case (werd[0] === ":"):
      punc.type = "p_col";
      punc.content = ":";
      punc.newWerd = werd.slice(1).trim();
      break;
    case (werd[0] === "("):
      punc.type = "p_parL";
      punc.content = "(";
      punc.newWerd = werd.slice(1).trim();
      break;
    default:
      punc.type = "nopunc";
  }

  return punc;
}

// given a short string (werd) to check if it ends with punctuation
const puncEndCheck = (werd) => {
  let end = werd.length - 1;
  let punc = { type: "", content: "", newWerd: werd };
  switch (true) {
    case (werd[end] === ","):
      punc.type = "p_com";
      punc.content = ",";
      punc.newWerd = werd.slice(0, end).trim();
      break;
    case (werd[end] === ";"):
      punc.type = "p_semi";
      punc.content = ";";
      punc.newWerd = werd.slice(0, end).trim();
      break;
    case (werd[end] === ":"):
      punc.type = "p_cln";
      punc.content = ":";
      punc.newWerd = werd.slice(0, end).trim();
      break;
    case (werd[end] === "!"):
      punc.type = "p_exc";
      punc.content = "!";
      punc.newWerd = werd.slice(0, end).trim();
      break;
    case (werd[end] === "."):
      punc.type = "p_prd";
      punc.content = ".";
      punc.newWerd = werd.slice(0, end).trim();
      break;
    case (werd[end] === "?"):
      punc.type = "p_qm";
      punc.content = "?";
      punc.newWerd = werd.slice(0, end).trim();
      break;
    case (werd[end] === ")"):
      punc.type = "p_parR";
      punc.content = ")";
      punc.newWerd = werd.slice(0, end).trim();
      break;
    default:
      punc.type = "nopunc";
  }

  return punc;
}

const checkForArticle = (werd) => {
  const regex = /^(the |a |an )/i;
  return regex.test(werd);
}

// this function will return the article as written,
// possible capitalization anomalies are not "fixed";
// we also know before this function gets called that
// werd matches at least one of these patterns, so we only
// have to test two
const getArticle = (werd) => {
  const theR = /^(the )/i;
  const anR = /^(an )/i;
  let article = "";

  if (theR.test(werd)) {
    article = werd.slice(0, 3);
  } else if (anR.test(werd)) {
    article = werd.slice(0, 2);
  } else {
    article = werd.slice(0, 1);
  }

  return article;
}

// this function will return the word without the article;
// we also know before this function gets called that
// werd matches at least one of these patterns, so we only
// have to test two
const removeArticle = (werd) => {
  const theR = /^(the )/i;
  const anR = /^(an )/i;
  let bareWord = "";

  if (theR.test(werd)) {
    bareWord = werd.slice(3);
  } else if (anR.test(werd)) {
    bareWord = werd.slice(2);
  } else {
    bareWord = werd.slice(1);
  }

  return bareWord.trim();
}