import React from "react";
import DrawSentence from "./Sentence";
import DrawCards from "./Cards";
import DrawButtons from "./Buttons";
import DrawHeader from "../components/Header";
import sentences from "../data/sentences.json";
import { preInsertProcessing } from "./preInsertProcessing";
import { strToGameState } from "./gameStatePack";
import { Stack, Box } from "@mantine/core";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      cards: [],
      gameMode: "collaborative",
      lastCards: [],
      oldSentence: [],
      placing: false,
      sentence: [],
      sentenceUpdateCount: 0,
      showSharing: false,
      totalCardCount: 0,
      undoable: false,
      undoSecondsLeft: 0,
      winner: false,
      workingCards: [],
      creativeUndo: [],
      fullHistory: [],
    };

    this.updateSentence = this.updateSentence.bind(this);
    this.undo = this.undo.bind(this);
    this.cardDec = this.cardDec.bind(this);
    this.cardInc = this.cardInc.bind(this);
    this.accept = this.accept.bind(this);
    this.checkIfWon = this.checkIfWon.bind(this);
    this.newGame = this.newGame.bind(this);
    this.newCard = this.newCard.bind(this);
    this.editCard = this.editCard.bind(this);
    this.toggleWorking = this.toggleWorking.bind(this);
    this.clearWR = this.clearWR.bind(this);
    this.addToWR = this.addToWR.bind(this);
    this.removeFromWR = this.removeFromWR.bind(this);
    this.switchPlacesWR = this.switchPlacesWR.bind(this);
    this.insert = this.insert.bind(this);
    this.setGameMode = this.setGameMode.bind(this);
    this.setPlacing = this.setPlacing.bind(this);
    this.setLastCards = this.setLastCards.bind(this);
    this.setUndoability = this.setUndoability.bind(this);
    this.setShowSharing = this.setShowSharing.bind(this);
    this.creativeUndoPop = this.creativeUndoPop.bind(this);
  }

  componentDidMount() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    const defaultSentence =
      "1yTo~2ystart~3a~4yclick~5xthe~6m~7xnew~8zgame~9l~10zbutton~11a~12uor~13yclick~14xthe~15zquestion~16zmark~17yto~18ylearn~19whow~20yto~21yplay~22f~~";
    let temp = {};

    if (!this.props.hasOwnProperty("gameState")) {
      temp = JSON.parse(strToGameState({ canvasURLstring: defaultSentence }));
      temp.active = false;
      temp.gameMode = "collaborative";
      temp.lastCards = [];
      temp.oldSentence = [];
      temp.placing = false;
      temp.sentenceUpdateCount = 0;
      temp.showSharing = false;
      temp.totalCardCount = 0;
      temp.undoable = false;
      temp.undoSecondsLeft = 0;
      temp.winner = false;
      temp.workingCards = [];
      temp.creativeUndo = [];
    } else {
      temp = JSON.parse(
        strToGameState({ canvasURLstring: this.props.gameState }),
      );
      temp.active = temp.cards.length > 0;
      temp.gameMode = "collaborative";
      temp.lastCards = [];
      temp.oldSentence = [];
      temp.placing = false;
      temp.sentenceUpdateCount = 0;
      temp.showSharing = false;
      temp.totalCardCount = temp.cards.length;
      temp.undoable = false;
      temp.undoSecondsLeft = 0;
      temp.winner = false;
      temp.workingCards = [];
      temp.creativeUndo = [];
    }

    this.setState({
      active: temp.active,
      cards: temp.cards,
      gameMode: temp.gameMode,
      lastCards: temp.lastCards,
      oldSentence: temp.oldSentence,
      placing: temp.placing,
      sentence: temp.sentence,
      sentenceUpdateCount: temp.sentenceUpdateCount,
      showSharing: temp.showSharing,
      totalCardCount: temp.totalCardCount,
      undoable: temp.undoable,
      undoSecondsLeft: temp.undoSecondsLeft,
      winner: temp.winner,
      workingCards: temp.workingCards,
      creativeUndo: temp.creativeUndo,
      fullHistory: [],
    });
  }

  updateSentence(longerSentence) {
    this.setState({
      sentence: longerSentence,
      oldSentence: this.state.sentence,
    });
  }

  undo() {
    const newHistory = [...this.state.fullHistory];
    if (newHistory.length > 0) newHistory.pop();

    this.setState({
      sentence: this.state.oldSentence,
      oldSentence: [],
      cards: this.state.lastCards,
      undoable: false,
      fullHistory: newHistory,
    });
  }

  accept() {
    this.setState({ undoable: false, undoSecondsLeft: 0 });
    this.checkIfWon();
  }

  creativeUndoPop() {
    if (this.state.creativeUndo.length > 0) {
      const newHistory = [...this.state.fullHistory];
      if (newHistory.length > 0) newHistory.pop();

      let newCreativeUndo = this.state.creativeUndo;
      let lastInserted = newCreativeUndo.pop();
      let newSentence = this.state.sentence.filter(
        (x) => x.id !== lastInserted,
      );
      this.setState({
        creativeUndo: newCreativeUndo,
        sentence: newSentence,
        fullHistory: newHistory,
      });
    }
  }

  newGame() {
    let newState = {
      oldSentence: [],
      lastCards: [],
      active: true,
      winner: false,
      fullHistory: [],
    };

    if (this.state.gameMode === "creative") {
      newState.sentence = [{ id: 0, type: "head", word: "" }];
      newState.creativeUndo = [];
      newState.workingCards = [];
      newState.cards = [];
    } else {
      let new_game = chooseNewGame(sentences, this.state.gameMode);
      newState.sentence = new_game.sentence;
      this.setPlacing(false);
      this.clearWR();

      if (new_game.cards.length > 0) {
        newState.cards = new_game.cards;
      } else {
        let x = [];
        for (var i = 0; i < 5; i++) {
          x.push(newRandomCard(i));
        }
        newState.cards = x;
        newState.totalCardCount = 5;
      }
      newState.sentenceUpdateCount = 0;
    }

    // Capture Initial State
    const initialHistoryEntry = {
      sentence: JSON.parse(JSON.stringify(newState.sentence)),
      cards: JSON.parse(JSON.stringify(newState.cards)),
    };
    newState.fullHistory = [initialHistoryEntry];

    this.setState(newState);
  }

  newCard() {
    // 1. Calculate the new card first
    let nextCardID = 0;
    this.state.cards.forEach((x) => {
      if (x.id > nextCardID) {
        nextCardID = x.id;
      }
    });
    nextCardID++;
    const cardToAdd = newRandomCard(nextCardID);

    // 2. Create the FUTURE state of the cards array
    const nextCardsState = this.state.cards.concat([cardToAdd]);

    // 3. Create history entry using this FUTURE state
    // This ensures the video frame shows "Did you eat?" AND "5 Cards"
    const historyEntry = {
      sentence: JSON.parse(JSON.stringify(this.state.sentence)),
      cards: JSON.parse(JSON.stringify(nextCardsState)),
    };

    // 4. Update State
    this.setState({
      cards: nextCardsState,
      totalCardCount: this.state.totalCardCount + 1,
      sentenceUpdateCount: this.state.sentenceUpdateCount + 1,
      fullHistory: [...this.state.fullHistory, historyEntry],
    });
  }

  cardInc(type) {
    let nextCardID = 0;
    this.state.cards.forEach((x) => {
      if (x.id > nextCardID) {
        nextCardID = x.id;
      }
    });
    nextCardID++;
    this.setState({
      cards: this.state.cards.concat([
        {
          id: nextCardID,
          type: type,
          working: false,
          word: "",
        },
      ]),
      totalCardCount: this.state.totalCardCount + 1,
    });
  }
  cardDec(type) {
    let numType = this.state.cards.filter(
      (element) => element.type === type && !element.working,
    );
    let lastInserted = 0;
    if (numType.length > 0) {
      numType.forEach((x) => {
        if (x.id > lastInserted) {
          lastInserted = x.id;
        }
      });
    }
    let newCardArray = this.state.cards.filter((x) => x.id !== lastInserted);
    this.setState({
      cards: newCardArray,
      totalCardCount: this.state.totalCardCount - 1,
    });
  }

  editCard(cardId, value) {
    let x = this.state.cards;
    const indexOfCard = x.findIndex((element) => element.id === cardId);
    x[indexOfCard].word = value;
    this.setState({ cards: x });

    let somethingWritten = true;
    x.forEach((element) => {
      if (element.working === true && element.word.length === 0) {
        somethingWritten = false;
      }
    });
    if (somethingWritten !== this.state.placing) {
      this.setPlacing(somethingWritten);
    }
  }

  toggleWorking(cardId) {
    let updatedCards = this.state.cards;
    updatedCards.forEach((element) => {
      if (element.id === cardId) {
        element.working = !element.working;
      }
    });
    this.setState({ cards: updatedCards });
  }

  clearWR() {
    this.setState({ workingCards: [] });
    this.setPlacing(false);
  }

  addToWR(cardId) {
    this.setState({ workingCards: this.state.workingCards.concat([cardId]) });
    this.setPlacing(false);
  }

  removeFromWR(cardId) {
    this.setState({
      workingCards: this.state.workingCards.filter((x) => x !== cardId),
    });
    let anythingToPlace = true;
    this.state.cards.forEach((x) => {
      if (x.word.length === 0) {
        anythingToPlace = false;
      }
    });
    if (this.state.placing !== anythingToPlace) {
      this.setPlacing(anythingToPlace);
    }
  }

  switchPlacesWR(a, b) {
    let wcCopy = this.state.workingCards;
    let newA = this.state.workingCards[b];
    let newB = this.state.workingCards[a];
    wcCopy[a] = newA;
    wcCopy[b] = newB;
    this.setState({ workingCards: wcCopy });
  }

  insert(index) {
    const maxCardId = this.state.sentence.reduce(
      (max, x) => (x.id > max ? x.id : max),
      0,
    );
    let toBeInserted = preInsertProcessing(
      this.state.cards,
      this.state.workingCards,
      maxCardId,
    );
    let newSentenceHead = this.state.sentence.slice(0, index + 1);
    let newSentenceTail = this.state.sentence.slice(index + 1);
    let newSentence = newSentenceHead
      .concat(toBeInserted)
      .concat(newSentenceTail);

    this.updateSentence(newSentence);
    this.setLastCards();

    if (this.state.gameMode === "creative") {
      let tempArray = [];
      toBeInserted.forEach((x) => tempArray.push(x.id));

      const historyEntry = {
        sentence: JSON.parse(JSON.stringify(this.state.sentence)),
        cards: JSON.parse(JSON.stringify(this.state.cards)),
      };
      const newHistory = [...this.state.fullHistory, historyEntry];

      this.setState({
        creativeUndo: this.state.creativeUndo.concat(tempArray),
        fullHistory: newHistory,
      });
    } else {
      this.setUndoability();
    }

    this.setState({
      cards: this.state.cards.filter(
        (x) => this.state.workingCards.findIndex((y) => y === x.id) === -1,
      ),
    });
    this.clearWR();
  }

  setUndoability() {
    this.setState({ undoable: true, undoSecondsLeft: 7 });
    const interval = setInterval(() => {
      if (this.state.undoable && this.state.undoSecondsLeft > 0) {
        this.setState({ undoSecondsLeft: this.state.undoSecondsLeft - 1 });
      } else if (this.state.undoable && this.state.undoSecondsLeft === 0) {
        this.setState({ undoable: false });
        clearInterval(interval);
        this.setState({ oldSentence: [] });
        this.checkIfWon();
      } else {
        this.setState({ undoSecondsLeft: 0 });
        clearInterval(interval);
      }
    }, 1000);
  }

  checkIfWon() {
    if (this.state.cards.length === 0) {
      const historyEntry = {
        sentence: JSON.parse(JSON.stringify(this.state.sentence)),
        cards: JSON.parse(JSON.stringify(this.state.cards)),
      };
      this.setState({
        winner: true,
        active: false,
        sentenceUpdateCount: this.state.sentenceUpdateCount + 1,
        fullHistory: [...this.state.fullHistory, historyEntry],
      });
    } else {
      this.newCard();
    }
  }

  setShowSharing(value) {
    this.setState({ showSharing: value });
  }

  setPlacing(value) {
    this.setState({ placing: value });
  }

  setLastCards() {
    this.setState({
      lastCards: this.state.cards.map((card) => ({
        id: card.id,
        type: card.type,
        working: false,
        word: "",
      })),
    });
  }

  setGameMode(aString) {
    this.setState({ gameMode: aString });
  }

  render() {
    return (
      <Stack h="100vh" bg="darkCharcoal" w="100%" gap={0} maw="960px" mx="auto">
        <Box bg="#1A1B1E" w="100%" py={4}>
          <Stack gap={2}>
            <DrawHeader
              gameMode={this.state.gameMode}
              setGameMode={this.setGameMode}
            />
            <Box px="xs">
              <DrawButtons
                cards={this.state.cards}
                cardDec={this.cardDec}
                cardInc={this.cardInc}
                toggleWorking={this.toggleWorking}
                addToWR={this.addToWR}
                creativeUndo={this.state.creativeUndo}
                creativeUndoPop={this.creativeUndoPop}
                sentence={this.state.sentence}
                newGame={this.newGame}
                newCard={this.newCard}
                active={this.state.active}
                undoable={this.state.undoable}
                workingCards={this.state.workingCards}
                gameMode={this.state.gameMode}
                fullHistory={this.state.fullHistory}
              />
            </Box>
          </Stack>
        </Box>

        <Box
          w="100%"
          bg="darkCharcoal"
          style={{
            flex: 1,
            position: "relative",
            border: "8px solid #1A1B1E",
            boxSizing: "border-box",
          }}
        >
          <DrawSentence
            sentence={this.state.sentence}
            placing={this.state.placing}
            insert={this.insert}
          />
        </Box>

        <Box pb="md" bg="#1A1B1E">
          <DrawCards
            accept={this.accept}
            cards={this.state.cards}
            cardDec={this.cardDec}
            cardInc={this.cardInc}
            gameMode={this.state.gameMode}
            onEdit={this.editCard}
            wR={this.state.workingCards}
            toggleWorking={this.toggleWorking}
            addToWR={this.addToWR}
            removeFromWR={this.removeFromWR}
            switchPlacesWR={this.switchPlacesWR}
            undo={this.undo}
            undoable={this.state.undoable}
            undoSecondsLeft={this.state.undoSecondsLeft}
            winner={this.state.winner}
            totalCardCount={this.state.totalCardCount}
            sentenceUpdateCount={this.state.sentenceUpdateCount}
          />
        </Box>
      </Stack>
    );
  }
}

