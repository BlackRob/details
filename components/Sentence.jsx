import React, { useState } from 'react';

const Word = (element, follower, placing, insert, index) => {
  // take a word object, turn it into an array of spans
  // each span is coded to display a certain color
  if (element.type === "head") {
    return <span key={element.id} style={{ color: 'var(--mainbg)', position: 'relative', padding: '1px' }}>
      &nbsp;<InsertZone placing={placing} insert={insert} index={index} /><PuncSpace aType={follower} /></span>
  } else if (element.type === "noun") {
    return <span key={element.id} style={{ color: 'var(--noun)', position: 'relative', padding: '1px' }}>
      {element.word}<InsertZone placing={placing} insert={insert} index={index} /><PuncSpace aType={follower} />
    </span>
  } else if (element.type === "verb") {
    return <span key={element.id} style={{ color: 'var(--verb)', position: 'relative', padding: '1px' }}>
      {element.word}<InsertZone placing={placing} insert={insert} index={index} /><PuncSpace aType={follower} />
    </span>
  } else if (element.type === "adj") {
    return <span key={element.id} style={{ color: 'var(--adj)', position: 'relative', padding: '1px' }}>
      {element.word}<InsertZone placing={placing} insert={insert} index={index} /><PuncSpace aType={follower} />
    </span>
  } else if (element.type === "adv") {
    return <span key={element.id} style={{ color: 'var(--adv)', position: 'relative', padding: '1px' }}>
      {element.word}<InsertZone placing={placing} insert={insert} index={index} /><PuncSpace aType={follower} />
    </span>
  } else if (element.type === "pron") {
    return <span key={element.id} style={{ color: 'var(--pron)', position: 'relative', padding: '1px' }}>
      {element.word}<InsertZone placing={placing} insert={insert} index={index} /><PuncSpace aType={follower} />
    </span>
  } else if (element.type === "prep") {
    return <span key={element.id} style={{ color: 'var(--prep)', position: 'relative', padding: '1px' }}>
      {element.word}<InsertZone placing={placing} insert={insert} index={index} /><PuncSpace aType={follower} />
    </span>
  } else if (element.type === "conj") {
    return <span key={element.id} style={{ color: 'var(--conj)', position: 'relative', padding: '1px' }}>
      {element.word}<InsertZone placing={placing} insert={insert} index={index} /><PuncSpace aType={follower} />
    </span>
  } else if (element.type === "intrj") {
    return <span key={element.id} style={{ color: 'var(--intrj)', position: 'relative', padding: '1px' }}>
      {element.word}<InsertZone placing={placing} insert={insert} index={index} /><PuncSpace aType={follower} />
    </span>
  } else if (element.type === "p_com") {
    return <span key={element.id} style={{ color: 'var(--punc)', position: 'relative', padding: '1px' }}>
      {`,`}<PuncSpace aType={follower}></PuncSpace><InsertZone placing={placing} insert={insert} index={index} />
    </span>
  } else if (element.type === "p_semi") {
    return <span key={element.id} style={{ color: 'var(--punc)', position: 'relative', padding: '1px' }}>
      {`;`}<PuncSpace aType={follower}></PuncSpace><InsertZone placing={placing} insert={insert} index={index} />
    </span>
  } else if (element.type === "p_cln") {
    return <span key={element.id} style={{ color: 'var(--punc)', position: 'relative', padding: '1px' }}>
      {`:`}<PuncSpace aType={follower}></PuncSpace><InsertZone placing={placing} insert={insert} index={index} />
    </span>
  } else if (element.type === "p_prd") {
    return <span key={element.id} style={{ color: 'var(--punc)', position: 'relative', padding: '1px' }}>
      {`.`}<PuncSpace aType={follower}></PuncSpace><InsertZone placing={placing} insert={insert} index={index} />
    </span>
  } else if (element.type === "p_exc") {
    return <span key={element.id} style={{ color: 'var(--punc)', position: 'relative', padding: '1px' }}>
      {`!`}<PuncSpace aType={follower}></PuncSpace><InsertZone placing={placing} insert={insert} index={index} />
    </span>
  } else if (element.type === "p_parR") {
    return <span key={element.id} style={{ color: 'var(--punc)', position: 'relative', padding: '1px' }}>
      {`)`}<PuncSpace aType={follower}></PuncSpace><InsertZone placing={placing} insert={insert} index={index} />
    </span>
  } else if (element.type === "p_qm") {
    return <span key={element.id} style={{ color: 'var(--punc)', position: 'relative', padding: '1px' }}>
      {`?`}<PuncSpace aType={follower}></PuncSpace><InsertZone placing={placing} insert={insert} index={index} />
    </span>
  } else if (element.type === "p_dbldashR") {
    return <span key={element.id} style={{ color: 'var(--punc)', position: 'relative', padding: '1px' }}>
      {`—`}<PuncSpace aType={follower}></PuncSpace><InsertZone placing={placing} insert={insert} index={index} />
    </span>
  } else if (element.type === "p_Rqt") {
    return <span key={element.id} style={{ color: 'var(--punc)', position: 'relative', padding: '1px' }}>
      {`”`}<PuncSpace aType={follower}></PuncSpace><InsertZone placing={placing} insert={insert} index={index} />
    </span>
  } else if (element.type === "p_Rsq") {
    return <span key={element.id} style={{ color: 'var(--punc)', position: 'relative', padding: '1px' }}>
      {`’`}<PuncSpace aType={follower}></PuncSpace><InsertZone placing={placing} insert={insert} index={index} />
    </span>
  } else if (element.type === "p_dbldashL") {
    return <span key={element.id} style={{ color: 'var(--punc)', position: 'relative', padding: '1px' }}>
      &nbsp;{`—`}<InsertZone placing={placing} insert={insert} index={index} />
    </span>
  } else if (element.type === "p_Lqt") {
    return <span key={element.id} style={{ color: 'var(--punc)', position: 'relative', padding: '1px' }}>
      &nbsp;{`“`}<InsertZone placing={placing} insert={insert} index={index} />
    </span>
  } else if (element.type === "p_parL") {
    return <span key={element.id} style={{ color: 'var(--punc)', position: 'relative', padding: '1px' }}>
      &nbsp;{`(`}<InsertZone placing={placing} insert={insert} index={index} />
    </span>
  } else if (element.type === "p_Lsq") {
    return <span key={element.id} style={{ color: 'var(--punc)', position: 'relative', padding: '1px' }}>
      &nbsp;{`‘`}<InsertZone placing={placing} insert={insert} index={index} />
    </span>
  } else {
    console.log("unknown type")
    console.log(element)
    return <></>
  }
}

