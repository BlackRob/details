import React, { useEffect } from "react";

/////////////////////// working row content
const DrawWorkingRowContent = ({
  wR,
  removeFromWR,
  updateState,
  cards,
  toggleWorking,
  undo,
  undoable,
  undoSecondsLeft,
  winner,
  accept,
  switchPlacesWR,
  totalCardCount,
  sentenceUpdateCount,
  gameMode,
}) => {
  let content = "";
  let rando = randomInterjection();

  if (undoable && gameMode !== "creative") {
    content = (
      <KeepOrUndo
        undo={undo}
        accept={accept}
        undoSecondsLeft={undoSecondsLeft}
      />
    );
  } else if (winner) {
    content = (
      <div className="working_row_message">
        {rando}! &nbsp; You won! &nbsp; &nbsp; Cards inserted: {totalCardCount}{" "}
        &nbsp; &nbsp; Moves needed: {sentenceUpdateCount}
      </div>
    );
  }

  if (wR.length > 0) {
    const workingCards = wR.map((x) => cards.find((y) => y.id === x));
    content = workingCards.map((z, index) => (
      <DrawWorkingCard
        element={z}
        key={z.id}
        updateState={updateState}
        removeFromWR={removeFromWR}
        switchPlacesWR={switchPlacesWR}
        toggleWorking={toggleWorking}
        index={index}
        numCards={workingCards.length - 1}
      />
    ));
  }

  return (
    <div className="working_row_content">
      {content}
      <style jsx>
        {`
          .working_row_content {
            width: fit-content;
            margin: 1px;
            display: flex;
            overflow-x: scroll;
            align-items: center;
            justify-content: flex-start;
            scrollbar-width: none;
            color: black;
          }
          .working_row_content::-webkit-scrollbar {
            display: none;
          }
          .working_row_message {
            color: black;
          }
        `}
      </style>
    </div>
  );
};

const KeepOrUndo = ({ undo, accept, undoSecondsLeft }) => {
  return (
    <div className="undoOrAccept">
      <button
        onClick={(e) => {
          e.preventDefault();
          undo();
        }}
      >
        Undo
        <br />
        {undoSecondsLeft}
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          accept();
        }}
      >
        Accept
        <br />
        new sentence
      </button>
      <style jsx>{`
        .undoOrAccept {
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0;
          width: 100%;
          height: 3.5em;
          padding: 0;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-evenly;
        }
        button {
          width: 40vw;
          height: auto;
          margin: 0;
          line-height: 1.5em;
          font-size: 0.7em;
          margin-top: -3px;
          padding: 5px;
          color: var(--active_outline);
          background-color: var(--mainbg);
          border: 1.5px solid black;
          border-radius: 0.5vmin;
          max-width: 150px;
        }
        button:hover {
          background-color: var(--active-outline);
          color: black;
        }
      `}</style>
    </div>
  );
};

const randomInterjection = () => {
  const coolInterjections = [
    "Yikes",
    "Wow",
    "Hey now",
    "Zounds",
    "Kapow",
    "Whammy",
    "Whaaaaat",
    "Whoopie",
    "Zoinks",
    "Bingo",
  ];
  return coolInterjections[
    Math.floor(Math.random() * coolInterjections.length)
  ];
};

const DrawWorkingCard = ({
  element,
  updateState,
  removeFromWR,
  toggleWorking,
  index,
  numCards,
  switchPlacesWR,
}) => {
  return (
    <div className={element.type + " card"}>
      <DrawType wordType={element.type} />
      <DrawRemoveButton
        updateState={updateState}
        cardId={element.id}
        removeFromWR={removeFromWR}
        toggleWorking={toggleWorking}
      />
      <DrawInputDiv
        word={element.word}
        cardId={element.id}
        updateState={updateState}
      />
      <DrawSwitchButton
        numCards={numCards}
        index={index}
        switchPlacesWR={switchPlacesWR}
      />
      <style jsx>
        {`
          .card {
            height: 100%;
            display: grid;
            grid-template-columns: 1fr auto;
            grid-template-rows: auto 1fr;
            grid-template-areas: "tl tr" "b b";
            margin: 0px 1px;
            width: fit-content;
            flex: 1 0 auto;
            color: black;
            border: 1px solid black;
            position: relative;
          }
        `}
      </style>
    </div>
  );
};

