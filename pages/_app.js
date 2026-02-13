import "@mantine/core/styles.css";
import "../components/sharedstyle.css";
import { MantineProvider, createTheme } from "@mantine/core";
import Head from "next/head";

// Helper to make a simple 10-shade palette from one color
const simpleColor = (hex) => [hex, hex, hex, hex, hex, hex, hex, hex, hex, hex];

const theme = createTheme({
  colors: {
    // Game Pieces
    conj: simpleColor("#ffe377"),
    adj: simpleColor("#89f0d1"),
    noun: simpleColor("#73cef4"),
    adv: simpleColor("#fcc8c8"),
    verb: simpleColor("#ff5c8f"),
    intrj: simpleColor("orange"),
    prep: simpleColor("#2cd946"),
    pron: simpleColor("#c09aeb"),
    punc: simpleColor("lavender"),

    // UI Colors
    darkCharcoal: simpleColor("#282c34"),
  },
  white: "#f0f0f0",

  components: {
    // Removed the "Button" section here because it caused the error.
    // We moved that styling to the global <style> tag below.

    Modal: {
      styles: {
        content: {
          backgroundColor: "#ffffff",
          border: "1px solid #ccc",
          color: "#000000",
        },
        header: {
          backgroundColor: "#ffffff",
          color: "#000000",
        },
        close: {
          color: "#000000",
          border: "1px solid transparent",
          transition: "all 0.2s",
          "&:hover": {
            backgroundColor: "transparent !important",
            borderColor: "#ccc",
            color: "#000000",
          },
        },
        body: {
          color: "#000000",
        },
      },
    },

    Radio: {
      styles: {
        label: { color: "#000000" },
      },
    },
  },
});

export default function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <style>{`
          /* 1. FIX THE FLASH: Set background immediately */
          body {
            background-color: #282c34; 
            margin: 0;
          }

          /* 2. FIX THE BUTTON ERROR: 
             Target the disabled state using standard CSS instead of the theme object.
             This prevents the "Unsupported style property" warning. */
          .mantine-Button-root[data-disabled] {
            background-color: #282c34 !important;
            color: #868e96 !important;
            border-color: transparent !important;
            opacity: 1 !important;
          }
        `}</style>
      </Head>
      <Component {...pageProps} />
    </MantineProvider>
  );
}
