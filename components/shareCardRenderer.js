import satori from "satori";

let fontData = null;
let ShareCardComponent = null;

const getFontData = async () => {
  if (fontData) return fontData;
  
  const response = await fetch("/Roboto-Regular.ttf");
  fontData = await response.arrayBuffer();
  return fontData;
};

export const loadShareCardComponent = async () => {
  if (ShareCardComponent) return ShareCardComponent;
  
  const shareCardModule = await import("./ShareCard.jsx");
  ShareCardComponent = shareCardModule.ShareCard;
  return ShareCardComponent;
};

const svgToPngDataUrl = (svgString, width, height) => {
  return new Promise((resolve) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      
      resolve(canvas.toDataURL("image/png"));
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    
    img.src = url;
  });
};

export const renderShareCard = async ({ sentence, cards, width = 1080, height = 1080, moveCount = null }) => {
  const font = await getFontData();
  const ShareCard = await loadShareCardComponent();
  
  const svg = await satori(
    <ShareCard 
      sentence={sentence} 
      cards={cards} 
      moveCount={moveCount}
      width={width}
      height={height}
    />,
    {
      width,
      height,
      fonts: [
        {
          name: "Roboto",
          data: font,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
  
  const dataUrl = await svgToPngDataUrl(svg, width, height);
  return dataUrl;
};
