import React, { useEffect, useRef } from "react";
import {
  SimpleGrid,
  UnstyledButton,
  Button,
  Stack,
  Paper,
  Text,
  ActionIcon,
  Group,
  Center,
  useMantineTheme,
} from "@mantine/core";
import { IconX, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

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
      <Center w="100%" h="100%">
        <Text
          c="#282c34"
          fw={800}
          size="1.8rem"
          ta="center"
          style={{ lineHeight: 1.2 }}
        >
          {rando}! You won!
          <Text span display="block" size="1.1rem" fw={500} mt={4} c="dimmed">
            Cards: {totalCardCount} &nbsp; Moves: {sentenceUpdateCount}
          </Text>
        </Text>
      </Center>
    );
  } else if (wR.length > 0) {
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
        numCards={workingCards.length}
      />
    ));
  }

  return (
    <div className="working_row_content">
      {content}
      <style jsx>
        {`
          .working_row_content {
            width: 100%;
            height: 100%;
            display: flex;
            overflow-x: auto;
            align-items: center;
            justify-content: center;
            scrollbar-width: none;
            color: black;
            gap: 6px;
            padding: 0 16px;
            box-sizing: border-box;
          }
          .working_row_content::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

const KeepOrUndo = ({ undo, accept, undoSecondsLeft }) => {
  return (
    <Group w="100%" justify="center" gap="lg">
      <Button
        onClick={(e) => {
          e.preventDefault();
          undo();
        }}
        // CHANGED: Removed color="red" to use default blue (matches New Game)
        // CHANGED: size="md" and radius="sm" to match New Game button
        size="md"
        radius="sm"
        w="40%"
        maw="200px"
        h="3.5rem"
      >
        <Stack gap={0} align="center">
          <Text size="sm" fw={800} lh={1.2}>
            undo
          </Text>
          <Text size="xs" fw={500} lh={1} style={{ opacity: 0.8 }}>
            {undoSecondsLeft}s
          </Text>
        </Stack>
      </Button>

      <Button
        onClick={(e) => {
          e.preventDefault();
          accept();
        }}
        // CHANGED: Removed color="green" to use default blue (matches New Game)
        size="md"
        radius="sm"
        w="40%"
        maw="200px"
        h="3.5rem"
      >
        <Stack gap={0} align="center">
          <Text size="sm" fw={800} lh={1.2}>
            accept
          </Text>
          <Text size="xs" fw={500} lh={1} style={{ opacity: 0.8 }}>
            new sentence
          </Text>
        </Stack>
      </Button>
    </Group>
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
  const inputRef = useRef(null);
  const theme = useMantineTheme();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const fontStyles = {
    fontSize: "1.5rem",
    fontWeight: 600,
    fontFamily: "inherit",
    letterSpacing: "normal",
  };

  const cardColor = theme.colors[element.type]?.[0] || "#eee";

  return (
    <Paper
      shadow="sm"
      radius="sm"
      withBorder
      style={{
        backgroundColor: cardColor,
        borderColor: "black",
        width: "auto",
        minWidth: "8rem",
        height: "5.5rem",
        display: "flex",
        flexDirection: "column",
        padding: "3px",
        flexShrink: 0,
      }}
    >
      <Group justify="space-between" align="start" mb={2}>
        <Text
          size="0.6rem"
          fw={700}
          tt="uppercase"
          style={{ opacity: 0.7, paddingLeft: "2px", lineHeight: 1 }}
        >
          {element.type}
        </Text>
        <ActionIcon
          size="xs"
          variant="transparent"
          color="black"
          onClick={(e) => {
            e.preventDefault();
            updateState(element.id, "");
            toggleWorking(element.id);
            removeFromWR(element.id);
          }}
          style={{ opacity: 0.6 }}
        >
          <IconX size="0.9rem" stroke={3} />
        </ActionIcon>
      </Group>

      <Center style={{ flex: 1, padding: "0 4px" }}>
        <div
          style={{
            display: "inline-grid",
            alignItems: "center",
            justifyItems: "center",
          }}
        >
          <span
            style={{
              ...fontStyles,
              gridArea: "1/1",
              visibility: "hidden",
              whiteSpace: "pre",
              height: 0,
              overflow: "hidden",
            }}
          >
            {element.word || " "}
          </span>

          <input
            ref={inputRef}
            type="text"
            size={1}
            defaultValue={element.word}
            autoComplete="off"
            autoCapitalize="off"
            onKeyUp={(e) => updateState(element.id, e.target.value)}
            style={{
              ...fontStyles,
              gridArea: "1/1",
              width: "100%",
              minWidth: 0,
              textAlign: "center",
              background: "transparent",
              border: "none",
              borderBottom: "1px solid black",
              color: "black",
              outline: "none",
              padding: "0px",
              marginBottom: "2px",
            }}
          />
        </div>
      </Center>

      <Group justify="space-between" mt={0}>
        <ActionIcon
          size="sm"
          variant="transparent"
          color="black"
          disabled={index === 0}
          onClick={(e) => {
            e.preventDefault();
            switchPlacesWR(index, index - 1);
          }}
          style={{ opacity: index === 0 ? 0.2 : 0.7 }}
        >
          <IconChevronLeft size="1.2rem" stroke={2.5} />
        </ActionIcon>

        <ActionIcon
          size="sm"
          variant="transparent"
          color="black"
          disabled={index === numCards - 1}
          onClick={(e) => {
            e.preventDefault();
            switchPlacesWR(index, index + 1);
          }}
          style={{ opacity: index === numCards - 1 ? 0.2 : 0.7 }}
        >
          <IconChevronRight size="1.2rem" stroke={2.5} />
        </ActionIcon>
      </Group>
    </Paper>
  );
};

/////////////////////// default card buttons
const DrawCardButton = ({ type, addToWR, cards, toggleWorking }) => {
  const theme = useMantineTheme();

  let numType = [];
  if (Array.isArray(cards)) {
    numType = cards.filter(
      (element) => element.type === type && !element.working,
    );
  }
  const count = numType.length;
  const active = count > 0;

  const activeColor = theme.colors[type]?.[0] || "#eee";

  return (
    <UnstyledButton
      onClick={(e) => {
        e.preventDefault();
        if (active) {
          let top = numType[numType.length - 1];
          toggleWorking(top.id);
          addToWR(top.id);
        }
      }}
      disabled={!active}
      style={{ width: "100%", height: "100%" }}
    >
      <Paper
        shadow="sm"
        radius="sm"
        withBorder
        style={{
          backgroundColor: active ? activeColor : "#343a40",
          borderColor: active ? "black" : "#343a40",
          height: "4.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: active ? 1 : 0.6,
          color: active ? "black" : "#868e96",
        }}
      >
        <Text size="xs" fw={700} tt="uppercase" style={{ lineHeight: 1 }}>
          {type}
        </Text>
        <Text size="xl" fw={900} style={{ lineHeight: 1, marginTop: "4px" }}>
          {count}
        </Text>
      </Paper>
    </UnstyledButton>
  );
};

const DrawAvailableCards = ({ wR, addToWR, cards, toggleWorking }) => {
  return (
    <SimpleGrid cols={8} spacing={5} w="100%">
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
    </SimpleGrid>
  );
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
        />
      </div>

      <style jsx>
        {`
          .card_row {
            grid-area: bot;
            display: grid;
            width: 100%;
            padding: 0px 8px;
            height: auto;
            text-align: center;
          }
          .working_row {
            padding: 2px 0vmin;
            height: 7rem;
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
            z-index: 10;
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
            z-index: 10;
          }

          .available_cards {
            display: flex;
            margin-top: 6px;
            margin-bottom: 4px;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }
        `}
      </style>
    </div>
  );
};

export default DrawCards;
