import React from "react";
import { Title, Group } from "@mantine/core";
import HelpPopUp from "./Question";
import SettingsPopUp from "./Settings";

// our beloved header
const OurBelovedHeader = ({ gameMode, setGameMode }) => (
  <Group justify="space-between" align="center" w="100%" px="lg">
    {/* The Title */}
    <Title
      order={1}
      c="white" // Explicitly set to white to match dark theme
      style={{ fontWeight: 300, fontSize: "4rem" }}
    >
      details
    </Title>

    {/* The Icons Group */}
    <Group gap="sm">
      <HelpPopUp />
      <SettingsPopUp gameMode={gameMode} setGameMode={setGameMode} />
    </Group>
  </Group>
);

export default OurBelovedHeader;
