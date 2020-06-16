import React from 'react';


const AddCardsPopUp = ({ showAddCardsPopUp, showAddCards, cards, cardInc, cardDec }) => {
  let showHide = "hidden"
  if (showAddCards) {
    showHide = "z2";
  }

  return <div className={showHide}>
    <div className="popup">
      <div className="z2_title">
        Add cards for building or sharing your sentence
        <span className="z2_hide" onClick={() => { showAddCardsPopUp(false) }}>x</span>
      </div>

      <div className="card_button_row">
        <div className="row4">
          <div className="row2">
            <DrawAddCardButton type="adj" cardInc={cardInc} cards={cards} cardDec={cardDec} />
            <DrawAddCardButton type="adv" cardInc={cardInc} cards={cards} cardDec={cardDec} />
          </div>
          <div className="row2">
            <DrawAddCardButton type="conj" cardInc={cardInc} cards={cards} cardDec={cardDec} />
            <DrawAddCardButton type="pron" cardInc={cardInc} cards={cards} cardDec={cardDec} />
          </div>
        </div>
        <div className="row4">
          <div className="row2">
            <DrawAddCardButton type="noun" cardInc={cardInc} cards={cards} cardDec={cardDec} />
            <DrawAddCardButton type="verb" cardInc={cardInc} cards={cards} cardDec={cardDec} />
          </div>
          <div className="row2">
            <DrawAddCardButton type="prep" cardInc={cardInc} cards={cards} cardDec={cardDec} />
            <DrawAddCardButton type="intrj" cardInc={cardInc} cards={cards} cardDec={cardDec} />
          </div>
        </div>
      </div>
    </div>
    <style jsx>{`
      .card_button_row {
        margin: 1.4em 0em;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        height: auto;
      }
      .row4 {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-around;
      }
      .row2 {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-around;
      }
    `}</style>
  </div>
}

/////////////////////// creative mode add card buttons
const DrawAddCardButton = ({ type, cardInc, cards, cardDec }) => {
  let activeClass = "none";
  let downArrowStyle = "grayArrow"
  let numType = [];
  if (Array.isArray(cards)) {
    numType = cards.filter(element => (element.type === type && !element.working))
  };
  if (numType.length > 0) {
    activeClass = type;
    downArrowStyle = "hoverableArrow"
  }

  return <div className={`add_card_button ${activeClass}`}>
    <button className="display" onClick={(e) => {
      e.preventDefault();
      let top = numType[numType.length - 1];
      toggleWorking(top.id)
      addToWR(top.id);
    }}>
      {type}<br /> {numType.length}</button>
    <button className="upButt hoverableArrow" onClick={() => cardInc(type)}>
      <svg className="arrowUpButt" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px"
        viewBox="0 0 50 35"><path d="M25 0 L45 35 L5 35 z" /></svg>
    </button>
    <button className={`downButt ${downArrowStyle}`} onClick={() => cardDec(type)}>
      <svg className="arrowDownButt" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px"
        viewBox="0 0 50 35"><path d="M25 35 L45 0 L5 0 z" /></svg>
    </button>
    <style jsx>
      {`
        .add_card_button {
          display: grid;
          grid-template-columns: 1fr auto;
          grid-template-rows: auto auto;
          grid-template-areas: 'l tr' 'l br';
          padding: 0.1em;
          margin: 0.4em;
          width: 8em;
          border: 1.5px solid black;
          border-radius: 0.5vmin;
        }
        .display {
          grid-area: l;
          padding: 0 0.1em;
          height: 100%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 100%;
          font-size: 1.2em;
          color: black;
        }
        .upButt, .downButt {
          width: 3em;
          max-width: 35px;
          margin: 0;
          padding: 0;
          border: none;
          fill: white;
          stroke-width: 1.5;
          stroke: black;
        }
        .upButt {
          grid-area: tr;
          padding-bottom: 1.6px;
        }
        .downButt {
          grid-area: br;
          padding-top: 1.6px;
        }
        .arrowUpButt {
          width: 100%;
        }
        .arrowUpButt:hover {
          fill: var(--insert);
        }
        .arrowDownButt {
          width: 100%;
        }
        .none {
          border: 1.5px solid rgba(128,128,128,0.45);
          color: rgba(128,128,128,0.45);
          padding: 0.1em;
          pointer-events: none;
          -webkit-box-shadow: none;
          box-shadow: none;
        }
        .none button {
          color: rgba(128,128,128,0.45);
        }
        .grayArrow {
          fill: rgba(128,128,128,0.45);
          stroke: var(--mainbg);
          cursor: not-allowed;
        }
        .hoverableArrow {
          fill: white;
          pointer-events: auto;
        }
        .hoverableArrow:hover {
          fill: var(--insert);
        }
      `}
    </style>
  </div>
}


export default AddCardsPopUp

