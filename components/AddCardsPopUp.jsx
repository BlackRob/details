import React from "react";
import {
  Modal,
  Stack,
  Text,
  SimpleGrid,
  Paper,
  Group,
  ActionIcon,
  Center,
  useMantineTheme,
} from "@mantine/core";
import { IconPlus, IconMinus } from "@tabler/icons-react";

const AddCardsPopUp = ({
  showAddCardsPopUp,
  showAddCards,
  cards,
  cardInc,
  cardDec,
}) => {
  const cardTypes = [
    "adj",
    "adv",
    "conj",
    "pron",
    "noun",
    "verb",
    "prep",
    "intrj",
  ];

  return (
    <Modal
      opened={showAddCards}
      onClose={() => showAddCardsPopUp(false)}
      centered
      // CHANGED: Use 'lg' instead of fixed 55rem to respect screen width on mobile
      size="lg"
      padding="xl"
      overlayProps={{ opacity: 0.5, blur: 4 }}
      styles={{
        body: { paddingTop: 0 },
        header: { paddingBottom: 0 },
        close: {
          color: "black",
          width: "44px",
          height: "44px",
          "& svg": { width: "28px !important", height: "28px !important" },
          transition: "background-color 0.2s",
        },
      }}
    >
      <Stack align="center" mt={0}>
        <Text
          ta="center"
          fw={600}
          style={{ fontSize: "1.4rem", lineHeight: 1.2 }}
          mb="xl"
        >
          Choose your cards
        </Text>

        <SimpleGrid
          // CHANGED: Responsive columns (2 on mobile, 4 on desktop)
          // This prevents the buttons from getting squashed.
          cols={{ base: 2, sm: 4 }}
          spacing="lg"
          w="100%"
        >
          {cardTypes.map((type) => (
            <DrawAddCardButton
              key={type}
              type={type}
              cardInc={cardInc}
              cards={cards}
              cardDec={cardDec}
            />
          ))}
        </SimpleGrid>
      </Stack>
    </Modal>
  );
};

const DrawAddCardButton = ({ type, cardInc, cards, cardDec }) => {
  const theme = useMantineTheme();

  let numType = [];
  if (Array.isArray(cards)) {
    numType = cards.filter(
      (element) => element.type === type && !element.working,
    );
  }
  const count = numType.length;
  const isActive = count > 0;

  // CHANGED: Pull color directly from theme instead of CSS class
  const activeColor = theme.colors[type]?.[0] || "#eee";

  return (
    <Paper
      shadow="sm"
      radius="md"
      withBorder
      style={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        // CHANGED: Use theme color if active, simple gray if not
        backgroundColor: isActive ? activeColor : "#f8f9fa",
        borderColor: isActive ? "black" : "#dee2e6",
        borderWidth: isActive ? "2px" : "1px",
        height: "8rem",
      }}
    >
      {/* Top Section: Display Label & Count */}
      <Center
        style={{
          flex: 1,
          flexDirection: "column",
          cursor: "default",
          color: "black",
        }}
      >
        <Text
          fw={800}
          size="1.1rem"
          tt="uppercase"
          style={{ opacity: 0.7 }}
          mb="xs"
          mt="sm"
        >
          {type}
        </Text>
        <Text fw={900} size="2.2rem" lh={1}>
          {count}
        </Text>
      </Center>

      {/* Bottom Section: Buttons */}
      <Group
        gap={0}
        grow
        h="3rem"
        wrap="nowrap" // CHANGED: Prevent buttons from wrapping on very small screens
        style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}
      >
        <ActionIcon
          variant="transparent"
          radius={0}
          h="100%"
          onClick={() => cardDec(type)}
          disabled={count === 0}
          style={{
            color: "black",
            opacity: count === 0 ? 0.2 : 0.7,
          }}
        >
          <IconMinus size="1.4rem" stroke={2.5} />
        </ActionIcon>

        <ActionIcon
          variant="transparent"
          radius={0}
          h="100%"
          onClick={() => cardInc(type)}
          style={{
            color: "black",
            borderLeft: "1px solid rgba(0,0,0,0.1)",
            opacity: 0.7,
          }}
        >
          <IconPlus size="1.4rem" stroke={2.5} />
        </ActionIcon>
      </Group>
    </Paper>
  );
};

export default AddCardsPopUp;
