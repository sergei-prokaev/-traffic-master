import {Context, ReactElement} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import {theme} from '../theme';
import {render, RenderOptions} from '@testing-library/react';

export const withThemeProvider = (component: ReactElement) => <ThemeProvider theme={theme}>{component}</ThemeProvider>;

export const renderWithMobx = <S,>(component: ReactElement, store: S, Context: Context<S>, options?: RenderOptions) => {
  return {
    ...render(<Context.Provider value={store}>{component}</Context.Provider>, {
      ...options,
    }),
  };
};
