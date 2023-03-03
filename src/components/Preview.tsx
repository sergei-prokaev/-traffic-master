import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Fab from '@mui/material/Fab';
import FilterListIcon from '@mui/icons-material/FilterList';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {observer} from 'mobx-react-lite';
import {drawerStoreSlice, trafficStoreSlice, useContextRootStore} from '../stores';
import Stack from '@mui/material/Stack';
import {styled} from '@mui/material/styles';
import {Alert} from './Alert';
import Skeleton from '@mui/material/Skeleton';
import {COLORS_MAP} from '../utils';

const fabStyle = {
  position: 'fixed',
  bottom: 16,
  right: 16,
  zIndex: 1500,
  display: {
    sm: 'none',
    xs: 'flex',
  },
};

interface RootProps {
  bgColor?: string;
}

const StyledChip = styled('div', {
  shouldForwardProp: (prop) => prop !== 'bgColor',
})<RootProps>(({theme, bgColor}) => ({
  borderRadius: '50%',
  border: '1px solid gray',
  justifyContent: 'center',
  height: '25px',
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  maxWidth: '100%',
  alignItems: 'center',
  display: 'inline-flex',
  color: theme.palette.getContrastText(bgColor ?? '#fff'),
  backgroundColor: bgColor ?? theme.palette.grey[300],
}));

const StyledChipContent = styled('span')(() => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  paddingLeft: '12px',
  paddingRight: '12px',
  whiteSpace: 'nowrap',
  fontSize: '0.875rem',
}));

export const Preview = observer(() => {
  const rootStore = useContextRootStore();
  const {currentSelectedVehicle, isRejected$} = trafficStoreSlice(rootStore);
  const {setIsMobileOpen} = drawerStoreSlice(rootStore);
  return (
    <Box component='main' sx={{flexGrow: 1, p: 3, width: '100%'}}>
      <Toolbar />
      {isRejected$ && (
        <Alert severity='error' sx={{maxWidth: '500px', mb: '16px'}} data-testid='app-alert'>
          This is an error message!
        </Alert>
      )}
      <Card sx={{maxWidth: 500}} data-testid='app-preview'>
        {currentSelectedVehicle?.img ? (
          <CardMedia
            onError={(e: React.SyntheticEvent) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
            }}
            component='img'
            image={currentSelectedVehicle?.img ?? ''}
            alt={currentSelectedVehicle?.brand ?? ''}
          />
        ) : (
          <Skeleton variant='rectangular' animation={false} height={150} data-testid='app-img-placeholder' />
        )}
        <CardContent>
          {currentSelectedVehicle !== null ? (
            <>
              <Typography gutterBottom variant='h5' component='div'>
                {`Vehicle : ${currentSelectedVehicle?.brand ?? 'N/A'}`}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {`Type: ${currentSelectedVehicle?.type ?? 'N/A'}`}
              </Typography>
              <Stack direction={'row'} spacing={1} data-testid='preview-colors'>
                <Typography variant='body2' color='text.secondary' alignSelf='center'>
                  {`Colors:`}
                </Typography>
                {currentSelectedVehicle?.colors.map((color, index) => {
                  return (
                    <StyledChip key={index} bgColor={`${COLORS_MAP[color]}`}>
                      <StyledChipContent />
                    </StyledChip>
                  );
                }) ?? (
                  <Typography variant='body2' color='text.secondary' alignSelf='center'>
                    N/A
                  </Typography>
                )}
              </Stack>
            </>
          ) : (
            <Box sx={{pt: 0.5}} data-testid='app-text-placeholder'>
              <Skeleton width='60%' animation={false} />
              <Skeleton width='40%' animation={false} />
              <Skeleton width='50%' animation={false} />
            </Box>
          )}
        </CardContent>
      </Card>
      <Fab color='primary' aria-label='add' sx={fabStyle} onClick={setIsMobileOpen}>
        <FilterListIcon />
      </Fab>
    </Box>
  );
});
