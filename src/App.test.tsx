import {RootStore, RootStoreContext} from './stores';
import {act, within, screen} from '@testing-library/react';
import {StrictMode} from 'react';
import App from './App';
import {renderWithMobx, withThemeProvider} from './testing-tools/testing-tools.helpers';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {sortByStringOrNumber} from './utils';

describe(`<App />`, () => {
  let rootStore: RootStore;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global.Math, 'random').mockReturnValue(2);
    rootStore = RootStore.init();
    renderWithMobx<RootStore>(
      withThemeProvider(
        <StrictMode>
          <App />
        </StrictMode>,
      ),
      rootStore,
      RootStoreContext,
    );
  });
  afterAll(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
    jest.useRealTimers();
    jest.clearAllTimers();
  });
  it('should renders without errors', async () => {
    expect(await screen.findByTestId(/^app$/i)).toBeInTheDocument();
  });
  it('should renders an alert if data loading error', async () => {
    act(() => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.1);
      jest.advanceTimersByTime(1000);
    });
    expect(screen.queryByTestId(/^app-alert$/i)).toBeInTheDocument();
  });
  it('should filter brands and colors items based on selected vehicle type', async () => {
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    const selectTypesEl = await screen.findByTestId(/^formcontrol-Types-select/i);
    const selectBrandsEl = await screen.findByTestId(/^formcontrol-Brands-select/i);
    const selectColorsEl = await screen.findByTestId(/^formcontrol-Colors-select/i);

    expect(screen.queryByTestId(/^app-alert$/i)).not.toBeInTheDocument();
    userEvent.click(within(selectTypesEl).getByLabelText('Types'));

    const typeOptionsPopupEl = await screen.findByRole('listbox');
    expect(typeOptionsPopupEl).toBeInTheDocument();

    userEvent.click(within(typeOptionsPopupEl).getByText(/^car$/i));
    expect(await screen.findByText(/^car$/i)).toBeInTheDocument();
    userEvent.click(within(selectBrandsEl).getByLabelText('Brands'));

    const brandOptionsPopupEl = await screen.findByRole('listbox');
    expect(brandOptionsPopupEl).toBeInTheDocument();

    const {getAllByRole: getAllBrands} = within(brandOptionsPopupEl);
    const brandItems = getAllBrands('option');
    const brandNames = brandItems.map((item) => item.textContent).sort(sortByStringOrNumber);
    expect(brandNames).toMatchInlineSnapshot(`
      Array [
        "Bugatti Veyron",
        "Ferrari F40",
        "Lamborghini Huracán",
        "Porsche Carrera GT",
      ]
    `);

    userEvent.click(within(selectColorsEl).getByLabelText('Colors'));
    const colorOptionsPopupEl = await screen.findByRole('listbox');
    expect(colorOptionsPopupEl).toBeInTheDocument();

    const {getAllByRole: getAllColors} = within(colorOptionsPopupEl);
    const colorItems = getAllColors('option');
    const colorNames = colorItems.map((item) => item.textContent).sort(sortByStringOrNumber);

    expect(colorNames).toMatchInlineSnapshot(`
      Array [
        "black",
        "green",
        "red",
        "white",
        "yellow",
      ]
    `);
  });

  it('should filter brands items based on selected vehicle type and vehicle color', async () => {
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    const selectTypesEl = await screen.findByTestId(/^formcontrol-Types-select/i);
    const selectBrandsEl = await screen.findByTestId(/^formcontrol-Brands-select/i);
    const selectColorsEl = await screen.findByTestId(/^formcontrol-Colors-select/i);

    expect(screen.queryByTestId(/^app-alert$/i)).not.toBeInTheDocument();
    userEvent.click(within(selectTypesEl).getByLabelText('Types'));
    const typeOptionsPopupEl = await screen.findByRole('listbox');

    expect(typeOptionsPopupEl).toBeInTheDocument();
    const selectedType = within(typeOptionsPopupEl).getByText(/^airplane$/i);

    userEvent.click(selectedType);
    expect(await screen.findByText(/^airplane$/i)).toBeInTheDocument();

    userEvent.click(within(selectBrandsEl).getByLabelText('Brands'));

    const brandOptionsPopupEl = await screen.findByRole('listbox');
    expect(brandOptionsPopupEl).toBeInTheDocument();

    const {getAllByRole: getAllBrands} = within(brandOptionsPopupEl);
    const brandItems = getAllBrands('option');
    const brandNames = brandItems.map((item) => item.textContent).sort(sortByStringOrNumber);
    expect(brandNames).toMatchInlineSnapshot(`
      Array [
        "Airbus A400M Atlas",
        "Bloch MB.131",
        "Boeing 787 Dreamliner",
        "Canadair North Star",
      ]
    `);

    userEvent.click(within(selectColorsEl).getByLabelText('Colors'));
    const colorOptionsPopupEl = await screen.findByRole('listbox');

    expect(colorOptionsPopupEl).toBeInTheDocument();
    const selectedColor = within(colorOptionsPopupEl).getByText(/^red$/i);

    userEvent.click(selectedColor);
    expect(await screen.findByText(/^red$/i)).toBeInTheDocument();

    userEvent.click(within(selectBrandsEl).getByLabelText('Brands'));

    const brandOptionsPopupEl2 = await screen.findByRole('listbox');
    expect(brandOptionsPopupEl2).toBeInTheDocument();

    const {getAllByRole: getAllBrands2} = within(brandOptionsPopupEl2);
    const brandItems2 = getAllBrands2('option');
    const brandNames2 = brandItems2.map((item) => item.textContent).sort(sortByStringOrNumber);
    expect(brandNames2).toMatchInlineSnapshot(`
      Array [
        "Airbus A400M Atlas",
        "Boeing 787 Dreamliner",
        "Canadair North Star",
      ]
    `);
  });

  it('should filter brands and types based on selected vehicle color', async () => {
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    const selectTypesEl = await screen.findByTestId(/^formcontrol-Types-select/i);
    const selectBrandsEl = await screen.findByTestId(/^formcontrol-Brands-select/i);
    const selectColorsEl = await screen.findByTestId(/^formcontrol-Colors-select/i);

    expect(screen.queryByTestId(/^app-alert$/i)).not.toBeInTheDocument();
    userEvent.click(within(selectColorsEl).getByLabelText('Colors'));
    const colorsOptionsPopupEl = await screen.findByRole('listbox');

    expect(colorsOptionsPopupEl).toBeInTheDocument();
    const selectedColor = within(colorsOptionsPopupEl).getByText(/^blue$/i);
    userEvent.click(selectedColor);

    expect(await screen.findByTestId(/^select-colors$/i)).toHaveValue('blue');

    userEvent.click(within(selectTypesEl).getByLabelText('Types'));
    const typesOptionsPopupEl = await screen.findByRole('listbox');

    expect(typesOptionsPopupEl).toBeInTheDocument();

    const {getAllByRole: getAllTypes} = within(typesOptionsPopupEl);
    const typeItems = getAllTypes('option');
    const typeNames = typeItems.map((item) => item.textContent).sort(sortByStringOrNumber);
    expect(typeNames).toMatchInlineSnapshot(`
      Array [
        "airplane",
      ]
    `);

    userEvent.click(within(selectBrandsEl).getByLabelText('Brands'));
    const brandOptionsPopupEl = await screen.findByRole('listbox');

    expect(brandOptionsPopupEl).toBeInTheDocument();

    const {getAllByRole: getAllBrands} = within(brandOptionsPopupEl);
    const brandItems = getAllBrands('option');
    const brandNames = brandItems.map((item) => item.textContent).sort(sortByStringOrNumber);
    expect(brandNames).toMatchInlineSnapshot(`
      Array [
        "Bloch MB.131",
        "Canadair North Star",
      ]
    `);
  });

  it('should clear all filters', async () => {
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.queryByTestId(/^app-alert$/i)).not.toBeInTheDocument();

    const btn = await screen.findByTestId(/^app-clear-filter$/i);

    const selectTypesEl = await screen.findByTestId(/^formcontrol-Types-select/i);
    const selectBrandsEl = await screen.findByTestId(/^formcontrol-Brands-select/i);
    const selectColorsEl = await screen.findByTestId(/^formcontrol-Colors-select/i);

    expect(screen.queryByTestId(/^app-alert$/i)).not.toBeInTheDocument();
    userEvent.click(within(selectTypesEl).getByLabelText('Types'));
    const typeOptionsPopupEl = await screen.findByRole('listbox');

    expect(typeOptionsPopupEl).toBeInTheDocument();
    const selectedType = within(typeOptionsPopupEl).getByText(/^car$/i);

    userEvent.click(selectedType);
    expect(await screen.findByTestId(/^select-type$/i)).toHaveValue('car');

    userEvent.click(within(selectBrandsEl).getByLabelText('Brands'));

    const brandOptionsPopupEl = await screen.findByRole('listbox');
    expect(brandOptionsPopupEl).toBeInTheDocument();

    const selectedBrand = within(brandOptionsPopupEl).getByText(/^Bugatti Veyron$/i);

    userEvent.click(selectedBrand);
    expect(await screen.findByTestId(/^select-brand$/i)).toHaveValue('Bugatti Veyron');

    userEvent.click(within(selectColorsEl).getByLabelText('Colors'));
    const colorOptionsPopupEl = await screen.findByRole('listbox');

    expect(colorOptionsPopupEl).toBeInTheDocument();
    const selectedColor = within(colorOptionsPopupEl).getByText(/^black$/i);

    userEvent.click(selectedColor);
    expect(await screen.findByTestId(/^select-colors$/i)).toHaveValue('black');

    userEvent.click(btn);
    expect(await screen.findByTestId(/^select-type$/i)).toHaveValue('');
    expect(await screen.findByTestId(/^select-brand$/i)).toHaveValue('');
    expect(await screen.findByTestId(/^select-colors$/i)).toHaveValue('');
  });
});
