import React, { useState } from 'react';
import Sharing from './Sharing';
import AddCardsPopUp from './AddCardsPopUp';

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


const AddCardsButton = ({ showAddCardsPopUp, gameMode }) => {
  let returnThis = null

  if (gameMode === "creative") {
    returnThis = <button
      className="enabled"
      onClick={(e) => {
        e.preventDefault()
        showAddCardsPopUp(true)
      }}>
      <svg id="plusminus" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px"
        viewBox="0 0 160 200">
        <path d="M152.2969 89.9688 L95.9062 89.9688 L95.9062 146.3594 
          L72.2812 146.3594 L72.2812 89.9688 L15.8906 89.9688 L15.8906 66.3438 
          L72.2812 66.3438 L72.2812 9.9531 L95.9062 9.9531 L95.9062 66.3438 
          L152.2969 66.3438 L152.2969 89.9688 ZM152.2969 185.875 L15.8906 185.875 
          L15.8906 162.25 L152.2969 162.25 L152.2969 185.875 Z" />
      </svg> cards
    <style jsx>{`
      button {
        margin-left: 1em;
        width: 6em;
        flex: 0 0 auto;
        color: var(--active_outline);
        fill: var(--active_outline);
        border-color: var(--active_outline);
        font-size: 0.7em;
        padding: 0.3em 0.4em;
      } 
      #plusminus {
        width: 0.7em;
        fill: inherit;
        margin-bottom: -0.1em;
      }
      button:hover {
        fill: black;
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
      e.preventDefault()
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
    let enabledState = "enabled"
    if (!active) {
      enabledState = "disabled"
    }
    return <button
      className={enabledState}
      onClick={(e) => {
        e.preventDefault()
        action()
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

export default ({ ...props }) => {
  const [showSharing, setShowSharing] = useState(false);
  const [showAddCards, setShowAddCards] = useState(false);

  return <div className="button_row">
    <div>
      <NewGameButton action={props.newGame} />
    </div>
    <div >
      <AddCardsButton showAddCardsPopUp={setShowAddCards} gameMode={props.gameMode} />
      <UndoButton action={props.creativeUndoPop} undoStack={props.creativeUndo} gameMode={props.gameMode} />
      <NewCardButton action={props.newCard} active={props.active} gameMode={props.gameMode} />
      <ShareButton action={setShowSharing} />
      <Sharing
        sentence={props.sentence}
        cards={props.cards}
        showSharing={showSharing}
        setShowSharing={setShowSharing}
      />
      <AddCardsPopUp
        showAddCardsPopUp={setShowAddCards}
        showAddCards={showAddCards}
        cards={props.cards}
        cardInc={props.cardInc}
        cardDec={props.cardDec}
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
}