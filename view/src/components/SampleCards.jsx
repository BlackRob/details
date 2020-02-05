import uuid from 'uuid';

const SampleCards = [
  {
    id: uuid.v4(),
    type: 'conj',
    word: 'conj',
    selected: false,
  },
  {
    id: uuid.v4(),
    type: 'adv',
    word: 'adv',
    selected: true,
  },
  {
    id: uuid.v4(),
    type: 'adj',
    word: 'adj',
    selected: false,
  },
  {
    id: uuid.v4(),
    type: 'noun',
    word: 'noun',
    selected: false,
  },
  {
    id: uuid.v4(),
    type: 'verb',
    word: 'verb',
    editable: false,
  }
];

export default SampleCards;