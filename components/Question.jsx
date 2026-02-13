import React from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  ActionIcon,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Divider,
} from "@mantine/core";
import { IconHelp } from "@tabler/icons-react";
import YouTubeVid from "./youTubeVid.js";

const PopUp = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <ActionIcon variant="subtle" color="gray" size={52} onClick={open}>
        <IconHelp size="2.5rem" stroke={1.5} />
      </ActionIcon>

      <Modal
        opened={opened}
        onClose={close}
        title="About details ..."
        size="lg"
        padding="xl" // <--- Adds more breathing room around the edges
        overlayProps={{ opacity: 0.5, blur: 4 }}
        styles={{
          title: {
            fontSize: "1.8rem",
            fontWeight: 700,
          },
          close: {
            color: "black",
            width: "44px", // Bigger click area
            height: "44px", // Bigger click area

            // Force the internal SVG icon to be larger
            "& svg": {
              width: "28px !important",
              height: "28px !important",
            },

            transition: "background-color 0.2s",
          },
        }}
      >
        <Stack gap="lg">
          {/* FAQ Section */}
          <div>
            <Title order={3} size="h4" mb={5}>
              What is this?
            </Title>
            <Text size="md">It&apos;s a game to practice English grammar.</Text>
          </div>

          <div>
            <Title order={3} size="h4" mb={5}>
              How do you play?
            </Title>
            <Text size="md">
              You start with a simple sentence, then make it longer by adding
              details.
            </Text>
          </div>

          <div>
            <Title order={3} size="h4" mb={5}>
              What do you mean by &quot;details&quot;?
            </Title>
            <Text size="md" lh={1.6}>
              I mean details! If I have a sentence, &quot;Chocolate is
              delicious&quot;, I can add a <i>detail</i> like the adjective{" "}
              <b>dark</b>, and now I have a longer sentence, &quot;<b>Dark</b>{" "}
              chocolate is delicious&quot;.
            </Text>
          </div>

          <div>
            <Title order={3} size="h4" mb={5}>
              Can I see an example?
            </Title>
            <Text size="md" mb="xs">
              Sure! Watch the video below or click{" "}
              <a
                href="https://grumbly.games/posts/200418_playing_details"
                target="_blank"
                rel="noreferrer"
                style={{ color: "inherit", textDecoration: "underline" }}
              >
                here
              </a>{" "}
              to read the rules.
            </Text>

            <YouTubeVid vidID="8qAy85pGBKs" caption=" " />
          </div>

          <Divider my="sm" />

          {/* Grammar Buttons Section */}
          <Stack align="center" gap="xs">
            <Title order={4}>Learn more about...</Title>

            <Group justify="center" gap="xs">
              <GrammarBtn type="adj" href="adjectives">
                adjectives
              </GrammarBtn>
              <GrammarBtn type="noun" href="nouns">
                nouns
              </GrammarBtn>
              <GrammarBtn type="adv" href="adverbs">
                adverbs
              </GrammarBtn>
              <GrammarBtn type="verb" href="verbs">
                verbs
              </GrammarBtn>
              <GrammarBtn type="prep" href="prepositions">
                prepositions
              </GrammarBtn>
              <GrammarBtn type="conj" href="conjunctions">
                conjunctions
              </GrammarBtn>
              <GrammarBtn type="pron" href="pronouns">
                pronouns
              </GrammarBtn>
              <GrammarBtn type="intrj" href="interjections">
                interjections
              </GrammarBtn>
              <GrammarBtn type="punc" href="punctuation">
                punctuation
              </GrammarBtn>
            </Group>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
};

// Helper component
const GrammarBtn = ({ type, href, children }) => (
  <Button
    component="a"
    href={`https://grumbly.games/${href}`}
    target="_blank"
    rel="noopener noreferrer"
    color={type}
    variant="filled"
    size="sm"
    radius="sm"
    style={{ color: "black" }}
  >
    {children}
  </Button>
);

export default PopUp;
