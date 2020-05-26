import React from 'react';
import Sharing from './Sharing';

const UndoButton = ({ action, undoable }) => {
  let optionalClass = "disabled";
  if (undoable) {
    optionalClass = "enabled";
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
  let enabledState = "enabled";
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
        wih={props.wih}
      />
    </div>
    <style jsx>{`
      .button_row {
        grid-area: top;
        box-sizing: border-box;
        height: auto;
        padding: 2vmin 5vmin;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr fit-content;
        grid-template-rows: auto;
        grid-template-areas: 'leftbutt rightbutt';
      }

      .leftbutt {
        grid-area: leftbutt;
        text-align: left;
      }

      .rightbutt {
        grid-area: rightbutt;
        text-align: right;
      }
    `}</style>
    <style jsx global>{`
      .rightbutt button {
        margin-left: 1em;
      }

      .enabled, .disabled {
        width: 6em;
        color: var(--active_outline);
        border-color: var(--active_outline);
        font-size: 0.7em;
        padding: 0.3em 0.4em;
      }

      button.enabled:hover, button.disabled:hover {
        color: #000000;
        background-color: #FFFFFF;
        border-color: #FFFFFF;
      }
    `}</style>
  </div>
);