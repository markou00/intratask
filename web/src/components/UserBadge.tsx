import { Alert, Avatar, Badge, Group, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

interface UserBadgeProps {
  identifier: string | null;
  error?: boolean | null;
  userImageUrls: Record<string, string>;
  graphData: {
    value: Array<{ id: string; displayName: string }>;
  };
}

const UserBadge: React.FC<UserBadgeProps> = ({
  identifier,
  error = false,
  userImageUrls,
  graphData,
}) => {
  if (identifier?.toLowerCase() === 'zendesk') {
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
      {identifier ? <Avatar src={userImageUrls[identifier]} size={30} radius={30} /> : ''}

      <Text fz="sm">
        {graphData && graphData.value.find((user: any) => user.id === identifier)?.displayName}
      </Text>
    </Group>
  );
};

export default UserBadge;
