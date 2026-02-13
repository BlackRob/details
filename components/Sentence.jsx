import React, { useState } from "react";
import { useMantineTheme } from "@mantine/core";

// Helper to identify punctuation that should "stick" to the previous word
const isLeftSticky = (type) => {
  return [
    "p_prd", // .
    "p_com", // ,
    "p_semi", // ;
    "p_cln", // :
    "p_exc", // !
    "p_qm", // ?
    "p_parR", // )
    "p_Rqt", // ”
    "p_Rsq", // ’
    "p_dbldashR", // — (right side)
  ].includes(type);
};

const Word = ({ element, follower, placing, insert, index, theme }) => {
  const color =
    element.type === "head"
      ? theme.colors.darkCharcoal[0]
      : element.type.startsWith("p_")
        ? theme.colors.punc[0]
        : theme.colors[element.type]?.[0] || "inherit";

  const wordStyle = {
    color: color,
    position: "relative",
    padding: "1px",
  };

  const checkSpace = (fType) => {
    return (
      fType === null ||
      ["noun", "verb", "pron", "adj", "adv", "intrj", "conj", "prep"].includes(
        fType,
      )
    );
  };

  const hasSpace = checkSpace(follower);

  if (element.type === "head") {
    return (
      <span key={element.id} style={wordStyle}>
        &nbsp;
        <InsertZone
          placing={placing}
          insert={insert}
          index={index}
          hasSpace={true}
        />
        <PuncSpace aType={follower} />
      </span>
    );
  } else if (element.type.startsWith("p_")) {
    let char = "";
    switch (element.type) {
      case "p_com":
        char = ",";
        break;
      case "p_semi":
        char = ";";
        break;
      case "p_cln":
        char = ":";
        break;
      case "p_prd":
        char = ".";
        break;
      case "p_exc":
        char = "!";
        break;
      case "p_parR":
        char = ")";
        break;
      case "p_qm":
        char = "?";
        break;
      case "p_dbldashR":
        char = "—";
        break;
      case "p_Rqt":
        char = "”";
        break;
      case "p_Rsq":
        char = "’";
        break;
      case "p_dbldashL":
        return (
          <span key={element.id} style={wordStyle}>
            &nbsp;—
            <InsertZone
              placing={placing}
              insert={insert}
              index={index}
              hasSpace={false}
            />
          </span>
        );
      case "p_Lqt":
        return (
          <span key={element.id} style={wordStyle}>
            &nbsp;“
            <InsertZone
              placing={placing}
              insert={insert}
              index={index}
              hasSpace={false}
            />
          </span>
        );
      case "p_parL":
        return (
          <span key={element.id} style={wordStyle}>
            &nbsp;(
            <InsertZone
              placing={placing}
              insert={insert}
              index={index}
              hasSpace={false}
            />
          </span>
        );
      case "p_Lsq":
        return (
          <span key={element.id} style={wordStyle}>
            &nbsp;‘
            <InsertZone
              placing={placing}
              insert={insert}
              index={index}
              hasSpace={false}
            />
          </span>
        );
      default:
        char = "";
    }

    return (
      <span key={element.id} style={wordStyle}>
        {char}
        <PuncSpace aType={follower} />
        <InsertZone
          placing={placing}
          insert={insert}
          index={index}
          hasSpace={hasSpace}
        />
      </span>
    );
  } else {
    return (
      <span key={element.id} style={wordStyle}>
        {element.word}
        <InsertZone
          placing={placing}
          insert={insert}
          index={index}
          hasSpace={hasSpace}
        />
        <PuncSpace aType={follower} />
      </span>
    );
  }
};

const InsertZone = ({ placing, insert, index, hasSpace }) => {
  let classToUse = "hidden";
  if (placing) {
    classToUse = "visible";
  }
  const rightPosition = hasSpace ? "-0.35em" : "-0.55em";

  return (
    <div
      className={classToUse}
      onClick={(e) => insert(index)}
      style={{ right: rightPosition }}
    >
      <DrawCaret />
      <style jsx>
        {`
          .hidden,
          .visible {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            height: 1.4em;
            width: 1em;
            border: 0px;
            padding: 0px;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .hidden {
            display: none;
          }
          .visible {
            cursor: pointer;
          }
          .visible:hover :global(.caret) {
            background-color: #73cef4;
            opacity: 1;
            box-shadow: 0 0 8px #73cef4;
            transform: scaleX(1.5);
          }
        `}
      </style>
    </div>
  );
};

const DrawCaret = () => {
  return (
    <div className="caret">
      <style jsx>
        {`
          .caret {
            width: 3px;
            height: 1.1em;
            background-color: white;
            opacity: 0.15;
            border-radius: 2px;
            transition: all 0.2s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

const PuncSpace = ({ aType }) => {
  if (
    aType === null ||
    ["noun", "verb", "pron", "adj", "adv", "intrj", "conj", "prep"].includes(
      aType,
    )
  ) {
    return <>&nbsp;</>;
  } else {
    return <></>;
  }
};

const TheSentence = ({ sentence, placing, insert }) => {
  const theme = useMantineTheme();

  // Logic to group words with sticky punctuation
  const renderedElements = [];
  let i = 0;
  while (i < sentence.length) {
    const group = [sentence[i]];
    const startIndex = i;

    // Look ahead: if next items are punctuation that should stick to the left, add them to this group
    while (i + 1 < sentence.length && isLeftSticky(sentence[i + 1].type)) {
      i++;
      group.push(sentence[i]);
    }

    if (group.length > 1) {
      // Render as a group that cannot break
      renderedElements.push(
        <span
          key={`group-${sentence[startIndex].id}`}
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {group.map((el, gIdx) => {
            const absIndex = startIndex + gIdx;
            let follower = null;
            if (absIndex < sentence.length - 1) {
              follower = sentence[absIndex + 1].type;
            }
            return (
              <Word
                key={el.id}
                element={el}
                follower={follower}
                placing={placing}
                insert={insert}
                index={absIndex}
                theme={theme}
              />
            );
          })}
        </span>,
      );
    } else {
      // Render normally
      let follower = null;
      if (i < sentence.length - 1) {
        follower = sentence[i + 1].type;
      }
      renderedElements.push(
        <Word
          key={sentence[i].id}
          element={sentence[i]}
          follower={follower}
          placing={placing}
          insert={insert}
          index={i}
          theme={theme}
        />,
      );
    }
    i++;
  }

  return (
    <div
      className="active_sentence_slot"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "block",
      }}
      onDragOver={(event) => event.preventDefault()}
    >
      <div
        className="active_sentence_content"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflowY: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="active_sentence">{renderedElements}</div>
      </div>

      <style jsx>
        {`
          .active_sentence_slot {
            box-sizing: border-box;
            overflow: hidden;
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
            align-content: flex-start;
            /* Fluid font size */
            font-size: clamp(1.5rem, 5vmin, 2.5rem);
            padding: 12px;
            padding-top: 0.5em;
            padding-bottom: 0.5em;
            line-height: 1.6em;
          }
        `}
      </style>
    </div>
  );
};

export default TheSentence;
