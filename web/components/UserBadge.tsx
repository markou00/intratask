import { Alert, Avatar, Badge, Group, Text } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface UserBadgeProps {
  identifier: string | null;
  error?: boolean | null;
  userImageUrls: Record<string, string>;
}

const UserBadge: React.FC<UserBadgeProps> = ({
  identifier,
  error = false,
  userImageUrls,
}) => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (identifier && identifier !== "Zendesk") {
      axios.get(`/api/users/${identifier}`).then((response) => {
        setUserData(response.data);
      });
    }
  }, [identifier]);

  if (identifier?.toLowerCase() === "zendesk") {
    return <Badge variant="outline">Zendesk</Badge>;
  }

  if (error) {
    return (
      <Alert variant="filled" color="red" icon={<IconInfoCircle size="1rem" />}>
        Error
      </Alert>
    );
  }

  return (
    <Group spacing="xs">
      {identifier ? (
        <Avatar src={userImageUrls[identifier]} size={30} radius={30} />
      ) : (
        ""
      )}
      <Text fz="sm">{userData?.name}</Text>
    </Group>
  );
};

export default UserBadge;
