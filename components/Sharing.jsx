import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Modal,
  Stack,
  Text,
  Box,
  Button,
  CopyButton,
  SegmentedControl,
  Center,
  Group,
  Loader,
} from "@mantine/core";
import {
  IconCopy,
  IconCheck,
  IconShare,
  IconMovie,
  IconPhoto,
} from "@tabler/icons-react";
import { renderShareCard } from "./shareCardRenderer";
import { generateVideo } from "./generateVideo";
import { gameStateToStr } from "./gameStatePack";

const Sharing = ({
  sentence,
  cards,
  undoStack,
  showSharing,
  setShowSharing,
}) => {
  return (
    <Modal
      opened={showSharing}
      onClose={() => setShowSharing(false)}
      title={
        <Text fw={700} size="1.7rem">
          Share your sentence!
        </Text>
      }
      centered
      size="md"
      radius="md"
      padding="xl"
      closeButtonProps={{
        size: "xl",
        iconSize: 30,
      }}
    >
      {showSharing && (
        <SharingBody sentence={sentence} cards={cards} undoStack={undoStack} />
      )}
    </Modal>
  );
};

const SharingBody = ({ sentence, cards, undoStack }) => {
  const [shareType, setShareType] = useState("image");
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState(null);

  const gameURL = useMemo(() => {
    const gameAsString = gameStateToStr({ sentence, cards });
    const canvasURLstring = Buffer.from(gameAsString, "utf8").toString(
      "base64",
    );
    return `https://details.grumbly.games/${canvasURLstring}`;
  }, [sentence, cards]);

  const readableSentence = useMemo(() => makeReadable({ sentence }), [sentence]);

  useEffect(() => {
    let active = true;
    
    const generateImage = async () => {
      try {
        const dataUrl = await renderShareCard({ sentence, cards });
        if (active) {
          setImageDataUrl(dataUrl);
        }
      } catch (e) {
        console.error("Image generation failed", e);
      }
    };
    
    generateImage();
    
    return () => {
      active = false;
    };
  }, [sentence, cards]);

  // 2. Generate Video (Async on mount)
  useEffect(() => {
    let active = true;
    let generatedUrl = null;

    const runGen = async () => {
      setIsGeneratingVideo(true);
      try {
        const safeStack = undoStack || [];
        const blob = await generateVideo(sentence, cards, safeStack);

        if (active) {
          generatedUrl = URL.createObjectURL(blob);
          setVideoUrl(generatedUrl);

          const file = new File([blob], "details-game.mp4", {
            type: "video/mp4",
          });
          setVideoFile(file);
        }
      } catch (e) {
        console.error("Video gen failed", e);
      } finally {
        if (active) setIsGeneratingVideo(false);
      }
    };

    runGen();

    return () => {
      active = false;
      // FIX: Clean up the specific URL created by this effect run
      if (generatedUrl) URL.revokeObjectURL(generatedUrl);
    };
  }, [sentence, cards, undoStack]);

  const handleNativeShare = async () => {
    const shareData = {
      title: "details",
      text: readableSentence,
    };

    if (shareType === "image") {
      shareData.url = gameURL;
    } else if (shareType === "video" && videoFile) {
      if (navigator.canShare && navigator.canShare({ files: [videoFile] })) {
        shareData.files = [videoFile];
      } else {
        console.warn(
          "Browser does not support file sharing, sharing link instead.",
        );
        shareData.url = gameURL;
      }
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Web Share not supported. Please use the Copy Link button.");
    }
  };

  return (
    <Stack gap="lg" align="center">
      {/* Media Display Area */}
      <Box
        w="100%"
        mw={{ base: "100%", sm: "340px" }}
        mx="auto"
        style={{
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          display: "flex",
          position: "relative",
          aspectRatio: "1 / 1",
          backgroundColor: "#282c34",
        }}
      >
        {/* 1. STATIC IMAGE VIEW */}
        <Box
          style={{
            display: shareType === "image" ? "block" : "none",
            width: "100%",
            height: "100%",
          }}
        >
          {imageDataUrl ? (
            <Image
              src={imageDataUrl}
              width={1024}
              height={1024}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
              alt="sentence as image"
            />
          ) : (
            <Center style={{ width: "100%", height: "100%" }}>
              <Loader color="white" type="bars" />
            </Center>
          )}
        </Box>

        {/* 2. VIDEO VIEW */}
        <Box
          style={{
            display: shareType === "video" ? "block" : "none",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              loop
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <>
              {imageDataUrl ? (
                <Image
                  src={imageDataUrl}
                  width={1024}
                  height={1024}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                    opacity: 0.5,
                  }}
                  alt="generating video preview"
                />
              ) : (
                <Box
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#282c34",
                    opacity: 0.5,
                  }}
                />
              )}
              <Center
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 10,
                }}
              >
                <Stack align="center" gap="xs">
                  <Loader color="white" type="bars" />
                  <Text
                    c="white"
                    size="xs"
                    fw={500}
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                  >
                    Rendering Video...
                  </Text>
                </Stack>
              </Center>
            </>
          )}
        </Box>
      </Box>

      {/* Toggles */}
      <SegmentedControl
        value={shareType}
        onChange={setShareType}
        color="blue"
        radius="xl"
        size="md"
        data={[
          {
            value: "image",
            label: (
              <Group gap={12} wrap="nowrap" justify="center" px={4}>
                <IconPhoto size={20} />
                <Text fw={500}>Image</Text>
              </Group>
            ),
          },
          {
            value: "video",
            label: (
              <Group gap={12} wrap="nowrap" justify="center" px={4}>
                <IconMovie size={20} />
                <Text fw={500}>Video</Text>
              </Group>
            ),
          },
        ]}
      />

      {/* Buttons */}
      <Stack w="100%" gap="sm">
        <Button
          size="lg"
          radius="md"
          color="blue"
          leftSection={
            shareType === "image" ? (
              <IconPhoto size={22} />
            ) : (
              <IconMovie size={22} />
            )
          }
          rightSection={<IconShare size={22} style={{ opacity: 0.6 }} />}
          onClick={handleNativeShare}
          loading={shareType === "video" && isGeneratingVideo}
          disabled={shareType === "video" && !videoFile}
          fullWidth
        >
          Share&nbsp;
          <span
            style={{
              display: "inline-block",
              width: "3.6rem", // Slightly reduced width, no margins
              textAlign: "center",
            }}
          >
            {shareType === "image" ? "Image" : "Video"}
          </span>
        </Button>

        <CopyButton value={gameURL} timeout={2000}>
          {({ copied, copy }) => (
            <Button
              size="md"
              radius="md"
              color={copied ? "teal" : "gray"}
              variant="light"
              onClick={copy}
              leftSection={
                copied ? <IconCheck size={20} /> : <IconCopy size={20} />
              }
              fullWidth
            >
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          )}
        </CopyButton>
      </Stack>
    </Stack>
  );
};

