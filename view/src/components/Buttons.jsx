import React from 'react';
import './Buttons.css';

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

const ShareButton = ({ action }) => {
  return <button
    className="enabled"
    onClick={(e) => {
      e.preventDefault();
      action();
    }}>share
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

export default ({ ...props }) => (
  <div className="button_row">
    <NewGameButton action={props.newGame} />
    <ShareButton action={props.share} />
    <NewCardButton action={props.newCard} active={props.active} />
    <UndoButton action={props.undo} undoable={props.undoable} />
  </div>
);