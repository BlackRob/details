import DrawGame from "../components/Game";
import Head from "next/head";

const Game = () => (
  <div className="container">
    <Head>
      <title>&quot;details&quot;</title>
      <link rel="icon" href="/favicon.ico" />
      <meta
        property="og:image"
        content="https://grumbly.games/default_thumbnail.png"
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="fb:app_id" content="220488252548780" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="http://details.grumbly.games/" />
      <meta
        property="og:image:secure_url"
        content="https://details.grumbly.games"
      />
      <meta property="og:title" content="click the image to play the game" />
      <meta
        property="og:description"
        content="details is a grammar game where you add words to make a sentence longer"
      />
    </Head>
    <div className="gameContent">
      <DrawGame />
    </div>

    <style jsx>{``}</style>
  </div>
);

export default Game;