const makeReadable = ({ sentence }) => {
  let inArray = Object.keys(sentence);
  let x = null;
  let y = null;
  let next = null;
  let outputArray = inArray.map((id) => {
    if (
      ["noun", "verb", "pron", "adj", "adv", "intrj", "conj", "prep"].includes(
        sentence[id].type,
      )
    ) {
      x = sentence[id].word;
      y = "";
      next = (parseInt(id) + 1).toString();
      if (
        parseInt(id) + 1 < inArray.length &&
        [
          "noun",
          "verb",
          "pron",
          "adj",
          "adv",
          "intrj",
          "conj",
          "prep",
        ].includes(sentence[next].type)
      ) {
        y = " ";
      }
    } else {
      x = "";
      y = puncsAndSpaces(sentence[id]);
    }
    return `${x}${y}`;
  });

  let outputString = outputArray.join("");
  outputString = outputString.replace(/\s+/g, " ");
  if (outputString[outputString.length - 1] === " ") {
    outputString = outputString.substring(0, outputString.length - 1);
  }
  return outputString;
};

const puncsAndSpaces = (wordObj) => {
  let output = null;
  let x = wordObj.type;
  switch (true) {
    case x === "head":
      output = ``;
      break;
    case x === "p_com":
      output = `, `;
      break;
    case x === "p_semi":
      output = `; `;
      break;
    case x === "p_cln":
      output = `: `;
      break;
    case x === "p_parL":
      output = ` (`;
      break;
    case x === "p_dbldashL":
      output = ` —`;
      break;
    case x === "p_prd":
      output = `. `;
      break;
    case x === "p_exc":
      output = `! `;
      break;
    case x === "p_parR":
      output = `) `;
      break;
    case x === "p_qm":
      output = `? `;
      break;
    case x === "p_dbldashR":
      output = `— `;
      break;
    case x === "p_Rqt":
      output = `” `;
      break;
    case x === "p_Lqt":
      output = ` “`;
      break;
    case x === "p_Rsq":
      output = `’ `;
      break;
    case x === "p_Lsq":
      output = ` ‘`;
      break;
    default:
      output = ``;
  }
  return output;
};

export default Sharing;
