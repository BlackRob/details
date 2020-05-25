import React from 'react';
import './Buttons.css';
import Sharing from './Sharing';

const UndoButton = ({ action, undoable }) => {
  let optionalClass = "disabled";
  if (undoable) {
    optionalClass = "";
  }
  return <button
    className={optionalClass}
    onClick={(e) => {
      e.preventDefault();
      action();
    }}>undo
    </button>;
}

const NewGameButton = ({ action }) => {
  return <button
    className="enabled"
    onClick={(e) => {
      e.preventDefault();
      action();
    }}>new game
    </button>;
}

const NewCardButton = ({ action, active }) => {
  let enabledState = "";
  if (!active) {
    enabledState = "disabled";
  }
  return <button
    className={enabledState}
    onClick={(e) => {
      e.preventDefault();
      action();
    }}>new card
    </button>;
}

const ShareButton = ({ action }) => {
  return <button
    className="enabled"
    onClick={(e) => {
      e.preventDefault();
      action(true);
    }}>share
    </button>;
}

export default ({ ...props }) => (
  <div className="button_row">
    <div className="leftbutt">
      <NewGameButton action={props.newGame} />
    </div>
    <div className="rightbutt">
      <UndoButton action={props.undo} undoable={props.undoable} />
      <NewCardButton action={props.newCard} active={props.active} />
      <ShareButton action={props.setShowSharing} />
      <Sharing sentence={props.sentence}
        cards={props.cards}
        showSharing={props.showSharing}
        setShowSharing={props.setShowSharing}
        workingCards={props.workingCards} />
    </div>
    <Sharing />
  </div>
);