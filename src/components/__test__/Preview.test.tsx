import {screen} from '@testing-library/react';
import {StrictMode} from 'react';
import {RootStore, RootStoreContext} from '../../stores';
import {Preview} from '../Preview';
import {renderWithMobx, withThemeProvider} from '../../testing-tools/testing-tools.helpers';
import '@testing-library/jest-dom';

describe('<Preview />', () => {
  let rootStore: RootStore;
  beforeEach(() => {
    rootStore = RootStore.init();

    renderWithMobx<RootStore>(
      withThemeProvider(
        <StrictMode>
          <Preview />
        </StrictMode>,
      ),
      rootStore,
      RootStoreContext,
    );
  });
  it('should render without errors', async () => {
    expect(await screen.findByTestId(/^app-preview$/i)).toBeInTheDocument();
  });
  it('should render the placeholders when no data selected', async () => {
    expect(await screen.findByTestId(/^app-img-placeholder$/i)).toBeInTheDocument();
    expect(await screen.findByTestId(/^app-text-placeholder$/i)).toBeInTheDocument();
  });
});
