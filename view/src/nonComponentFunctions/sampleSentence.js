import uuid from 'uuid';


const Sentence = [
  {
    id: uuid.v4(),
    type: 'gameid',
    word: ''
  },
  {
    id: uuid.v4(),
    type: 'intrj',
    word: 'Wow'
  },
  {
    id: uuid.v4(),
    type: 'p_exc',
    word: '!'
  },
  {
    id: uuid.v4(),
    type: 'adj',
    word: 'The'
  },
  {
    id: uuid.v4(),
    type: 'adj',
    word: 'angry'
  },
  {
    id: uuid.v4(),
    type: 'noun',
    word: 'kangaroo'
  },
  {
    id: uuid.v4(),
    type: 'adv',
    word: 'slowly'
  },
  {
    id: uuid.v4(),
    type: 'verb',
    word: 'ate'
  },
  {
    id: uuid.v4(),
    type: 'adj',
    word: 'a'
  },
  {
    id: uuid.v4(),
    type: 'noun',
    word: 'hotdog'
  },
  {
    id: uuid.v4(),
    type: 'prep',
    word: 'with'
  },
  {
    id: uuid.v4(),
    type: 'noun',
    word: 'mustard'
  },
  {
    id: uuid.v4(),
    type: 'p_prd',
    word: '.'
  },
];

export const NewGameState = () => {
  let ngs = {
    active: false,          // game is currently not being played
    sentenceID: uuid.v4(),  // this would be generated on server
    sentence: [Sentence],   // the above sentence
    cards: [],              // in some cases, a game may come with cards
  };
  return ngs;
}