const InsertZone = ({ placing, insert, index }) => {
  // class for showing the insert triangle
  let classToUse = "hidden"
  if (placing) {
    classToUse = "visible"
  }
  // add position adjustment class
  if (index % 2 === 1) {
    classToUse = classToUse + " top"
  } else {
    classToUse = classToUse + " bottom"
  }

  return <div className={classToUse}
    onClick={(e) => insert(index)} >
    <DrawCaret index={index} />
    <style jsx>
      {`
      .hidden, .visible {
        height: 0.8em;
        width: 0.8em;
        border: 0px;
        position: absolute;
        right: -0.4em;
        padding: 0px;
        z-index: 1;
      }
      .hidden {
        display: none;
      }
      .visible:hover {
        cursor: pointer;
      }
      .top {
        top: -0.2em;
      }
      .bottom {
        top: 1.0em;
      }
      `}
    </style>
  </div>
}

const DrawCaret = ({ index }) => {
  const bottomTriangle = <polygon points="13 38 37 38 25 13" />
  const topTriangle = <polygon points="13 13 37 13 25 38" />
  let polygon = bottomTriangle
  if (index % 2 === 1) {
    polygon = topTriangle
  }

  return <svg width="100%" viewBox="0 0 50 50" version="1.1"
    xmlns="http://www.w3.org/2000/svg" strokeLinejoin="round">
    {polygon}
    <style jsx>
      {`
        svg {
          position: absolute;
          fill: rgba(255,51,0 ,0.4);
          right: 0;
        }
        svg.hidden {
          opacity: 0.0;
        }
        svg:hover, svg:active, svg:focus {
          fill: rgba(255,51,0 ,1);
        }
      `}
    </style>
  </svg>
}

const PuncSpace = ({ aType }) => {
  if (aType === null || aType === "noun" || aType === "verb" ||
    aType === "pron" || aType === "adj" || aType === "adv" ||
    aType === "intrj" || aType === "conj" || aType === "prep") {
    return <>&nbsp;</>
  } else {
    return <></>
  }
}

export default ({ sentence, placing, insert }) => (
  <div className="active_sentence_slot"
    onDragOver={event => event.preventDefault()}>
    <div className="active_sentence_content" >
      <div className="active_sentence">
        {sentence.map((element, index, elements) => {
          let follower = null
          if (index < (sentence.length - 1)) {
            follower = sentence[index + 1].type
          }
          return Word(element, follower, placing, insert, index);
        })}
      </div>
    </div>
    <div className="active_sentence_top_effect"></div>
    <div className="active_sentence_bottom_effect"></div>
    <style jsx>
      {`
        .active_sentence_slot {
          grid-area: mid;
          position: relative;
          box-sizing: border-box;
          display: flex;
          width: 100%;
          height: 100%;
          overflow: hidden;
          align-items: center;
          justify-content: center;
        }
        .active_sentence_top_effect {
          position: absolute; /* Stay in place */
          top: 0px;
          width: 100%;
          height: 15px;
          background: linear-gradient(to bottom, rgba(40,44,52,1.0), rgba(40,44,52,0.0));
          pointer-events: none;
        }
        .active_sentence_bottom_effect {
          position: absolute; /* Stay in place */
          bottom: 0px;
          width: 100%;
          height: 15px;
          background: linear-gradient(to top, rgba(40,44,52,1.0), rgba(40,44,52,0.0));
          pointer-events: none;
        }
        .active_sentence_content {
          min-height: 0;
          height: 100%;
          width: auto;
          margin: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          align-content: flex-start;
          overflow-y: scroll;
          scrollbar-width: none;
        }
        .active_sentence_content::-webkit-scrollbar {
          display: none;
        }

        .active_sentence {
          min-height: 0;
          height: auto;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: center;
          font-family: Roboto;
          align-content: flex-start;
          font-size: 1.6em;
          padding: 12px;
          padding-top: 0.5em;
          padding-bottom: 0.5em;
          line-height: 1.6em;
        }
      `}
    </style>
  </div>
);
