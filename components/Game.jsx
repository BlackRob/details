import React from 'react';
import DrawSentence from './Sentence';
import DrawCards from './Cards';
import DrawButtons from './Buttons';
import DrawHeader from '../components/Header';
import sentences from '../data/sentences.json';
import { preInsertProcessing } from './preInsertProcessing';
import { strToGameState } from './gameStatePack';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,            // game is currently being played
      cards: [],                // all word-types cards player has
      gameMode: "collaborative",      // default mode means new game chooses random sentence
      lastCards: [],            // after a word gets inserted, old card state goes here (for undo)
      oldSentence: [],          // previous sentence
      placing: false,           // display is showing where a word can be inserted
      sentence: [],             // the current sentence
      sentenceUpdateCount: 0,   // to keep track of number of moves
      showSharing: false,       // to show the sharing overlay or not
      totalCardCount: 0,        // to track cards played
      undoable: false,          // if true you can undo the most recent move
      undoSecondsLeft: 0,       // seconds left before undo turns false again
      winner: false,            // set when the game is won
      workingCards: [],         // word-type cards in the working row
      creativeUndo: [],         // creative mode has unlimited undo, we track separately
    };

    this.updateSentence = this.updateSentence.bind(this); // adds new sentence to history
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
    //// copied from https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    // I'm not sure if it does anything, but I don't want to remove it then 
    // find out my height breaks on some device I haven't tested on
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    const defaultSentence = "1yTo~2ystart~3a~4yclick~5xthe~6m~7xnew~8zgame~9l~10zbutton~11a~12uor~13yclick~14xthe~15zquestion~16zmark~17yto~18ylearn~19whow~20yto~21yplay~22f~~"
    let temp = {}

    // check if we were already playing agame, and just clicked away
    // from it; we don't want to force a player to start from
    // scratch just because they click away to look up a "conjunction"
    if (!this.props.hasOwnProperty("gameState")) {
      // we were not currently playing a game, this is a new one
      // gameState only exists when game is started from link
      temp = JSON.parse(strToGameState({ canvasURLstring: defaultSentence }))
      // URL string only contains current cards and sentence, 
      // everthing else starts from scratch 
      temp.active = false
      temp.gameMode = "collaborative"
      temp.lastCards = []
      temp.oldSentence = []
      temp.placing = false
      temp.sentenceUpdateCount = 0
      temp.showSharing = false
      temp.totalCardCount = 0
      temp.undoable = false
      temp.undoSecondsLeft = 0
      temp.winner = false
      temp.workingCards = []
      temp.creativeUndo = []
    } else {
      // if it doesn't exist, use default sentence
      temp = JSON.parse(strToGameState({ canvasURLstring: this.props.gameState }))
      temp.active = temp.cards.length > 0
      temp.gameMode = "collaborative"
      temp.lastCards = []
      temp.oldSentence = []
      temp.placing = false
      temp.sentenceUpdateCount = 0
      temp.showSharing = false
      temp.totalCardCount = temp.cards.length
      temp.undoable = false
      temp.undoSecondsLeft = 0
      temp.winner = false
      temp.workingCards = []
      temp.creativeUndo = []
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
    })
  }

  updateSentence(longerSentence) {
    this.setState({ sentence: longerSentence, oldSentence: this.state.sentence });
  }

  // after placing a words in the sentence, the user has 7 seconds to
  // change their mind; after this the user is given a new card;
  // this function just handles the "undo" part
  //// these functions don't get used in creative mode
  undo() {
    this.setState({ sentence: this.state.oldSentence, oldSentence: [], cards: this.state.lastCards, undoable: false });
  }
  accept() {
    this.setState({ undoable: false, undoSecondsLeft: 0 });
    this.checkIfWon()
  }

  // in creative mode, we allow the removal of words, one at a time
  // in reverse order to how they were inserted
  creativeUndoPop() {
    if (this.state.creativeUndo.length > 0) {
      let newCreativeUndo = this.state.creativeUndo
      let lastInserted = newCreativeUndo.pop()
      let newSentence = this.state.sentence.filter(x => x.id !== lastInserted)
      this.setState({
        creativeUndo: newCreativeUndo,
        sentence: newSentence,
      });
    }
  }

  newGame() {
    // in creative mode, new game starts empty
    // in default it chooses a starter sentence
    if (this.state.gameMode === "creative") {
      this.setState({
        sentence: [
          {
            "id": 0,
            "type": "head",
            "word": ""
          }
        ],
        oldSentence: [],
        lastCards: [],
        active: true,
        winner: false,
        creativeUndo: [],
        workingCards: [],
        cards: []
      })
    } else {
      let new_game = chooseNewGame(sentences, this.state.gameMode);

      this.setState({
        sentence: (new_game.sentence),
      });
      this.setPlacing(false);
      this.clearWR();
      // sometimes the game coming from server has cards, sometimes not
      if (new_game.cards.length > 0) {
        this.setState({ cards: new_game.cards })
      } else {
        let x = [];
        // for now, every new game starts with five cards
        for (var i = 0; i < 5; i++) {
          x.push(newRandomCard(i));
        }
        this.setState({ cards: x, totalCardCount: 5, });
      }
      this.setState({ oldSentence: [], lastCards: [], active: true, winner: false, sentenceUpdateCount: 0 });
    }
  }

  newCard() {
    let nextCardID = 0
    this.state.cards.forEach((x) => { if (x.id > nextCardID) { nextCardID = x.id } })
    nextCardID++
    this.setState({
      cards: this.state.cards.concat([newRandomCard(nextCardID)]),
      totalCardCount: this.state.totalCardCount + 1,
      sentenceUpdateCount: this.state.sentenceUpdateCount + 1
    });
  }

  cardInc(type) {
    let nextCardID = 0
    this.state.cards.forEach((x) => { if (x.id > nextCardID) { nextCardID = x.id } })
    nextCardID++
    this.setState({
      cards: this.state.cards.concat([
        {
          id: nextCardID,
          type: type,
          working: false,
          word: '',
        }]),
      totalCardCount: this.state.totalCardCount + 1,
    });
    //console.log("card inc: ", this.state.workingCards)
  }
  cardDec(type) {
    // find all cards of a certain type that aren't being used
    let numType = this.state.cards.filter(element => (element.type === type && !element.working))
    // figure out which one has the highest ID
    let lastInserted = 0
    if (numType.length > 0) {
      numType.forEach((x) => { if (x.id > lastInserted) { lastInserted = x.id } })
    }
    // filter out lastInserted
    let newCardArray = this.state.cards.filter(x => x.id !== lastInserted)
    // update array in state
    this.setState({
      cards: newCardArray,
      totalCardCount: this.state.totalCardCount - 1,
    });
  }

  editCard(cardId, value) {
    let x = this.state.cards;
    const indexOfCard = x.findIndex(element => element.id === cardId);
    x[indexOfCard].word = value;
    this.setState({ cards: x });
    // whenever we edit a card, we reevaluate placing
    let somethingWritten = true;
    x.forEach(element => {
      if (element.working === true && element.word.length === 0) {
        //console.log(element)
        somethingWritten = false
        //console.log(element.word, somethingWritten)
      }
    })
    if (somethingWritten !== this.state.placing) {
      this.setPlacing(somethingWritten)
    }
  }

  toggleWorking(cardId) {
    let updatedCards = this.state.cards;
    updatedCards.forEach(element => {
      if (element.id === cardId) {
        element.working = !element.working
      }
    })
    this.setState({ cards: updatedCards });
  }

  clearWR() {
    this.setState({ workingCards: [] });
    this.setPlacing(false);
  }

  addToWR(cardId) {
    this.setState({ workingCards: this.state.workingCards.concat([cardId]) })
    this.setPlacing(false)
    //console.log("added to wR: ", this.state.workingCards)
  }

  removeFromWR(cardId) {
    this.setState({ workingCards: this.state.workingCards.filter(x => x !== cardId) });
    let anythingToPlace = true;
    this.state.cards.forEach(x => { if (x.word.length === 0) { anythingToPlace = false } });
    if (this.state.placing !== anythingToPlace) {
      this.setPlacing(anythingToPlace);
    }
  }

  switchPlacesWR(a, b) {
    let wcCopy = this.state.workingCards
    let newA = this.state.workingCards[b]
    let newB = this.state.workingCards[a]
    wcCopy[a] = newA
    wcCopy[b] = newB
    this.setState({ workingCards: wcCopy });
  }

  insert(index) {
    // every new word added to the sentence
    const maxCardId = this.state.sentence.reduce((max, x) => (x.id > max ? x.id : max), 0);
    let toBeInserted = preInsertProcessing(this.state.cards, this.state.workingCards, maxCardId);
    let newSentenceHead = this.state.sentence.slice(0, index + 1);
    let newSentenceTail = this.state.sentence.slice(index + 1);
    let newSentence = newSentenceHead.concat(toBeInserted).concat(newSentenceTail);
    // when we update the sentence, we also make a copy of the old one in case we need to undo it
    this.updateSentence(newSentence);
    // some clean up needs to be done after words have been inserted into the sentence
    // make a clean (no content) copy of cards in case we need to undo
    this.setLastCards();
    // if playing a game, you have a 7 second window to undo an insertion, in case you see 
    // a typo or something; this doesn't apply in creative mode
    if (this.state.gameMode === "creative") {
      let tempArray = []
      toBeInserted.forEach(x => tempArray.push(x.id))
      this.setState({ creativeUndo: this.state.creativeUndo.concat(tempArray) })
    } else {
      // note: some events (checking for a winner, scoring, adding a new card) are triggered in setUndoability
      this.setUndoability();
    }
    // filter to find cards (by id) that have not been placed into sentence
    // --this removes the cards that were just inserted from the cards arrray
    this.setState({ cards: this.state.cards.filter(x => this.state.workingCards.findIndex(y => y === x.id) === -1) });
    this.clearWR();
  }

  setUndoability() {
    this.setState({ undoable: true, undoSecondsLeft: 7, });
    const interval = setInterval(() => {
      if (this.state.undoable && this.state.undoSecondsLeft > 0) {
        this.setState({ undoSecondsLeft: this.state.undoSecondsLeft - 1 });
      } else if (this.state.undoable && this.state.undoSecondsLeft === 0) {
        // undo timer ran out
        this.setState({ undoable: false });
        clearInterval(interval);
        this.setState({ oldSentence: [] })
        // check if any cards left and act accordingly
        this.checkIfWon()
      } else {
        this.setState({ undoSecondsLeft: 0 });
        clearInterval(interval);
      }
    }, 1000);
  }

  checkIfWon() {
    // check if we won the game, if not new card
    if (this.state.cards.length === 0) {
      this.setState({ winner: true, active: false, sentenceUpdateCount: this.state.sentenceUpdateCount + 1 });
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

  // makes a copy of the state of cards but with no content/no working row
  setLastCards() {
    this.setState({
      lastCards: this.state.cards.map(card => (
        {
          id: card.id,
          type: card.type,
          working: false,
          word: '',
        })
      )
    });
  }

  setGameMode(aString) {
    this.setState({ gameMode: aString })
  }

  render() {
    return <>
      <DrawHeader
        gameMode={this.state.gameMode}
        setGameMode={this.setGameMode}
      />
      <div className="Game">
        <DrawButtons
          cards={this.state.cards}
          creativeUndo={this.state.creativeUndo}
          creativeUndoPop={this.creativeUndoPop}
          sentence={this.state.sentence}
          newGame={this.newGame}
          newCard={this.newCard}
          showSharing={this.state.showSharing}
          setShowSharing={this.setShowSharing}
          active={this.state.active}
          undoable={this.state.undoable}
          workingCards={this.state.workingCards}
          gameMode={this.state.gameMode}
        />
        <DrawSentence
          sentence={this.state.sentence}
          placing={this.state.placing}
          insert={this.insert}
        />
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
        <style jsx>{`
        .Game {
          display: grid;
          box-sizing: border-box;
          width: 100%;
          min-height: 0;
          height: 100%;
          grid-template-columns: 20% 60% 20%;
          grid-template-rows: auto minmax(0, 1fr) auto;
          grid-template-areas: 'top top top' 'mid mid mid' 'bot bot bot';
          color: white;
          text-align: center;
        }  
      `}</style>
      </div>
    </>
  }
}

const newRandomCard = (newCardId) => {
  const rando = Math.floor(Math.random() * 1000);
  let type = null;
  switch (true) {
    case (rando < 260): type = "noun"; break;
    case (rando < 450): type = "verb"; break;
    case (rando < 605): type = "adj"; break;
    case (rando < 700): type = "adv"; break;
    case (rando < 770): type = "pron"; break;
    case (rando < 890): type = "prep"; break;
    case (rando < 980): type = "conj"; break;
    default: type = "intrj";
  }
  return {
    id: newCardId,
    type: type,
    working: false,
    word: '',
  }
}

const chooseNewGame = (sentences, mode) => {
  let returnValue = {};
  let senties = [];
  for (let key in sentences) {
    // all normal sentences have IDs >= 1000
    if (sentences.hasOwnProperty(key) && key.length > 4) {
      senties.push(key);
    }
  }
  if (mode === "competitive") {
    // not implemented yet, this is the same as default
    let randomKey = Math.floor(Math.random() * senties.length);
    returnValue = sentences[senties[randomKey]];
  } else {
    let randomKey = Math.floor(Math.random() * senties.length);
    returnValue = sentences[senties[randomKey]];
  }

  return returnValue;
}


export default Game;