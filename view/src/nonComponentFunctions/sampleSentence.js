import uuid from 'uuid';


const Sentence = [
  {
    sentenceId: uuid.v4(),
    id: 0,
    type: 'gameid',
    word: ''
  },
  {
    id: 1,
    type: 'intrj',
    word: 'Wow'
  },
  {
    id: 2,
    type: 'p_exc',
    word: '!'
  },
  {
    id: 3,
    type: 'adj',
    word: 'The'
  },
  {
    id: 4,
    type: 'adj',
    word: 'angry'
  },
  {
    id: 5,
    type: 'noun',
    word: 'kangaroo'
  },
  {
    id: 6,
    type: 'adv',
    word: 'slowly'
  },
  {
    id: 7,
    type: 'verb',
    word: 'ate'
  },
  {
    id: 8,
    type: 'adj',
    word: 'a'
  },
  {
    id: 9,
    type: 'noun',
    word: 'hotdog'
  },
  {
    id: 10,
    type: 'prep',
    word: 'with'
  },
  {
    id: 11,
    type: 'noun',
    word: 'mustard'
  },
  {
    id: 12,
    type: 'p_prd',
    word: '.'
  },
];

export const NewGameState = () => {
  let ngs = {
    active: false,          // game is currently not being played
    sentence: [Sentence],   // the above sentence
    cards: [],              // in some cases, a game may come with cards
  };
  return ngs;
}

