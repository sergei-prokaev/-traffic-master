import {screen} from '@testing-library/react';
import {StrictMode} from 'react';
import {RootStore, RootStoreContext} from '../../stores';
import {Header} from '../Header';
import {renderWithMobx, withThemeProvider} from '../../testing-tools/testing-tools.helpers';
import '@testing-library/jest-dom';

describe('<Header />', () => {
  let rootStore: RootStore;
  beforeEach(() => {
    rootStore = RootStore.init();
    renderWithMobx<RootStore>(
      withThemeProvider(
        <StrictMode>
          <Header />
        </StrictMode>,
      ),
      rootStore,
      RootStoreContext,
    );
  });
  it('should renders without errors', async () => {
    expect(await screen.findByTestId(/^app-header$/i)).toBeInTheDocument();
  });
});
