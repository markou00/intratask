import { ActionIcon, Badge, Box, Button, ScrollArea, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAdjustmentsHorizontal, IconX } from '@tabler/icons-react';
import FilterDrawer from './FilterDrawer';

const filterData = ['2022', 'Kvalitet', 'HMS', 'BIR AS'];

const removeButton = (
  <ActionIcon size="xs" color="reknes" radius="xl" variant="transparent">
    <IconX size={rem(20)} />
  </ActionIcon>
);

const ActiveFilters = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Box
      p="sm"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === 'dark' ? theme.other.bgMainDark : theme.other.bgNavFilterLight,
        borderBottom: theme.colorScheme === 'dark' ? '1px solid #2a2a2a' : '1px solid #e6e6e6',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      })}
    >
      <ScrollArea type="never">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '.7rem',
            margin: '.3rem 0',
          }}
        >
          <Button
            compact
            variant="outline"
            leftIcon={<IconAdjustmentsHorizontal />}
            onClick={open}
            radius="md"
          >
            Filter
          </Button>

          <FilterDrawer opened={opened} close={close} />

          {filterData.map((filter, index) => (
            <Badge
              key={index}
              radius="md"
              variant="light"
              pr={3}
              rightSection={removeButton}
              p="sm"
            >
              {filter}
            </Badge>
          ))}
        </div>
      </ScrollArea>
    </Box>
  );
};

export default ActiveFilters;
