import './App.css';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as placeActions from '../src/actions/place';
import Container from '@mui/material/Container';
import MapAutoComplete from './components/Map/MapAutoComplete';
import Map from '../src/components/Map';

const App = (props) => {
  const places = useSelector(state => state.places);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(placeActions.setPlaces());
  }, [])

  return (
    <div className="App">
      <Container maxWidth="md">
        <h2>Place Autocomplete</h2>
        <Map />
      </Container>
    </div>
  );
}

export default App;
