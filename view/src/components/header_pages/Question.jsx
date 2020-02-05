import React, { useState } from 'react';
import "./header_pages.css"


// Clicking on the span opens an informative popup
const App = () => {
  const [show, setShow] = useState(false);
  return <div className="Header_punctuation ">
    <button onClick={() => { setShow(true) }}>?</button>
    <QuestionPage showVal={show} setShow={() => { setShow(false) }} />
  </div>
};

const QuestionPage = ({ showVal, setShow }) => {
  let showHide = "hidden";
  if (showVal) {
    showHide = "z1";
  }

  return <div className={showHide}>
    <div className="z1_body">
      <div className="z1_title">
        FAQ
      <span className="z1_hide" onClick={setShow}>x</span>
      </div>
      <p><strong>What is this?</strong> <br />It's a game to practice English grammar.</p>
      <p><strong>How do you play?</strong> <br />You start with a simple sentence, then make it longer by adding details.</p>
      <p><strong>What do you mean by "details"?</strong> <br />I mean details! If I have a sentence, "Chocolate is delicious", I can add a <i>detail</i> like the adjective "dark", and now I have a longer sentence, "Dark chocolate is delicious".</p>
    </div>
  </div>
}


export default App;
