import React from 'react';
import './SentenceBlocks.css';


const Block = (x, index, placing, insert) => {
  let activeClass = "placing_button hidden";
  let block_border = "";
  if (placing) {
    activeClass = "placing_button";
    block_border = "block_border";
  }
  return <div key={x.id} className={`block ${block_border}`}>
    <div className={x.type}>{x.word}</div>
    <button className={`${activeClass}`} onClick={(e) => {
      e.preventDefault();
      insert(index);
    }}>{index}</button>
  </div>
}

export default ({ sentence, placing, insert }) => (
  <div className="active_sentence">
    {sentence.map((element, index) => {
      return Block(element, index, placing, insert);
    })
    }
  </div>
);
