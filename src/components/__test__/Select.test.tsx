import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {StrictMode} from 'react';
import {RootStore, RootStoreContext} from '../../stores';
import {MuiSelect} from '../Controls';
import {renderWithMobx, withThemeProvider} from '../../testing-tools/testing-tools.helpers';
import '@testing-library/jest-dom';

describe('<MuiSelect />', () => {
  let values: {label: string | number; id: string | number}[];
  let rootStore: RootStore;
  const onChangeHandler = () => {
    return null;
  };
  beforeEach(() => {
    rootStore = RootStore.init();
    values = [
      {
        label: 'Test1',
        id: 1,
      },
      {label: 'Test 2', id: 2},
      {label: 'Test3', id: 3},
    ];

    renderWithMobx<RootStore>(
      withThemeProvider(
        <StrictMode>
          <MuiSelect values={values} value='' label='test' onChangeHandler={onChangeHandler} name='test' />
        </StrictMode>,
      ),
      rootStore,
      RootStoreContext,
    );
  });
  it('should render without errors', async () => {
    expect(await screen.findByTestId(/^select-test$/i)).toBeInTheDocument();
  });
  it('should select correct value', async () => {
    const selectLabel = /test/i;
    const selectElement = await screen.findByLabelText(selectLabel);

    expect(selectElement).toBeInTheDocument();

    userEvent.click(selectElement);

    const optionsPopupEl = await screen.findByRole('listbox', {
      name: selectLabel,
    });

    userEvent.click(within(optionsPopupEl).getByText(/Test1/i));
    expect(await screen.findByText(/Test1/i)).toBeInTheDocument();
  });
});
