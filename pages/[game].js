import sentences from "../data/sentences.json";
import React from "react";
import DrawGame from "../components/Game";
import { stringIsValid, gameStateToStr } from "../components/gameStatePack";
import Head from "next/head";

const Game = ({ returnString }) => (
  <div className="container">
    <Head>
      <title>&quot;details&quot;</title>
      <link rel="icon" href="/favicon.ico" />

      {/* <!-- Facebook Meta Tags --> */}
      <meta
        property="og:url"
        content={`https://details.grumbly.games/${returnString}`}
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="click the image to play the game" />
      <meta
        property="og:description"
        content="make the sentence better by adding details"
      />
      <meta property="fb:app_id" content="220488252548780" />
      <meta
        property="og:image"
        content={`http://details.grumbly.games/api/${returnString}.png`}
      />

      {/* <!-- Twitter Meta Tags --> */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="details.grumbly.games" />
      <meta
        property="twitter:url"
        content={`https://details.grumbly.games/${returnString}`}
      />
      <meta name="twitter:title" content="click the image to play the game" />
      <meta
        name="twitter:description"
        content="make the sentence better by adding details"
      />
      <meta
        name="twitter:image"
        content={`http://details.grumbly.games/api/square/${returnString}.png`}
      />
      {/* 
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:width" content="600" />
      <meta property="og:image:height" content="600" /> */}
    </Head>

    <div className="gameContent">
      <DrawGame
        gameState={Buffer.from(returnString, "base64").toString("utf8")}
      />
    </div>

    <style jsx>{``}</style>
  </div>
);

// This gets called on every request
export async function getServerSideProps(context) {
  let returnString = "";
  // base64 encoded error sentence
  const errorString =
    "1xThe~2ysent~3zlink~4yis~5wnot~6xa~7xvalid~8zsentence~9f~~";
  const bufES = Buffer.from(errorString, "utf8");
  const encES = bufES.toString("base64");
  // string in page req is already base64 encoded, or a short integer
  const encS = context.query.game;
  const bufS = Buffer.from(encS, "base64");
  const reqString = bufS.toString("utf8");

  // page requested ("game") may be a number corresponding to
  // a particular starter sentence or reflect a game state
  // or be garbage: first check, is it a number?
  if (isNaN(context.query.game)) {
    // most likely case is the "game" requested is from
    // someone clicking a shared link, which means the link
    // contains the full state of a game _or_
    // it contains nonsense; this test handles both cases
    if (stringIsValid({ sentenceString: reqString })) {
      //console.log("string is valid", reqString)
      returnString = encS;
    } else {
      //console.log("string is invalid")
      returnString = encES;
    }
    // following is for numbers, which aren't encoded
  } else if (sentences.hasOwnProperty(`_${context.query.game}`)) {
    // if it is a number we check if that number matches a
    // known starter sentence and respond appropriately
    returnString = Buffer.from(
      gameStateToStr({
        sentence: sentences[`_${context.query.game}`].sentence,
        cards: sentences[`_${context.query.game}`].cards,
      }),
      "utf8"
    ).toString("base64");
    //console.log("return string", returnString)
    //console.log(Buffer.from(returnString, 'base64').toString('utf8'))
  } else {
    // if the number requested doesn't exist, respond with sentence 4
    // which states that the requested sentence doesn't exist
    returnString = encES;
  }

  // Pass data to the page via props
  return { props: { returnString } };
}

export default Game;
