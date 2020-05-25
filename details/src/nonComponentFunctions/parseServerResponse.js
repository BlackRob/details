import sampleSentence from "../data/sampleSentence.json";

export const parseServerResponse = (someJsonSentence) => {
  let mySentence = sampleSentence;

  /* let ngs = {
    active: true,                // game is currently not being played
    sentence: [mySentence[1]],    // the above sentence
    cards: mySentence[0][0].cards,   // in some cases, a game may come with cards
    snum: mySentence[0][0].snum,     // sentence number
  }; */
  let ngs = mySentence;
  console.log(ngs);
  return ngs;
}
