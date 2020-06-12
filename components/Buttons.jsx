import React from 'react';
import Sharing from './Sharing';

const UndoButton = ({ action, undoStack, gameMode }) => {
  let returnThis = null

  if (gameMode === "creative") {
    let optionalClass = "disabled"
    if (undoStack.length > 0) {
      optionalClass = "enabled"
    }
    returnThis = <button
      className={optionalClass}
      onClick={(e) => {
        e.preventDefault()
        action()
      }}>undo
    <style jsx>{`
      button {
        margin-left: 1em;
        width: 6em;
        flex: 0 0 auto;
        color: var(--active_outline);
        border-color: var(--active_outline);
        font-size: 0.7em;
        padding: 0.3em 0.4em;
      } 
    `}</style>
    </button>;
  }
  return returnThis
}

const NewGameButton = ({ action }) => {
  return <button
    className="enabled"
    onClick={(e) => {
      e.preventDefault();
      action();
    }}>new game
    <style jsx>{`
      button {
        margin-right: 1em;
        width: 6em;
        flex: 0 0 auto;
        color: var(--active_outline);
        border-color: var(--active_outline);
        font-size: 0.7em;
        padding: 0.3em 0.4em;
      } 
    `}</style>
  </button>;
}

const NewCardButton = ({ action, active, gameMode }) => {
  let returnThis = null

  if (gameMode !== "creative") {
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
    <style jsx>{`
      button {
        margin-left: 1em;
        width: 6em;
        flex: 0 0 auto;
        color: var(--active_outline);
        border-color: var(--active_outline);
        font-size: 0.7em;
        padding: 0.3em 0.4em;
      } 
    `}</style>
    </button>
  }

  return returnThis
}

const ShareButton = ({ action }) => {
  return <button
    className="enabled"
    onClick={(e) => {
      e.preventDefault();
      action(true);
    }}>share
    <style jsx>{`
      button {
        margin-left: 1em;
        width: 6em;
        flex: 0 0 auto;
        color: var(--active_outline);
        border-color: var(--active_outline);
        font-size: 0.7em;
        padding: 0.3em 0.4em;
      }
    `}</style>
  </button>;
}

export default ({ ...props }) => (
  <div className="button_row">
    <div>
      <NewGameButton action={props.newGame} />
    </div>
    <div >
      <UndoButton action={props.creativeUndoPop} undoStack={props.creativeUndo} gameMode={props.gameMode} />
      <NewCardButton action={props.newCard} active={props.active} gameMode={props.gameMode} />
      <ShareButton action={props.setShowSharing} />
      <Sharing sentence={props.sentence}
        cards={props.cards}
        showSharing={props.showSharing}
        setShowSharing={props.setShowSharing}
      />
    </div>
    <style jsx>{`
      .button_row {
        grid-area: top;
        box-sizing: border-box;
        height: auto;
        padding: 2vmin 5vmin;
        width: 100%;
        text-align: center;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    `}</style>
  </div>
);