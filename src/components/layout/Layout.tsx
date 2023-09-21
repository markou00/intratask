import { ActionIcon, Button, Container, Divider, Group, Image } from '@mantine/core';
import { IconLogout, IconPlus } from '@tabler/icons-react';

interface ILayout {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayout) => (
  <>
    <Container p="md" fluid sx={(theme) => ({ boxShadow: theme.shadows.xs })}>
      <Group position="apart">
        <Image width="10rem" height="auto" src="/logo.png" />
        <Group>
          <Button radius="md" leftIcon={<IconPlus size="1.2rem" />}>
            Ny Avvik
          </Button>
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

export default Layout;
