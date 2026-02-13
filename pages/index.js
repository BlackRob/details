import DrawGame from "../components/Game";
import Head from "next/head";
import { Box } from "@mantine/core";

const Game = () => (
  // CHANGED: bg="black" ensures the sides/background are purely black
  <Box w="100vw" h="100vh" bg="black">
    <Head>
      <title>&quot;details&quot;</title>
      <link rel="icon" href="/favicon.ico" />

      <meta
        name="description"
        content="details is a grammar game where you add words to make a sentence longer"
      />

      <meta property="og:url" content="https://details.grumbly.games/" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="click the image to play the game" />
      <meta
        property="og:description"
        content="details is a grammar game where you add words to make a sentence longer"
      />
      <meta
        property="og:image"
        content="https://grumbly.games/default_thumbnail.png"
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="details.grumbly.games" />
      <meta property="twitter:url" content="https://details.grumbly.games/" />
      <meta name="twitter:title" content="click the image to play the game" />
      <meta
        name="twitter:description"
        content="details is a grammar game where you add words to make a sentence longer"
      />
      <meta
        name="twitter:image"
        content="https://grumbly.games/default_thumbnail.png"
      />

      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="fb:app_id" content="220488252548780" />
    </Head>

    <DrawGame />
  </Box>
);

export default Game;
