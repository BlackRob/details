import { Html, Head, Main, NextScript } from "next/document";
import { ColorSchemeScript } from "@mantine/core";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <ColorSchemeScript />
      </Head>
      {/* The style here applies immediately when the HTML arrives, 
         preventing the white flash before React loads.
      */}
      <body style={{ backgroundColor: "#282c34", margin: 0 }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
