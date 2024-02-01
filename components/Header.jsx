import React from "react";
import Link from "next/link";
import Question from "./Question";
import Settings from "./Settings";

// our beloved header
const OurBelovedHeader = ({ gameMode, setGameMode }) => (
  <header className="app_header">
    <div className="header_logo">
      <Link href="/" replace>
        <a className="homeLink">details</a>
      </Link>
    </div>

    <Question />
    <Settings gameMode={gameMode} setGameMode={setGameMode} />
    <style jsx>
      {`
        .app_header {
          font-size: 2.6em;
          background-image: linear-gradient(to top, #21242b, #383f4d);
          box-sizing: border-box;
          height: auto;
          padding: 0.5vmin 3vmin;
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
        .header_logo {
          color: var(--active_outline);
          text-align: left;
          flex: 1;
        }
        .homeLink {
          display: inline-block;
          text-decoration: none;
          border: none;
          _padding: 0 2vmin 0 7vmin;
          _padding-left: 7vmin;
          font-weight: 300;
          font-size: 1em;
          color: var(--active_outline);
          transition: all 0.2s;
          width: auto;
        }
        .homeLink:hover {
          color: var(--insert);
        }
        @media screen and (orientation: landscape) {
          .app_header {
            font-size: 8vmin;
          }
        }
      `}
    </style>
  </header>
);

export default OurBelovedHeader;