const DrawType = ({ wordType }) => {
  return (
    <div className="typename">
      {wordType}
      <style jsx>
        {`
          .typename {
            grid-area: tl;
            margin-left: 0.3em;
            margin-bottom: 0px;
            padding: 0.2em 0.4em;
            font-size: 0.6em;
            text-align: left;
          }
        `}
      </style>
    </div>
  );
};

const DrawRemoveButton = ({
  updateState,
  cardId,
  removeFromWR,
  toggleWorking,
}) => {
  return (
    <button
      tabIndex="-1"
      onClick={(e) => {
        e.preventDefault();
        updateState(cardId, "");
        toggleWorking(cardId);
        removeFromWR(cardId);
      }}
    >
      x
      <style jsx>
        {`
          button {
            grid-area: tr;
            margin: 0.4em;
            margin-top: 0px;
            width: auto;
            height: 100%;
            color: black;
            padding: 0px;
            border: none;
          }
        `}
      </style>
    </button>
  );
};

const DrawSwitchButton = ({ numCards, index, switchPlacesWR }) => {
  let returnValue = null;
  if (index < numCards) {
    returnValue = (
      <button
        tabIndex="-1"
        onClick={(e) => {
          e.preventDefault();
          switchPlacesWR(index, index + 1);
        }}
      >
        ⇄
        <style jsx>
          {`
            button {
              position: absolute;
              z-index: 2;
              bottom: 0px;
              right: calc(-0.5em - 2px);
              width: 1em;
              height: auto;
              font-size: 110%;
              color: rgba(0, 0, 0, 1);
              border: none;
              background: none;
              border-radius: 0;
              padding: 0;
              padding-bottom: 0.2em;
            }
          `}
        </style>
      </button>
    );
  }

  return returnValue;
};

const DrawInputDiv = ({ word, cardId, updateState }) => {
  const newRef = React.createRef();
  useEffect(() => {
    newRef.current.focus();
  }, [newRef]);
  return (
    <div className="input_div">
      <input
        type="text"
        defaultValue={word}
        size={Math.max(4, word.length)}
        name={cardId}
        ref={newRef}
        autoCapitalize="off"
        onKeyUp={(e) => {
          updateState(cardId, e.target.value);
        }}
      />
      <style jsx>
        {`
          .input_div {
            grid-area: b;
            display: flex;
            flex-grow: 1;
            width: auto;
            align-content: center;
            justify-content: center;
          }
          .input_div input {
            border: none;
            border-bottom: black solid 1px;
            font: inherit;
            width: 97%;
            font-size: 1em;
            box-sizing: border-box;
            padding: 0px;
            overflow: hidden;
            margin: 0px 8px 4px 8px;
            padding: 1px 0px 1px 0px;
            background-color: rgba(255, 255, 255, 0);
            text-align: center;
          }
          .input_div input:focus {
            background-color: rgba(255, 255, 255, 0.7);
            outline: none;
          }
        `}
      </style>
    </div>
  );
};

/////////////////////// creative mode card buttons
const DrawCreativeButton = ({
  type,
  addToWR,
  cards,
  toggleWorking,
  inc,
  dec,
}) => {
  let activeClass = "none";
  let downArrowStyle = "grayArrow";
  let numType = [];
  if (Array.isArray(cards)) {
    numType = cards.filter(
      (element) => element.type === type && !element.working
    );
  }
  if (numType.length > 0) {
    activeClass = type;
    downArrowStyle = "hoverableArrow";
  }

  return (
    <div className={`creativeButton ${activeClass}`}>
      <button
        className="display"
        onClick={(e) => {
          e.preventDefault();
          let top = numType[numType.length - 1];
          toggleWorking(top.id);
          addToWR(top.id);
        }}
      >
        {type}
        <br /> {numType.length}
      </button>
      <button className="upButt hoverableArrow" onClick={() => inc(type)}>
        <svg
          className="arrowUpButt"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          x="0px"
          y="0px"
          viewBox="0 0 50 35"
        >
          <path d="M25 0 L45 35 L5 35 z" />
        </svg>
      </button>
      <button
        className={`downButt ${downArrowStyle}`}
        onClick={() => dec(type)}
      >
        <svg
          className="arrowDownButt"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          x="0px"
          y="0px"
          viewBox="0 0 50 35"
        >
          <path d="M25 35 L45 0 L5 0 z" />
        </svg>
      </button>
      <style jsx>
        {`
          .creativeButton {
            display: grid;
            grid-template-columns: 1fr auto;
            grid-template-rows: auto auto;
            grid-template-areas: "l tr" "l br";
            padding: calc(0.1em + 1.6px);
            margin: 0;
            width: 11%;
            border: none;
            border-radius: 0.5vmin;
          }
          .display {
            grid-area: l;
            padding: 0 0.1em;
            height: 100%;
            border: none;
            margin: 0;
            width: 100%;
            font-size: 0.7em;
          }
          .upButt,
          .downButt {
            width: 3vw;
            max-width: 25px;
            margin: 0;
            padding: 0;
            border: none;
            fill: white;
            stroke-width: 1;
            stroke: black;
          }
          .upButt {
            grid-area: tr;
            padding-bottom: 1.6px;
          }
          .downButt {
            grid-area: br;
            padding-top: 1.6px;
          }
          .arrowUpButt {
            width: 100%;
          }
          .arrowUpButt:hover {
            fill: var(--insert);
          }
          .arrowDownButt {
            width: 100%;
          }
          .none {
            border: 2px solid rgba(128, 128, 128, 0.45);
            color: rgba(128, 128, 128, 0.45);
            padding: 0.1em;
            pointer-events: none;
            -webkit-box-shadow: none;
            box-shadow: none;
          }
          .none button {
            color: rgba(128, 128, 128, 0.45);
          }
          .grayArrow {
            fill: rgba(128, 128, 128, 0.45);
            stroke: var(--mainbg);
            cursor: not-allowed;
          }
          .hoverableArrow {
            fill: white;
            pointer-events: auto;
          }
          .hoverableArrow:hover {
            fill: var(--insert);
          }
        `}
      </style>
    </div>
  );
};

