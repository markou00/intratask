import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Group,
  Image,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconLogout, IconPlus } from '@tabler/icons-react';

interface ILayout {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayout) => {
  const theme = useMantineTheme();
  // TODO: replace this with fn.smallerThan
  const isMobile = useMediaQuery('(max-width: 30em)');

  return (
    <>
      <Container p="md" fluid sx={{ boxShadow: theme.shadows.xs }}>
        <Group position="apart">
          <Image width="10rem" height="auto" src="/logo.png" />
          <Group>
            {!isMobile && (
              <Button radius="md" leftIcon={<IconPlus size="1.2rem" />}>
                Ny Avvik
              </Button>
            )}
            {isMobile && (
              <ActionIcon radius="md" color="teams" variant="filled" size="lg">
                <IconPlus size="1.2rem" />
              </ActionIcon>
            )}
            <Divider orientation="vertical" size="sm" />
            <ActionIcon variant="transparent" size="lg">
              <IconLogout />
            </ActionIcon>
          </Group>
        </Group>
      </Container>
      {children}
    </>
  );
};

export default Layout;
