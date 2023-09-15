import { Box, Button, Drawer, Flex, NativeSelect, ScrollArea } from '@mantine/core';

interface IFilterDrawer {
  opened: boolean;
  close: () => void;
}

const FilterDrawer = ({ opened, close }: IFilterDrawer) => (
  <Drawer.Root
    opened={opened}
    onClose={close}
    style={{ display: 'flex' }}
    scrollAreaComponent={ScrollArea}
  >
    <Drawer.Overlay />
    <Drawer.Content
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === 'dark' ? theme.other.bgNavFilterDark : theme.other.bgNavFilterLight,
      })}
    >
      <Drawer.Header
        sx={(theme) => ({
          borderBottom: theme.colorScheme === 'dark' ? '1px solid #2a2a2a' : '1px solid #e6e6e6',
        })}
        mb={15}
      >
        <Drawer.Title>Filters</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body mb={50}>
        <NativeSelect data={['2020', '2021', '2022', '2023']} label="Dato" />
      </Drawer.Body>
      <Box
        sx={(theme) => ({
          position: 'fixed',
          bottom: 0,
          width: '100%',
          backgroundColor: theme.colorScheme === 'light' ? theme.white : theme.colors.dark[7],
          borderTop: theme.colorScheme === 'dark' ? '1px solid #2a2a2a' : '1px solid #e6e6e6',
        })}
      >
        <Flex justify="end" p={10} pr={20}>
          <Button
            mr={10}
            onClick={() => {
              close();
            }}
          >
            Save
          </Button>
          <Button
            onClick={() => {
              close();
            }}
          >
            Clear
          </Button>
        </Flex>
      </Box>
    </Drawer.Content>
  </Drawer.Root>
);

export default FilterDrawer;