/////////////////////// default card buttons
const DrawCardButton = ({ type, addToWR, cards, toggleWorking }) => {
  let activeClass = "disabled";
  let numType = [];
  if (Array.isArray(cards)) {
    numType = cards.filter(
      (element) => element.type === type && !element.working
    );
  }
  if (numType.length > 0) {
    activeClass = type;
  }

  return (
    <>
      <button
        className={activeClass}
        onClick={(e) => {
          e.preventDefault();
          let top = numType[numType.length - 1];
          toggleWorking(top.id);
          addToWR(top.id);
        }}
      >
        {type}
        <br /> {numType.length}
      </button>
      <style jsx>
        {`
          button {
            padding: 0.1em;
            border: 1px solid;
            font-size: 0.7em;
            height: 100%;
            width: 10%;
            margin: 3px 0px;
          }
        `}
      </style>
    </>
  );
};

const DrawAvailableCards = ({
  wR,
  addToWR,
  cards,
  toggleWorking,
  gameMode,
  cardInc,
  cardDec,
}) => {
  /* let returnThis = null
  if (gameMode === "creative") {
    returnThis = <>
      <DrawCreativeButton type="adj" wR={wR} addToWR={addToWR} cards={cards} toggleWorking={toggleWorking} gameMode={gameMode} inc={cardInc} dec={cardDec} />
      <DrawCreativeButton type="adv" wR={wR} addToWR={addToWR} cards={cards} toggleWorking={toggleWorking} gameMode={gameMode} inc={cardInc} dec={cardDec} />
      <DrawCreativeButton type="conj" wR={wR} addToWR={addToWR} cards={cards} toggleWorking={toggleWorking} gameMode={gameMode} inc={cardInc} dec={cardDec} />
      <DrawCreativeButton type="pron" wR={wR} addToWR={addToWR} cards={cards} toggleWorking={toggleWorking} gameMode={gameMode} inc={cardInc} dec={cardDec} />
      <DrawCreativeButton type="noun" wR={wR} addToWR={addToWR} cards={cards} toggleWorking={toggleWorking} gameMode={gameMode} inc={cardInc} dec={cardDec} />
      <DrawCreativeButton type="verb" wR={wR} addToWR={addToWR} cards={cards} toggleWorking={toggleWorking} gameMode={gameMode} inc={cardInc} dec={cardDec} />
      <DrawCreativeButton type="prep" wR={wR} addToWR={addToWR} cards={cards} toggleWorking={toggleWorking} gameMode={gameMode} inc={cardInc} dec={cardDec} />
      <DrawCreativeButton type="intrj" wR={wR} addToWR={addToWR} cards={cards} toggleWorking={toggleWorking} gameMode={gameMode} inc={cardInc} dec={cardDec} />
    </>
  } else { */
  let returnThis = (
    <>
      <DrawCardButton
        type="adj"
        wR={wR}
        addToWR={addToWR}
        cards={cards}
        toggleWorking={toggleWorking}
      />
      <DrawCardButton
        type="adv"
        wR={wR}
        addToWR={addToWR}
        cards={cards}
        toggleWorking={toggleWorking}
      />
      <DrawCardButton
        type="conj"
        wR={wR}
        addToWR={addToWR}
        cards={cards}
        toggleWorking={toggleWorking}
      />
      <DrawCardButton
        type="pron"
        wR={wR}
        addToWR={addToWR}
        cards={cards}
        toggleWorking={toggleWorking}
      />
      <DrawCardButton
        type="noun"
        wR={wR}
        addToWR={addToWR}
        cards={cards}
        toggleWorking={toggleWorking}
      />
      <DrawCardButton
        type="verb"
        wR={wR}
        addToWR={addToWR}
        cards={cards}
        toggleWorking={toggleWorking}
      />
      <DrawCardButton
        type="prep"
        wR={wR}
        addToWR={addToWR}
        cards={cards}
        toggleWorking={toggleWorking}
      />
      <DrawCardButton
        type="intrj"
        wR={wR}
        addToWR={addToWR}
        cards={cards}
        toggleWorking={toggleWorking}
      />
    </>
  );
  //}

  return returnThis;
};

