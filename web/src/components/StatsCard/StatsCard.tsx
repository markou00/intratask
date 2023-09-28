import { Paper, Text, ThemeIcon, createStyles, rem } from '@mantine/core';
import { IconCheck, IconExternalLink, IconPlus, IconX } from '@tabler/icons-react';

const ICON_SIZE = rem(60);

const useStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
    overflow: 'visible',
    padding: theme.spacing.xl,
    paddingTop: `calc(${theme.spacing.xl} * 1.5 + ${ICON_SIZE} / 3)`,
  },

  icon: {
    position: 'absolute',
    top: `calc(-${ICON_SIZE} / 3)`,
    left: `calc(50% - ${ICON_SIZE} / 2)`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
  },
  value: {
    fontSize: rem(24),
    fontWeight: 700,
    lineHeight: 1,
  },
}));

interface IStatsCard {
  title: string;
  variant: 'created' | 'solved' | 'unsolved' | 'zendesk';
  value: number;
}

const iconVariants = {
  created: <IconPlus size="2rem" stroke={1.5} />,
  solved: <IconCheck size="2rem" stroke={1.5} />,
  unsolved: <IconX size="2rem" stroke={1.5} />,
  zendesk: <IconExternalLink size="2rem" stroke={1.5} />,
};

const StatsCard = ({ title, variant, value }: IStatsCard) => {
  const { classes } = useStyles();

  return (
    <Paper
      radius="md"
      shadow="sm"
      withBorder
      className={classes.card}
      mt={`calc(${ICON_SIZE} / 3)`}
    >
      <ThemeIcon className={classes.icon} size={ICON_SIZE} radius={ICON_SIZE}>
        {iconVariants[variant]}
      </ThemeIcon>

      <Text mb="md" ta="center" className={classes.title}>
        {title}
      </Text>

      <Text ta="center" className={classes.value}>
        {value}
      </Text>
    </Paper>
  );
};

export default StatsCard;
