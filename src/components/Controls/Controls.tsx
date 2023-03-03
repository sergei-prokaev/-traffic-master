import {useMemo} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import {observer} from 'mobx-react-lite';
import {useControlsController} from './useControlsController';
import ButtonUnstyled, {buttonUnstyledClasses} from '@mui/base/ButtonUnstyled';
import {styled} from '@mui/system';
import {MuiSelect} from './Select';
import Skeleton from '@mui/material/Skeleton';
import {useContextRootStore} from '../../stores';

const blue = {
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
};

const CustomButton = styled(ButtonUnstyled)`
  font-family: IBM Plex Sans, sans-serif;
  font-weight: bold;
  font-size: 0.875rem;
  background-color: ${blue[500]};
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: none;

  &:hover {
    background-color: ${blue[600]};
  }

  &.${buttonUnstyledClasses.active} {
    background-color: ${blue[700]};
  }

  &.${buttonUnstyledClasses.focusVisible} {
    box-shadow: 0 4px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 5px rgba(0, 127, 255, 0.5);
    outline: none;
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const capitalize = (str: string) => (str ? `${str[0].toUpperCase()}${str.slice(1)}` : '');
export const Controls = observer(function Controls() {
  const rootStore = useContextRootStore();
  const {
    vehicleColors,
    vehicleBrands,
    vehicleTypes,
    onChangeHandler,
    isFetching$,
    isMobileOpen,
    drawerWidth,
    clearHandler,
    selectedFilters$,
    setIsMobileOpen,
  } = useControlsController(rootStore);

  const drawer = useMemo(
    () => (
      <div>
        <Toolbar />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            margin: (theme) => theme.spacing(2),
            justifyContent: 'space-around',
            height: '100%',
          }}
        >
          <MuiSelect
            disabled={isFetching$}
            name={'type'}
            values={vehicleTypes}
            label='Types'
            onChangeHandler={onChangeHandler}
            value={selectedFilters$.type}
          />
          <MuiSelect
            disabled={isFetching$}
            name={'brand'}
            values={vehicleBrands}
            label='Brands'
            onChangeHandler={onChangeHandler}
            value={selectedFilters$.brand}
          />
          <MuiSelect
            disabled={isFetching$}
            name={'colors'}
            values={vehicleColors}
            label='Colors'
            onChangeHandler={onChangeHandler}
            value={selectedFilters$.colors}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              margin: (theme) => theme.spacing(0, 0.5),
              justifyContent: 'space-around',
            }}
          >
            {!selectedFilters$.type || !selectedFilters$.brand || !selectedFilters$.colors ? (
              <Skeleton width={'100%'} animation={false} />
            ) : (
              `${capitalize(selectedFilters$.type)} / ${capitalize(selectedFilters$.brand)} / ${capitalize(
                selectedFilters$.colors,
              )}`
            )}
          </Box>

          <CustomButton onClick={clearHandler} data-testid='app-clear-filter'>
            Clear Filters
          </CustomButton>
        </Box>
      </div>
    ),
    [clearHandler, isFetching$, onChangeHandler, vehicleBrands, vehicleColors, vehicleTypes, selectedFilters$],
  );

  return (
    <Box
      sx={{
        overflow: 'auto',
        width: {
          xs: 0,
          sm: `${drawerWidth}px`,
        },
        flex: '0 0 auto',
      }}
      aria-label='mailbox folders'
    >
      <Drawer
        anchor='bottom'
        variant='temporary'
        open={isMobileOpen}
        onClose={setIsMobileOpen}
        // ModalProps={{
        //   keepMounted: true,
        // }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          height: '100%',
          visibility: {xs: 'visible', sm: 'hidden'},
          display: 'flex',
          '& .MuiDrawer-paper': {boxSizing: 'border-box', width: '100%', height: 'calc(100% - 250px)'},
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant='permanent'
        sx={{
          display: {xs: 'none', sm: 'flex'},
          height: '100%',
          '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
});
