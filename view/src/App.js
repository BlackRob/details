import React from 'react';
import './App.css';
import uuid from 'uuid';
import DrawHeader from './components/Header';
import DrawSentence from './components/SentenceBlocks';
import DrawCards from './components/Cards';
import DrawButtons from './components/Buttons';
import { parseServerResponse } from './nonComponentFunctions/parseServerResponse';
import { preInsertProcessing } from './nonComponentFunctions/preInsertProcessing';


// the default App
const App = () => {
  return (
    <div className="App">
      <DrawHeader />
      <Game />
    </div>
  );
}

// the default sentence
const helloworld = [{
  id: 0,
  type: 'gameid',
  word: '',
},
{
  id: uuid.v4(),
  type: 'intrj',
  word: 'Hello',
},
{
  id: uuid.v4(),
  type: 'p_com',
  word: ',',
},
{
  id: uuid.v4(),
  type: 'noun',
  word: 'World',
},
{
  id: uuid.v4(),
  type: 'p_exc',
  word: '!',
},];

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,            // game is currently being played
      placing: false,           // display is showing where a word can be inserted
      sentenceID: 0,            // ID of base sentence from server
      sentence: [helloworld],   // our default sentence
      cards: [],                // all word-types cards player has
      workingCards: [],         // word-type cards in the working row
      lastCards: [],            // after a word gets inserted, old card state goes here (for undo)
      undoable: false,          // if true you can undo the most recent move
      undoSecondsLeft: 0,       // seconds left before undo turns false again
      winner: false,            // set when the game is won
      sentenceUpdateCount: 0,   // to keep track of number of moves
      totalCardCount: 0,        // to track cards played
    };

    this.share = this.share.bind(this);
    this.updateSentence = this.updateSentence.bind(this); // adds new sentence to history
    this.undo = this.undo.bind(this);
    this.newGame = this.newGame.bind(this);
    this.newCard = this.newCard.bind(this);
    this.editCard = this.editCard.bind(this);
    this.toggleWorking = this.toggleWorking.bind(this);
    this.clearWR = this.clearWR.bind(this);
    this.addToWR = this.addToWR.bind(this);
    this.removeFromWR = this.removeFromWR.bind(this);
    this.insert = this.insert.bind(this);
    this.setPlacing = this.setPlacing.bind(this);
    this.setLastCards = this.setLastCards.bind(this);
    this.setUndoability = this.setUndoability.bind(this);
  }

  share() {
    console.log("sharing isn't implemented yet");
  }

  updateSentence(longerSentence) {
    var x = this.state.sentence;
    x.push(longerSentence);
    this.setState({ sentence: x });
  }

  // after placing a words in the sentence, the user has 7 seconds to
  // change their mind; after this the user is given a new card;
  // this function just handles the "undo" part
  undo() {
    var x = this.state.sentence;
    x.pop();
    this.setState({ sentence: x, cards: this.state.lastCards, undoable: false });
  }

  newGame() {
    // TODO:
    // alert
    // ask if they're sure
    // if they click yes, ask server for new game
    // for now, just choose new sentence from file
    // ask server for new sentence... wait
    // if sentence arrives
    let newSentence = parseServerResponse();
    this.setState({ sentence: newSentence.sentence, sentenceID: newSentence.sentenceID });
    this.setPlacing(false);
    this.clearWR();
    // sometimes the game coming from server has cards, sometimes not
    if (newSentence.cards.length > 0) {
      this.setState({ cards: newSentence.cards })
    } else {
      let x = [];
      // for now, every new game starts with five cards
      for (var i = 0; i < 5; i++) {
        x.push(newRandomCard());
      }
      this.setState({ cards: x, totalCardCount: 5, });
    }
    this.setState({ lastCards: [], active: true, winner: false, sentenceUpdateCount: 0 });
  }

  newCard() {
    this.setState({
      cards: this.state.cards.concat([newRandomCard()]),
      totalCardCount: this.state.totalCardCount + 1,
    });
  }

  editCard(cardId, value) {
    let x = this.state.cards;
    const indexOfCard = x.findIndex(element => element.id === cardId);
    x[indexOfCard].word = value;
    this.setState({ cards: x });
  }

  toggleWorking(cardId) {
    let updatedCards = this.state.cards.slice();
    let cardIndex = updatedCards.findIndex(element => element.id === cardId);
    updatedCards[cardIndex].working = !updatedCards[cardIndex].working;
    this.setState({ cards: updatedCards });
  }

  clearWR() {
    this.setState({ workingCards: [] });
    this.setPlacing(false);
  }

  addToWR(cardId) {
    this.setState({ workingCards: this.state.workingCards.concat([cardId]) });
  }

  removeFromWR(cardId) {
    this.setState({ workingCards: this.state.workingCards.filter(x => x !== cardId) });
    let anythingToPlace = false;
    this.state.cards.forEach(x => { if (x.word.length > 0) { anythingToPlace = true } });
    this.setPlacing(this.state.placing && anythingToPlace);
  }

  insert(index) {
    // deciding how to format the working row is complicated, so logic moved to its own file
    let toBeInserted = preInsertProcessing(this.state.cards, this.state.workingCards);
    let newSentenceHead = this.state.sentence[this.state.sentence.length - 1].slice(0, index + 1);
    let newSentenceTail = this.state.sentence[this.state.sentence.length - 1].slice(index + 1);
    let newSentence = newSentenceHead.concat(toBeInserted).concat(newSentenceTail);
    this.updateSentence(newSentence);
    // some clean up needs to be done after words have been inserted into the sentence
    // make a clean (no content) copy of cards in case we need to undo
    this.setLastCards();
    // note: some events (checking for a winner, scoring, adding a new card) are triggered in setUndoability
    this.setUndoability();
    // filter to find cards (by id) that have not been placed into sentence
    this.setState({ cards: this.state.cards.filter(x => this.state.workingCards.findIndex(y => y === x.id) === -1) });
    this.clearWR();
  }

  setUndoability() {
    this.setState({ undoable: true, undoSecondsLeft: 7, });
    const interval = setInterval(() => {
      if (this.state.undoable && this.state.undoSecondsLeft > 0) {
        this.setState({ undoSecondsLeft: this.state.undoSecondsLeft - 1 });
      } else if (this.state.undoable && this.state.undoSecondsLeft === 0) {
        this.setState({ undoable: false });
        clearInterval(interval);
        this.setState({ sentenceUpdateCount: this.state.sentenceUpdateCount + 1 })
        // check if we won the game, if not new card
        if (this.state.cards.length === 0) {
          this.setState({ winner: true, active: false, });
        } else {
          this.newCard();
        }
      } else {
        this.setState({ undoSecondsLeft: 0 });
        clearInterval(interval);
      }
    }, 1000);
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

  render() {
    return <div className="Game">
      <DrawButtons
        undo={this.undo}
        share={this.share}
        newGame={this.newGame}
        newCard={this.newCard}
        active={this.state.active}
        undoable={this.state.undoable}
      />
      <DrawSentence sentence={this.state.sentence[this.state.sentence.length - 1]} placing={this.state.placing} insert={this.insert} />
      <DrawCards
        cards={this.state.cards}
        onEdit={this.editCard}
        active={this.state.active}
        wR={this.state.workingCards}
        toggleWorking={this.toggleWorking}
        clearWR={this.clearWR}
        addToWR={this.addToWR}
        removeFromWR={this.removeFromWR}
        setPlacing={this.setPlacing}
        placing={this.state.placing}
        undoable={this.state.undoable}
        undoSecondsLeft={this.state.undoSecondsLeft}
        winner={this.state.winner}
        totalCardCount={this.state.totalCardCount}
        sentenceUpdateCount={this.state.sentenceUpdateCount}
      />
    </div>
  }
}

const newRandomCard = () => {
  const rando = Math.floor(Math.random() * Math.floor(1000));
  let type = null;
  switch (true) {
    case (rando < 280): type = "noun"; break;
    case (rando < 460): type = "verb"; break;
    case (rando < 530): type = "adj"; break;
    case (rando < 580): type = "adv"; break;
    case (rando < 670): type = "pron"; break;
    case (rando < 790): type = "prep"; break;
    case (rando < 980): type = "conj"; break;
    default: type = "intrj";
  }
  return {
    id: uuid.v4(),
    type: type,
    working: false,
    word: '',
  }
}


export default App;
