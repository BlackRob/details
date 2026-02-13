import React from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  ActionIcon,
  Stack,
  Radio,
  Text,
  Group,
  Title,
} from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";

const SettingsPopUp = ({ gameMode, setGameMode }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <ActionIcon variant="subtle" color="gray" size={52} onClick={open}>
        <IconSettings size="2.5rem" stroke={1.5} />
      </ActionIcon>

      <Modal
        opened={opened}
        onClose={close}
        title="Settings"
        centered
        padding="xl" // Matches Question.jsx
        overlayProps={{ opacity: 0.5, blur: 4 }}
        styles={{
          title: {
            fontSize: "1.8rem", // Matches Question.jsx
            fontWeight: 700,
          },
          close: {
            color: "black",
            width: "44px", // Bigger click area
            height: "44px",

            // Force the internal SVG icon to be larger
            "& svg": {
              width: "28px !important",
              height: "28px !important",
            },

            transition: "background-color 0.2s",
            // We are keeping the default Mantine hover behavior here
          },
        }}
      >
        <Stack gap="md">
          <Title order={3} size="h4">
            Choose how you want to play:
          </Title>

          <Radio.Group value={gameMode} onChange={setGameMode} name="gameMode">
            <Stack gap="md">
              <Radio
                size="md"
                value="collaborative"
                label={
                  <Group gap={5}>
                    <Text size="md">Collaborative Mode</Text>
                    <Text c="dimmed" size="sm">
                      (default)
                    </Text>
                  </Group>
                }
              />

              <Radio
                size="md"
                value="creative"
                label={<Text size="md">Creative Mode</Text>}
              />
            </Stack>
          </Radio.Group>
        </Stack>
      </Modal>
    </>
  );
};

export default SettingsPopUp;
