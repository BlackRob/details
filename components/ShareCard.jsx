import React from "react";

const typeColors = {
  conj: "#ffe377",
  adj: "#89f0d1",
  noun: "#73cef4",
  adv: "#fcc8c8",
  verb: "#ff5c8f",
  intrj: "orange",
  prep: "#2cd946",
  pron: "#c09aeb",
  default: "lavender",
};

const getTypeColor = (type) => typeColors[type] || typeColors.default;

const cardTypes = ["adj", "adv", "conj", "pron", "noun", "verb", "prep", "intrj"];

const Header = ({ width }) => {
  const fontSize = Math.floor(width / 30);
  const bannerHeight = Math.floor(width / 12);
  const margin = Math.floor(width / 60);
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        height: bannerHeight,
        width: "100%",
        paddingLeft: margin,
        paddingRight: margin,
        boxSizing: "border-box",
      }}
    >
      <span style={{ color: "lightgray", fontSize, fontFamily: "Roboto" }}>
        details
      </span>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <span style={{ color: "#89f0d1", fontSize, fontFamily: "Roboto" }}>
          grumbly
        </span>
        <span style={{ color: "lavender", fontSize, fontFamily: "Roboto" }}>
          .
        </span>
        <span style={{ color: "#73cef4", fontSize, fontFamily: "Roboto" }}>
          games
        </span>
      </div>
    </div>
  );
};

const Word = ({ word, type, fontSize }) => {
  const color = getTypeColor(type);
  
  return (
    <span
      style={{
        color,
        marginRight: fontSize * 0.25,
        fontSize,
        fontFamily: "Roboto",
      }}
    >
      {word}
    </span>
  );
};

const Sentence = ({ sentence, width }) => {
  const margin = Math.floor(width / 60);
  const fontSize = Math.floor(width / 25);
  
  const words = Object.values(sentence);
  
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        width: "100%",
        paddingLeft: margin,
        paddingRight: margin,
        boxSizing: "border-box",
      }}
    >
      {words.map((wordObj) => (
        <Word 
          key={wordObj.id} 
          word={wordObj.word} 
          type={wordObj.type} 
          fontSize={fontSize} 
        />
      ))}
    </div>
  );
};

const CardRow = ({ cards, width }) => {
  const margin = Math.floor(width / 60);
  const cardRowHeight = Math.floor(width / 10);
  const fontSize = Math.floor(width / 35);
  const cardWidth = Math.floor(width / 9.4);
  const gap = Math.floor((width - margin * 2 - 8 * cardWidth) / 7);
  const radius = Math.floor(width / 150);
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: cardRowHeight,
        width: "100%",
        paddingLeft: margin,
        paddingRight: margin,
        boxSizing: "border-box",
        gap,
      }}
    >
      {cardTypes.map((type) => {
        const count = cards.filter((c) => c.type === type).length;
        const hasCards = count > 0;
        const color = hasCards ? getTypeColor(type) : "gray";
        
        return (
          <div
            key={type}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: cardWidth,
              height: cardRowHeight,
              borderRadius: radius,
              border: hasCards ? "none" : "2px solid gray",
              backgroundColor: hasCards ? color : "transparent",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                color: hasCards ? "black" : "gray",
                fontSize,
                fontFamily: "Roboto",
              }}
            >
              {type}
            </span>
            <span
              style={{
                color: hasCards ? "black" : "gray",
                fontSize,
                fontFamily: "Roboto",
              }}
            >
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const MoveCounter = ({ moveCount, width }) => {
  const margin = Math.floor(width / 60);
  const fontSize = Math.floor(width / 35);
  const spacing = Math.floor(fontSize * 0.5);
  
  return (
    <div
      style={{
        position: "absolute",
        right: margin,
        bottom: margin,
      }}
    >
      <span style={{ color: "lightgray", fontSize, fontFamily: "Roboto" }}>
        moves: {moveCount}
      </span>
    </div>
  );
};

export const ShareCard = ({ sentence, cards, moveCount = null, width = 1080, height = 1080 }) => {
  const margin = Math.floor(width / 60);
  const bannerHeight = Math.floor(width / 12);
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width,
        height,
        backgroundColor: "#282c34",
        padding: margin,
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <Header width={width} />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Sentence sentence={sentence} width={width} />
      </div>
      
      {moveCount !== null && (
        <MoveCounter moveCount={moveCount} width={width} />
      )}
      
      <CardRow cards={cards} width={width} />
    </div>
  );
};

export default ShareCard;