const newRandomCard = (newCardId) => {
  const rando = Math.floor(Math.random() * 1000);
  let type = null;

  // Conversational English Weights (approximate):
  // Verbs: 22%
  // Nouns: 20%
  // Pronouns: 16% (Common in speech)
  // Adjectives: 8% (Lower because 'the/a' are free)
  // Adverbs: 10%
  // Prepositions: 12%
  // Conjunctions: 9%
  // Interjections: 3% (Natural speech rate)

  switch (true) {
    case rando < 220:
      type = "verb";
      break;
    case rando < 420: // 220 + 200
      type = "noun";
      break;
    case rando < 580: // 420 + 160
      type = "pron";
      break;
    case rando < 660: // 580 + 80
      type = "adj";
      break;
    case rando < 760: // 660 + 100
      type = "adv";
      break;
    case rando < 880: // 760 + 120
      type = "prep";
      break;
    case rando < 970: // 880 + 90
      type = "conj";
      break;
    default: // Remainder (30 = 3%)
      type = "intrj";
  }
  return {
    id: newCardId,
    type: type,
    working: false,
    word: "",
  };
};

const chooseNewGame = (sentences, mode) => {
  let returnValue = {};
  let senties = [];
  for (let key in sentences) {
    if (sentences.hasOwnProperty(key) && key.length > 4) {
      senties.push(key);
    }
  }
  if (mode === "competitive") {
    let randomKey = Math.floor(Math.random() * senties.length);
    returnValue = sentences[senties[randomKey]];
  } else {
    let randomKey = Math.floor(Math.random() * senties.length);
    returnValue = sentences[senties[randomKey]];
  }

  return returnValue;
};

export default Game;
