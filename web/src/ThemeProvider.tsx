import { MantineProvider, MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  colors: {
    teams: [
      '#eef1ff',
      '#dcdef6',
      '#b7bae5',
      '#8f94d4',
      '#6d73c6',
      '#595fbe',
      '#4d55bb',
      '#3e46a5',
      '#363e95',
      '#2b3485',
    ],
  },
  primaryColor: 'teams',
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      {children}
    </MantineProvider>
  );
}
