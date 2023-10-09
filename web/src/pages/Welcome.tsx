import { useMsal } from '@azure/msal-react';
import { Box, Button, Container, Flex, Image, Text, Title, rem } from '@mantine/core';
import { loginRequest } from '../configs/authConfig';

const Welcome = () => {
  const { instance } = useMsal();

  const handleLoginRedirect = () => {
    instance.loginRedirect(loginRequest);
  };

  return (
    <Container>
      <Flex h="100vh" justify="center" align="center" direction="column" gap="md">
        <Image src="https://illustrations.popsy.co/violet/keynote-presentation.svg" width="25rem" />
        <Title align="center">
          Velkommen til{' '}
          <Box
            sx={(theme) => ({
              display: 'inline-block',
              position: 'relative',
              backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
                .background,
              borderRadius: theme.radius.sm,
              padding: `${rem(4)} ${rem(12)}`,
            })}
          >
            IntraTask
          </Box>
        </Title>
        <Text color="dimmed" ta="center">
          IntraTask er ditt verktøy for å håndtere avvik i din bedrift. Logg inn for å starte
        </Text>
        <Button onClick={handleLoginRedirect}>Login</Button>
      </Flex>
    </Container>
  );
};

export default Welcome;
