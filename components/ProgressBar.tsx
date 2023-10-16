import { Progress, Text, useMantineTheme } from '@mantine/core';

interface IProgressBar {
  progress: number;
}

const ProgressBar: React.FC<IProgressBar> = ({ progress }) => {
  const theme = useMantineTheme();

  return (
    <>
      <Text fz="xs" c="teal" weight={700}>
        {progress}%
      </Text>
      <Progress
        sections={[
          {
            value: progress,
            color: theme.colorScheme === 'dark' ? theme.colors.teal[9] : theme.colors.teal[6],
          },
          {
            value: +`${100 - progress}`,
            color: theme.colorScheme === 'dark' ? theme.colors.red[9] : theme.colors.red[6],
          },
        ]}
      />
    </>
  );
};

export default ProgressBar;
