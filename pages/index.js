import DrawHeader from '../components/Header';
import DrawGame from '../components/Game';
import Head from 'next/head';


const Game = () => (
  <div className="container">
    <Head>
      <title>"details"</title>
      <link rel="icon" href="/favicon.ico" />
      <meta property="og:image" content="https://grumbly.games/default_thumbnail.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="fb:app_id" content="220488252548780" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://grumbly.games/details" />
      <meta property="og:title" content="click the image to play the game" />
      <meta property="og:description" content="details is a grammar game where you add words to make a sentence longer" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@GrumblyGames" />
      <meta name="twitter:title" content="click to play details" />
      <meta name="twitter:description" content="it's a game where you make sentences longer" />
      <meta name="twitter:image" content="https://grumbly.games/default_thumbnail.png" />
      <meta name="twitter:domain" content="https://grumbly.games/details" />
    </Head>
    <div className="gameContent">
      <DrawHeader />
      <DrawGame />
    </div>

    <style jsx>{`
      `}</style>

  </div>
)


export default Game