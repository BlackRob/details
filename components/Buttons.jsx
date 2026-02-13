import React, { useState } from "react";
import { Button, Group } from "@mantine/core";
import Sharing from "./Sharing";
import AddCardsPopUp from "./AddCardsPopUp";

const UndoButton = ({ action, undoStack, gameMode }) => {
  let returnThis = null;

  if (gameMode === "creative") {
    let optionalClass = "disabled";
    if (undoStack && undoStack.length > 0) {
      optionalClass = "enabled";
    }
    returnThis = (
      <button
        className={optionalClass}
        onClick={(e) => {
          e.preventDefault();
          action();
        }}
      >
        undo
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
    );
  }
  return returnThis;
};

const AddCardsButton = ({ showAddCardsPopUp, gameMode }) => {
  let returnThis = null;

  if (gameMode === "creative") {
    returnThis = (
      <button
        className="enabled"
        onClick={(e) => {
          e.preventDefault();
          showAddCardsPopUp(true);
        }}
      >
        <svg
          id="plusminus"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          x="0px"
          y="0px"
          viewBox="0 0 160 200"
        >
          <path
            d="M152.2969 89.9688 L95.9062 89.9688 L95.9062 146.3594 
          L72.2812 146.3594 L72.2812 89.9688 L15.8906 89.9688 L15.8906 66.3438 
          L72.2812 66.3438 L72.2812 9.9531 L95.9062 9.9531 L95.9062 66.3438 
          L152.2969 66.3438 L152.2969 89.9688 ZM152.2969 185.875 L15.8906 185.875 
          L15.8906 162.25 L152.2969 162.25 L152.2969 185.875 Z"
          />
        </svg>{" "}
        cards
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
      </button>
    );
  }

  return returnThis;
};

const NewGameButton = ({ action }) => {
  return (
    <Button
      size="md"
      radius="sm"
      w="8rem"
      onClick={(e) => {
        e.preventDefault();
        action();
      }}
    >
      new game
    </Button>
  );
};

const NewCardButton = ({ action, active, gameMode }) => {
  if (gameMode !== "creative") {
    const disabledStyle = {
      backgroundColor: "#343a40",
      color: "#868e96",
      border: "1px solid #343a40",
      opacity: 0.6,
    };

    return (
      <Button
        disabled={!active}
        size="md"
        radius="sm"
        w="8rem"
        onClick={(e) => {
          e.preventDefault();
          action();
        }}
        style={!active ? disabledStyle : undefined}
      >
        new card
      </Button>
    );
  } else {
    return <></>;
  }
};

const ShareButton = ({ action }) => {
  return (
    <Button
      size="md"
      radius="sm"
      w="8rem"
      onClick={(e) => {
        e.preventDefault();
        action(true);
      }}
    >
      share
    </Button>
  );
};

const Buttons = ({ ...props }) => {
  const [showSharing, setShowSharing] = useState(false);
  const [showAddCards, setShowAddCards] = useState(false);

  // Determine the best available history stack to pass to the video generator.
  // 1. props.fullHistory: The ideal complete game history passed from the parent.
  // 2. props.creativeUndo: Fallback for creative mode if fullHistory isn't set.
  // 3. []: An empty array as a final safe fallback.
  const videoHistoryStack = props.fullHistory || props.creativeUndo || [];

  return (
    <Group
      justify="space-between"
      w="100%"
      align="center"
      py="xs"
      px="lg"
      style={{ gridArea: "top" }}
    >
      <NewGameButton action={props.newGame} />
      <Group justify="flex-end" gap="xs">
        <AddCardsButton
          showAddCardsPopUp={setShowAddCards}
          gameMode={props.gameMode}
        />
        <UndoButton
          action={props.creativeUndoPop}
          // Undo button still specifically needs the creative stack
          undoStack={props.creativeUndo}
          gameMode={props.gameMode}
        />
        <NewCardButton
          action={props.newCard}
          active={props.active}
          gameMode={props.gameMode}
        />
        <ShareButton action={setShowSharing} />

        <Sharing
          sentence={props.sentence}
          cards={props.cards}
          // CHANGED: Use the determined complete history stack
          undoStack={videoHistoryStack}
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
      </Group>
    </Group>
  );
};

export default Buttons;
