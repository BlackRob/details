// this function turns the words on the working cards into a properly
// formatted sentence chunk, which means parsing cards for punctuation,
// spaces, etc.; "cards" is the array of cards, but only the ones in
// the working row will be processed in order ("workingCards" is just
// an array of card ID numbers)
export const preInsertProcessing = (cards, workingCards, maxCardId) => {
  let toBeInserted = [];
  let newCardId = maxCardId + 1;

  // "workingCards" may have more than one card, so we process them in order
  workingCards.forEach((element) => {
    let thisCard = getCardById(cards, element);
    // get word and remove leading/trailing whitespace
    let werd = thisCard.word.trim();
    // check if first char is punctuation
    let punctoo = puncStartCheck(werd);
    if (punctoo.type !== "nopunc") {
      // if there's punctuation, we have to make a block and insert it
      toBeInserted.push({
        id: newCardId++,
        type: punctoo.type,
        word: punctoo.content,
      });
      // if we did remove punctuation, we must update werd
      werd = punctoo.newWerd;
    }
    // check for articles, which can go in front of nouns, (the house)
    // adjectives (the yellow house), verbs (the burning yellow house),
    // or adverbs (the rapidly burning yellow house)
    if (
      thisCard.type === "noun" ||
      thisCard.type === "adj" ||
      thisCard.type === "verb" ||
      thisCard.type === "adv"
    ) {
      let hasArticle = checkForArticle(werd);
      if (hasArticle) {
        toBeInserted.push({
          id: newCardId++,
          type: "adj",
          word: getArticle(werd),
        });
        werd = removeArticle(werd);
      }
    }
    // sometimes a word on a card has spaces in it; this can be
    // a mistake or intentional: either way, we split the "word"
    // into components based on spaces and add them as
    // individual words of the same type;
    // this is important for verbs (which might have "to" or
    // auxiliary verbs), but also some other words have spaces
    // in them, like the pronoun "no one", or the nouns "real estate",
    // "swimming pool" or "post office"
    // any word with spaces on a card gets broken into separate words!
    if (thisCard.type) {
      let splitWerd = werd.split(/\s+/);
      if (splitWerd.length > 0) {
        splitWerd.forEach((x, index) => {
          // splitWerd should now be an array of all the components
          // of a word-with-spaces word; we need to keep
          // the last part for a final punc check, but here we
          // push all the rest into the toBeInserted array
          if (index !== splitWerd.length - 1) {
            if (thisCard.type === "verb" && x === "not") {
              toBeInserted.push({
                id: newCardId++,
                type: "adv",
                word: "not",
              });
            } else {
              toBeInserted.push({
                id: newCardId++,
                type: thisCard.type,
                word: x,
              });
            }
          }
        });
        werd = splitWerd[splitWerd.length - 1];
      }
    }
    // check if last char is punctuation; if not push werd,
    // if yes depunc werd, then push it, then push punctuation
    punctoo = puncEndCheck(werd);
    if (punctoo.type === "nopunc") {
      // last character is not punctuation, but one last check:
      // is it "not", because the game allows a player to use
      // the negative form of a verb, which means it has the
      // adverb "not" at the end (did not, have not)
      if (thisCard.type === "verb" && werd === "not") {
        toBeInserted.push({
          id: newCardId++,
          type: "adv",
          word: werd,
        });
      } else {
        toBeInserted.push({
          id: newCardId++,
          type: thisCard.type,
          word: werd,
        });
      }
    } else {
      // last character is punctuation
      // if we did remove punctuation, we must update werd
      werd = punctoo.newWerd;
      // once again, last word might be "not", so check again
      if (thisCard.type === "verb" && werd === "not") {
        toBeInserted.push({
          id: newCardId++,
          type: "adv",
          word: werd,
        });
      } else {
        toBeInserted.push({
          id: newCardId++,
          type: thisCard.type,
          word: punctoo.newWerd,
        });
      }
      // and finally, push punctuation
      toBeInserted.push({
        id: newCardId++,
        type: punctoo.type,
        word: punctoo.content,
      });
    }
  });

  return toBeInserted;
};

const getCardById = (cards, cardId) => {
  let x = cards.filter((x) => x.id === cardId);
  let y = null;
  if (x.length === 1) {
    y = x[0];
  } else {
    console.log("getCardById failed?!");
    console.log(x);
  }
  return y;
};

// given a short string (werd) to check if it starts with punctuation
const puncStartCheck = (werd) => {
  let punc = { type: "", content: "", newWerd: werd };
  switch (true) {
    case werd[0] === ",":
      punc.type = "p_com";
      punc.content = ",";
      punc.newWerd = werd.slice(1).trim();
      break;
    case werd[0] === ";":
      punc.type = "p_semi";
      punc.content = ";";
      punc.newWerd = werd.slice(1).trim();
      break;
    case werd[0] === ":":
      punc.type = "p_cln";
      punc.content = ":";
      punc.newWerd = werd.slice(1).trim();
      break;
    case werd[0] === "(":
      punc.type = "p_parL";
      punc.content = "(";
      punc.newWerd = werd.slice(1).trim();
      break;
    case werd[0] === ".":
      punc.type = "p_prd";
      punc.content = ".";
      punc.newWerd = werd.slice(1).trim();
      break;
    case werd.substring(0, 2) === "--":
      punc.type = "p_dbldashL";
      punc.content = "--";
      punc.newWerd = werd.slice(2).trim();
      break;
    case werd[0] === '"':
      punc.type = "p_Lqt";
      punc.content = '"';
      punc.newWerd = werd.slice(1).trim();
      break;
    case werd[0] === "'":
      punc.type = "p_Lsq";
      punc.content = "'";
      punc.newWerd = werd.slice(1).trim();
      break;
    default:
      punc.type = "nopunc";
  }

  return punc;
};

