import { useMsal } from "@azure/msal-react";
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
  Modal,
  Paper,
  Text,
  Transition,
  createStyles,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconLogout, IconPlus } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RedCardsProvider } from "../../contexts/RedCardsContext";
import MutateDeviation from "../modals/MutateDeviation/MutateDeviation";

const HEADER_HEIGHT = rem(40);

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 10,
    borderBottom: "none",
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));
const links = [
  {
    link: "/",
    label: "Dashbord",
  },
  {
    link: "/deviations",
    label: "Saker",
  },
];
const Layout = () => {
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [graphData, setGraphData] = useState<any>(null); // TODO: Define proper type for graphData
  const router = useRouter();
  const [opened, { toggle, close }] = useDisclosure(false);
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 48em)");

  const { instance } = useMsal();
  const handleLogoutRedirect = () => {
    instance.logoutRedirect();
  };

  useEffect(() => {
    if (!graphData) {
      axios
        .get("/api/get-tenant-users")
        .then((response) => {
          setGraphData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching graph data:", error);
        });
    }
  }, [graphData]);

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={cx(classes.link, {
        [classes.linkActive]: router.pathname === link.link,
      })}
    >
      <Text onClick={close}>{link.label}</Text>
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
            <Burger
              opened={opened}
              onClick={toggle}
              className={classes.burger}
              size="sm"
            />
            <Image
              width="8.5rem"
              height="auto"
              src="/logo.png"
              alt="Reknes logo"
            />
          </Flex>

          <Group>
            {!isMobile && (
              <Button
                radius="md"
                leftIcon={<IconPlus size="1.2rem" />}
                onClick={openModal}
              >
                Ny Avvik
              </Button>
            )}
            {isMobile && (
              <ActionIcon
                radius="md"
                color="teams"
                variant="filled"
                size="lg"
                onClick={openModal}
              >
                <IconPlus size="1.2rem" />
              </ActionIcon>
            )}

            <RedCardsProvider>
              <Modal
                opened={modalOpened}
                onClose={closeModal}
                title="Opprett et nytt avvik"
              >
                <MutateDeviation
                  graphData={graphData}
                  mode="create"
                  closeModal={closeModal}
                />
              </Modal>
            </RedCardsProvider>

            <Divider orientation="vertical" size="sm" />
            <ActionIcon
              variant="transparent"
              size="lg"
              onClick={handleLogoutRedirect}
            >
              <IconLogout />
            </ActionIcon>
          </Group>

          <Transition
            transition="pop-top-right"
            duration={200}
            mounted={opened}
          >
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
