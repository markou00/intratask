import { MantineProvider, MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  colors: {
    reknes: [
      '#f5fde7',
      '#ebf7d5',
      '#d7efac',
      '#c1e67f',
      '#afde5a',
      '#a3d942',
      '#9dd733',
      '#88be25',
      '#77a81c',
      '#65920d',
    ],
  },
  primaryColor: 'reknes',
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
