import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {useContextRootStore, drawerStoreSlice} from '../stores';
import {observer} from 'mobx-react-lite';

export const Header = observer(function Header() {
  const rootStore = useContextRootStore();
  const {drawerWidth} = drawerStoreSlice(rootStore);

  return (
    <AppBar
      data-testid='app-header'
      position='fixed'
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexShrink: 0,
        ml: {sm: `${drawerWidth}px`},
      }}
    >
      <Toolbar>
        <Typography variant='h6' noWrap component='div'>
          Traffic Master
        </Typography>
      </Toolbar>
    </AppBar>
  );
});
