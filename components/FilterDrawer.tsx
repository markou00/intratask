import { Box, Button, Drawer, Flex, ScrollArea, Select } from "@mantine/core";
import { useFilters } from "contexts/FilterContext";
import { useState } from "react";

interface IFilterDrawer {
  opened: boolean;
  close: () => void;
}

const FilterDrawer = ({ opened, close }: IFilterDrawer) => {
  const { setFilters } = useFilters();
  // TODO: Replace this with data from Zendesk
  const data = ["2020", "2021", "2022", "2023"];
  const [year, setYear] = useState(data[0]);

  return (
    <Drawer.Root
      opened={opened}
      onClose={close}
      style={{ display: "flex" }}
      scrollAreaComponent={ScrollArea}
    >
      <Drawer.Overlay />
      <Drawer.Content
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.other.bgNavFilterDark
              : theme.other.bgNavFilterLight,
        })}
      >
        <Drawer.Header
          sx={(theme) => ({
            borderBottom:
              theme.colorScheme === "dark"
                ? "1px solid #2a2a2a"
                : "1px solid #e6e6e6",
          })}
          mb={15}
        >
          <Drawer.Title>Filters</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body mb={50}>
          <Select
            label="Dato"
            data={data}
            value={year}
            onChange={(value) => setYear(value!)}
          />
        </Drawer.Body>
        <Box
          sx={(theme) => ({
            position: "fixed",
            bottom: 0,
            width: "100%",
            backgroundColor:
              theme.colorScheme === "light"
                ? theme.white
                : theme.colors.dark[7],
            borderTop:
              theme.colorScheme === "dark"
                ? "1px solid #2a2a2a"
                : "1px solid #e6e6e6",
          })}
        >
          <Flex justify="end" p={10} pr={20}>
            <Button
              mr={10}
              onClick={() => {
                setFilters([year]);
                close();
              }}
            >
              Save
            </Button>
          </Flex>
        </Box>
      </Drawer.Content>
    </Drawer.Root>
  );
};
export default FilterDrawer;
