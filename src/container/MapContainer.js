import React from "react";
import Container from '@mui/material/Container';
import Map from '../components/Map';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { Box } from '@mui/material';

const MapContainer = () => {
    return (
        <Container maxWidth="md">
            <div className='text-header'>
                <h2 className='text-center'>Google Place Autocomplete</h2>
                <TravelExploreIcon style={{ width: '30px', height: '30px', color: '#474747' }} sx={{ ml: '10px' }} />
            </div>
            <Box sx={{ display: 'flex', justifyContent: 'center', fontSize: '18px' }}>
                <div>You can find your favorite place here !</div>
            </Box>
            <Map />
        </Container>
    )
}

export default MapContainer;