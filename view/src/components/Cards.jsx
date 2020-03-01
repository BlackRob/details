import React from 'react';
import './Cards.css';

/////////////////////// clear button 
const DrawClearButton = ({ updateState, active, wR, clearWR, toggleWorking }) => {
  let activeClass = "clear_button";
  if (!active || wR.length === 0) {
    activeClass = activeClass + " disabled";
  };
  return <button className={activeClass}
    onClick={(e) => {
      e.preventDefault();
      // for each card in the working row, erase its content
      // and turn it's working state off
      wR.forEach(x => { updateState(x, ""); toggleWorking(x) });
      // then clear the working row
      clearWR();
    }} >
    clear
  </button>
}

/////////////////////// working row content
const DrawWorkingRowContent = ({ wR, removeFromWR, updateState, cards, toggleWorking, undoable, undoSecondsLeft, winner, totalCardCount, sentenceUpdateCount }) => {
  let content = "";
  let rando = randomInterjection();

  if (undoable) {
    content = <div className="working_row_message">Seconds left to change your mind: {undoSecondsLeft}</div>
  } else if (winner) {
    content = <div className="working_row_message">{rando}! &nbsp; You won! &nbsp; &nbsp; Cards inserted: {totalCardCount} &nbsp; &nbsp; Moves needed: {sentenceUpdateCount}</div>
  }

  if (wR.length !== 0) {
    const workingCards = wR.map(x => cards.find(y => y.id === x));
    content =
      workingCards.map(z => <DrawWorkingCard element={z} key={z.id} updateState={updateState} removeFromWR={removeFromWR} toggleWorking={toggleWorking} />)
  };

  return <div className="working_row_content">
    {content}
  </div>
}

const randomInterjection = (() => {
  const coolInterjections = ["Yikes", "Wow", "Hey now", "Zounds", "Kapow", "Whammy", "Whaaaaat", "Whoopie", "Zoinks", "Bingo"];
  return coolInterjections[Math.floor(Math.random() * coolInterjections.length)];
})

const DrawWorkingCard = ({ element, updateState, removeFromWR, toggleWorking }) => {
  return <div className={element.type + " card"}>
    <DrawType wordType={element.type} />
    <DrawRemoveButton updateState={updateState} cardId={element.id} removeFromWR={removeFromWR} toggleWorking={toggleWorking} />
    <DrawInputDiv word={element.word} cardId={element.id} updateState={updateState} />
  </div>
}

const DrawType = ({ wordType }) => {
  return <div className="typename">{wordType}</div>
}

const DrawRemoveButton = ({ updateState, cardId, removeFromWR, toggleWorking }) => {
  return <button
    onClick={(e) => {
      e.preventDefault();
      updateState(cardId, "");
      toggleWorking(cardId);
      removeFromWR(cardId);
    }}>x
  </button>
}

const DrawInputDiv = ({ word, cardId, updateState }) => {
  return <div className="input_div">
    <input type="text" defaultValue={word} size={Math.max(4, word.length)}
      name={cardId}
      onKeyUp={(e) => { updateState(cardId, e.target.value); }}
    />
  </div>
}

/////////////////////// place button
const DrawPlaceButton = ({ cards, setPlacing, placing, undoable }) => {
  // assumption is most of the time nothing suitable for inserting 
  // into the working sentence is in working row, so dafault to disabled
  let activeClass = "place_button disabled";
  // if all the working row cards have something written on them, and we're not
  // currently waiting in the "undo" grace period, enable the button
  let somethingWritten = false;
  let cardsInWR = cards.filter(x => x.working);
  if (cardsInWR.length > 0) {
    somethingWritten = true;
    cardsInWR.forEach(x => { if (x.word.length === 0) { somethingWritten = false } });
  }
  if (somethingWritten && !undoable) {
    activeClass = "place_button";
  };

  return <button className={activeClass} onClick={() => { setPlacing(!placing) }} >place</button>
}

/////////////////////// available card buttons
const DrawCardButton = ({ type, addToWR, cards, toggleWorking }) => {
  let activeClass = "disabled";
  let numType = (cards.filter(element => (element.type === type && !element.working)));
  if (numType.length > 0) {
    activeClass = type;
  }

  return <button className={activeClass}
    onClick={(e) => {
      e.preventDefault();
      let top = numType[numType.length - 1];
      toggleWorking(top.id)
      addToWR(top.id);
    }}>
    {type}<br /> {numType.length}
  </button>
}


/////////////////////// the whole shebang
const DrawCards = ({ cards, onEdit, active, wR, toggleWorking, clearWR, addToWR, removeFromWR, setPlacing, placing, undoable, undoSecondsLeft, winner, totalCardCount, sentenceUpdateCount }) => {
  return <div className="card_row">
    <div className="working_row">
      <DrawClearButton updateState={onEdit} active={active} wR={wR} clearWR={clearWR} toggleWorking={toggleWorking} />
      <div className="working_row_slot">
        <DrawWorkingRowContent wR={wR} removeFromWR={removeFromWR} updateState={onEdit} cards={cards} toggleWorking={toggleWorking} undoable={undoable} undoSecondsLeft={undoSecondsLeft} winner={winner} totalCardCount={totalCardCount} sentenceUpdateCount={sentenceUpdateCount} />
      </div>
      <DrawPlaceButton cards={cards} setPlacing={setPlacing} placing={placing} undoable={undoable} />
    </div>
    <div className="available_cards">
      <DrawCardButton type="adj" wR={wR} addToWR={addToWR} cards={cards} toggleWorking={toggleWorking} />
      <DrawCardButton type="adv" wR={wR} addToWR={addToWR} cards={cards} toggleWorking={toggleWorking} />
      <DrawCardButton type="conj" wR={wR} addToWR={addToWR} cards={cards} toggleWorking={toggleWorking} />
      <DrawCardButton type="pron" wR={wR} addToWR={addToWR} cards={cards} toggleWorking={toggleWorking} />
      <DrawCardButton type="noun" wR={wR} addToWR={addToWR} cards={cards} toggleWorking={toggleWorking} />
      <DrawCardButton type="verb" wR={wR} addToWR={addToWR} cards={cards} toggleWorking={toggleWorking} />
      <DrawCardButton type="prep" wR={wR} addToWR={addToWR} cards={cards} toggleWorking={toggleWorking} />
      <DrawCardButton type="intrj" wR={wR} addToWR={addToWR} cards={cards} toggleWorking={toggleWorking} />
    </div>
  </div>
}

export default DrawCards;
