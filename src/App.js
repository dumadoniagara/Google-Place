import './App.css';
import Container from '@mui/material/Container';
import Map from '../src/components/Map';

const App = (props) => {
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