/////////////////////// the whole shebang
const DrawCards = ({
  cards,
  onEdit,
  gameMode,
  wR,
  toggleWorking,
  addToWR,
  removeFromWR,
  switchPlacesWR,
  undo,
  undoable,
  undoSecondsLeft,
  winner,
  accept,
  totalCardCount,
  sentenceUpdateCount,
  cardInc,
  cardDec,
}) => {
  return (
    <div className="card_row">
      <div className="working_row">
        <div className="working_row_slot">
          <DrawWorkingRowContent
            wR={wR}
            removeFromWR={removeFromWR}
            updateState={onEdit}
            gameMode={gameMode}
            cards={cards}
            toggleWorking={toggleWorking}
            undo={undo}
            undoable={undoable}
            accept={accept}
            undoSecondsLeft={undoSecondsLeft}
            winner={winner}
            switchPlacesWR={switchPlacesWR}
            totalCardCount={totalCardCount}
            sentenceUpdateCount={sentenceUpdateCount}
          />
          <div className="left_edge_effect"></div>
          <div className="right_edge_effect"></div>
        </div>
      </div>
      <div className="available_cards">
        <DrawAvailableCards
          wR={wR}
          addToWR={addToWR}
          cards={cards}
          toggleWorking={toggleWorking}
          gameMode={gameMode}
          cardInc={cardInc}
          cardDec={cardDec}
        />
      </div>
      <style jsx>
        {`
          .card_row {
            grid-area: bot;
            display: grid;
            width: 100%;
            padding: 0px 5vmin;
            height: auto;
            text-align: center;
          }
          .working_row {
            padding: 2px 0vmin;
            height: 3.5em;
            width: 100%;
            position: relative;
          }
          .working_row_slot {
            background-color: whitesmoke;
            border: 1px solid black;
            display: flex;
            padding: 0;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: center;
            position: relative;
          }
          .left_edge_effect {
            position: absolute;
            left: 0px;
            height: 100%;
            width: 15px;
            background: linear-gradient(
              to right,
              rgba(245, 245, 245, 1),
              rgba(255, 255, 255, 0)
            );
            pointer-events: none;
          }
          .right_edge_effect {
            position: absolute;
            right: 0px;
            height: 100%;
            width: 15px;
            background: linear-gradient(
              to left,
              rgba(245, 245, 245, 1),
              rgba(255, 255, 255, 0)
            );
            pointer-events: none;
          }

          .available_cards {
            display: flex;
            margin-top: 2px;
            margin-bottom: 4px;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }

          .adj {
            background-color: var(--adj);
            color: black;
            border-color: black;
          }

          .noun {
            background-color: var(--noun);
            color: black;
            border-color: black;
          }

          .adv {
            background-color: var(--adv);
            color: black;
            border-color: black;
          }

          .verb {
            background-color: var(--verb);
            color: black;
            border-color: black;
          }

          .conj {
            background-color: var(--conj);
            color: black;
            border-color: black;
          }

          .prep {
            background-color: var(--prep);
            color: black;
            border-color: black;
          }

          .pron {
            background-color: var(--pron);
            color: black;
            border-color: black;
          }

          .intrj {
            background-color: var(--intrj);
            color: black;
            border-color: black;
          }
        `}
      </style>
    </div>
  );
};

export default DrawCards;
