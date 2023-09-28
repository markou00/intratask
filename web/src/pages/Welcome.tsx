import { useMsal } from '@azure/msal-react';
import { Button, Container, Flex, Image, Text, Title } from '@mantine/core';
import { loginRequest } from '../authConfig';

const Welcome = () => {
  const { instance } = useMsal();

  const handleLoginRedirect = () => {
    instance.loginRedirect(loginRequest);
  };

  return (
    <Container>
      <Flex h="100vh" justify="center" align="center" direction="column" gap="md">
        <Image src="https://illustrations.popsy.co/violet/keynote-presentation.svg" width="25rem" />
        <Title>Velkommen til IntraTask!</Title>
        <Text>
          IntraTask er ditt verktøy for å håndtere avvik i din bedrift. Logg inn for å starte
        </Text>
        <Button onClick={handleLoginRedirect}>Login</Button>
      </Flex>
    </Container>
  );
};

export default Welcome;
