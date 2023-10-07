import { useMsal } from '@azure/msal-react';
import {
  ActionIcon,
  Box,
  Burger,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Header,
  Image,
  Paper,
  Transition,
  createStyles,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconLogout, IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const HEADER_HEIGHT = rem(40);

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 1,
    borderBottom: 'none',
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}));
const links = [
  {
    link: '/',
    label: 'Dashbord',
  },
  {
    link: '/deviations',
    label: 'Saker',
  },
];
const Layout = () => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 48em)');

  const { instance } = useMsal();
  const handleLogoutRedirect = () => {
    instance.logoutRedirect();
  };

  const items = links.map((link) => (
    <Link
      key={link.label}
      to={link.link}
      className={cx(classes.link, { [classes.linkActive]: active === link.link })}
      onClick={() => {
        setActive(link.link);
        close();
      }}
    >
      {link.label}
    </Link>
  ));

  return (
    <Container p="md" fluid sx={{ boxShadow: theme.shadows.xs }}>
      <Header height={HEADER_HEIGHT} className={classes.root}>
        <Box className={classes.header}>
          <Group spacing={5} className={classes.links}>
            {items}
          </Group>

          <Flex justify="center" align="center" gap="sm">
            <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
            <Image width="8.5rem" height="auto" src="/logo.png" />
          </Flex>

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
            <ActionIcon variant="transparent" size="lg" onClick={handleLogoutRedirect}>
              <IconLogout />
            </ActionIcon>
          </Group>

          <Transition transition="pop-top-right" duration={200} mounted={opened}>
            {(styles) => (
              <Paper className={classes.dropdown} withBorder style={styles}>
                {items}
              </Paper>
            )}
          </Transition>
        </Box>
      </Header>
    </Container>
  );
};

export default Layout;
