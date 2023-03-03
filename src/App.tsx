import {useEffect} from 'react';
import {useContextRootStore, trafficStoreSlice} from './stores';
import {Header, Controls, Preview} from './components';
import Box from '@mui/material/Box';

const App = () => {
  const rootStore = useContextRootStore();
  const {fetchVehicles} = trafficStoreSlice(rootStore);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return (
    <Box sx={{display: 'flex'}} data-testid='app'>
      <Header />
      <Controls />
      <Preview />
    </Box>
  );
};

export default App;