// given a short string (werd) to check if it ends with punctuation
const puncEndCheck = (werd) => {
  let end = werd.length - 1;
  let punc = { type: "", content: "", newWerd: werd };
  switch (true) {
    case werd[end] === ",":
      punc.type = "p_com";
      punc.content = ",";
      punc.newWerd = werd.slice(0, end).trim();
      break;
    case werd[end] === ";":
      punc.type = "p_semi";
      punc.content = ";";
      punc.newWerd = werd.slice(0, end).trim();
      break;
    case werd[end] === ":":
      punc.type = "p_cln";
      punc.content = ":";
      punc.newWerd = werd.slice(0, end).trim();
      break;
    case werd[end] === "!":
      punc.type = "p_exc";
      punc.content = "!";
      punc.newWerd = werd.slice(0, end).trim();
      break;
    case werd[end] === ".":
      punc.type = "p_prd";
      punc.content = ".";
      punc.newWerd = werd.slice(0, end).trim();
      break;
    case werd[end] === "?":
      punc.type = "p_qm";
      punc.content = "?";
      punc.newWerd = werd.slice(0, end).trim();
      break;
    case werd[end] === ")":
      punc.type = "p_parR";
      punc.content = ")";
      punc.newWerd = werd.slice(0, end).trim();
      break;
    case werd.substring(werd.length - 2) === "--":
      punc.type = "p_dbldashR";
      punc.content = "--";
      punc.newWerd = werd.slice(0, werd.length - 2).trim();
      break;
    case werd[end] === '"':
      punc.type = "p_Rqt";
      punc.content = '"';
      punc.newWerd = werd.slice(0, end).trim();
      break;
    case werd[0] === "'":
      punc.type = "p_Rsq";
      punc.content = "'";
      punc.newWerd = werd.slice(0, end).trim();
      break;
    default:
      punc.type = "nopunc";
  }

  return punc;
};

// just a test; articles need to be extracted
const checkForArticle = (werd) => {
  const regex = /^(the |a |an )/i;
  return regex.test(werd);
};

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
};

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
};

// not using this code but might, so I'm saving it:

//
/* // check if "to" infinitive
if (checkForTo(werd)) {
  toBeInserted.push({
    id: uuid.v4(),
    type: "verb",
    word: "to",
  })
  werd = werd.slice(2, end).trim();
}
// remove any modals
let modalObj = extractModals(werd);
if (modalObj.modal.length > 0) {
  toBeInserted.push({
    id: uuid.v4(),
    type: "verb",
    word: modalObj.modal,
  })
  werd = modalObj.restOfVerb;
}

// check if "to" infinitive
if (checkForTo(werd)) {
  toBeInserted.push({
    id: uuid.v4(),
    type: "verb",
    word: "to",
  })
  werd = werd.slice(2, end).trim();
}
// remove any modals
let modalObj = extractModals(werd);
if (modalObj.modal.length > 0) {
  toBeInserted.push({
    id: uuid.v4(),
    type: "verb",
    word: modalObj.modal,
  })
  werd = modalObj.restOfVerb;
}

// just a test; if a verb is an infintive with "to"
const checkForTo = (werd) => {
  const regex = /^(to)/i;
  return regex.test(werd);
}

// not currently used
const checkForModals = (werd) => {
  const regex = /^(can |could |will |would |shall |should |might |may |must |have to |ought to |had better |dare need |used to)/i;
  return regex.test(werd);
}

// not finished
const extractModals = (werd) => {
  let end = werd.length - 1;
  let modalObj = { modal: "", restOfVerb: "", };
  switch (true) {
    case (/^can /.test(werd)):
      modalObj.modal = werd.slice(0, 3).trim();
      modalObj.restOfVerb = werd.slice(3, end).trim();
      break;
    case (/^could /.test(werd)):
      modalObj.modal = werd.slice(0, 5).trim();
      modalObj.restOfVerb = werd.slice(5, end).trim();
      break;
    case (/^will /.test(werd)):
      modalObj.modal = werd.slice(0, 4).trim();
      modalObj.restOfVerb = werd.slice(4, end).trim();
      break;
    case (/^would /.test(werd)):
      modalObj.modal = werd.slice(0, 5).trim();
      modalObj.restOfVerb = werd.slice(5, end).trim();
      break;
    case (/^shall /.test(werd)):
      modalObj.modal = werd.slice(0, 5).trim();
      modalObj.restOfVerb = werd.slice(5, end).trim();
      break;
    default:
      ;
  }
  return modalObj;
}

// not completed
const checkForAuxVerbs = (werd) => {
  const regex = /^(the |a |an )/i;
  return regex.test(werd);
}
*/
