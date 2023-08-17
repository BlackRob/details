import React, { useState } from "react";
import YouTubeVid from "./youTubeVid.js";

// Clicking on the span opens an informative popup
const PopUp = () => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button
        onClick={() => {
          setShow(true);
        }}
      >
        ?
      </button>
      <QuestionPage
        showVal={show}
        setShow={() => {
          setShow(false);
        }}
      />
      <style jsx>{`
        button {
          display: inline-block;
          text-decoration: none;
          border: none;
          padding: 0 2vmin 0 7vmin;
          _padding-left: 7vmin;
          font-weight: 300;
          font-size: 1em;
          color: var(--active_outline);
          transition: all 0.2s;
          width: auto;
        }
        button:hover {
          color: var(--insert);
        }
      `}</style>
    </div>
  );
};

const QuestionPage = ({ showVal, setShow }) => {
  let showHide = "hidden";
  if (showVal) {
    showHide = "z2";
  }

  return (
    <div className={showHide}>
      <div className="z2_body">
        <div className="z2_title">
          FAQ
          <span className="z2_hide" onClick={setShow}>
            x
          </span>
        </div>
        <p>
          <strong>What is this?</strong> <br />
          It&apos;s a game to practice English grammar.
        </p>
        <p>
          <strong>How do you play?</strong> <br />
          You start with a simple sentence, then make it longer by adding
          details.
        </p>
        <p>
          <strong>What do you mean by &quot;details&quot;?</strong> <br />I mean
          details! If I have a sentence, &quot;Chocolate is delicious&quot;, I
          can add a <i>detail</i> like the adjective <b>dark</b>, and now I have
          a longer sentence, &quot;<b>Dark</b> chocolate is delicious&quot;.
        </p>

        <p>
          <strong>Can I see an example?</strong> <br />
          Sure! Watch the video below or click{" "}
          <a
            href="https://grumbly.games/posts/200418_playing_details"
            rel="noopener noreferrer"
            target="_blank"
          >
            here
          </a>{" "}
          to read the rules.
        </p>
        <YouTubeVid vidID="kb7NS16W1BA" caption="placeholder video" />
        <div name="learn" className="typeButtonDiv">
          <h3>Learn more about...</h3>
          <div className="typeButtons">
            <a
              href="https://grumbly.games/adjectives"
              rel="noopener noreferrer"
              target="_blank"
            >
              <button className="adj">adjectives</button>
            </a>
            <a
              href="https://grumbly.games/nouns"
              rel="noopener noreferrer"
              target="_blank"
            >
              <button className="noun">nouns</button>
            </a>
            <a
              href="https://grumbly.games/adverbs"
              rel="noopener noreferrer"
              target="_blank"
            >
              <button className="adv">adverbs</button>
            </a>
            <a
              href="https://grumbly.games/verbs"
              rel="noopener noreferrer"
              target="_blank"
            >
              <button className="verb">verbs</button>
            </a>
            <a
              href="https://grumbly.games/prepositions"
              rel="noopener noreferrer"
              target="_blank"
            >
              <button className="prep">prepositions</button>
            </a>
            <a
              href="https://grumbly.games/conjunctions"
              rel="noopener noreferrer"
              target="_blank"
            >
              <button className="conj">conjunctions</button>
            </a>
            <a
              href="https://grumbly.games/pronouns"
              rel="noopener noreferrer"
              target="_blank"
            >
              <button className="pron">pronouns</button>
            </a>
            <a
              href="https://grumbly.games/interjections"
              rel="noopener noreferrer"
              target="_blank"
            >
              <button className="intrj">interjections</button>
            </a>
            <a
              href="https://grumbly.games/punctuation"
              rel="noopener noreferrer"
              target="_blank"
            >
              <button className="punc">punctuation</button>
            </a>
          </div>
        </div>
      </div>
      <style jsx>{`
        .typeButtonDiv {
          border: 1.5px solid black;
          border-radius: 7px;
          padding: 8px;
          text-align: center;
          position: -webkit-sticky;
          position: sticky;
          top: 30px;
          margin-top: 20px;
          font-size: 16px;
        }
        .typeButtons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
        .typeButtons a {
          flex: 0 0 100%;
          display: inline-block;
          min-width: fit-content;
          max-width: 150px;
          padding: 1vmin 2vmin;
        }
        .typeButtons button {
          font-size: 1.15em;
          border: 1.5px solid black;
          width: 100%;
          border-radius: 0.5vmin;
          font-weight: 300;
          color: black;
          transition: all 0.2s;
        }
        .typeButtons button:hover,
        .typeButtons button:focus,
        .typeButtons button:active {
          border-color: var(--logo_active);
          filter: drop-shadow(0 0 0.4rem var(--logo_hover));
          color: black;
        }
        button:focus {
          outline: 0;
        }
        .hidden {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PopUp;
