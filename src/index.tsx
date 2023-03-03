import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {RootStoreContext, RootStore} from './stores';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {theme} from './theme';

const store = RootStore.init();
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <RootStoreContext.Provider value={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </RootStoreContext.Provider>
  </React.StrictMode>,
);
