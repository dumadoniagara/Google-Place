import React, { Component } from 'react';
// import { AutoComplete, Spin } from 'antd';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import debounce from 'lodash/debounce';

const KEY_GOOGLE_MAPS = 'AIzaSyDgbAWfq5T1O12EPpZrGSiJv-vM592Nihs';

class MapAutoComplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestionts: [],
            dataSource: [],
            singaporeLatLng: this.props.singaporeLatLng,
            autoCompleteService: this.props.autoCompleteService,
            geoCoderService: this.props.geoCoderService,
            markerName: this.props.markerName,
            loading: false
        }

        this.handleSearch = debounce(this.handleSearch, 500);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.markerName !== this.props.markerName) {
            this.setState({ markerName: this.props.markerName })
        }
    }

    onSelect = ((value) => {
        this.props.geoCoderService.geocode({ address: value }, ((response) => {
            if (response && response[0] && response[0].geometry) {
                const { location } = response[0].geometry;
                const latitude = location && location.lat();
                const longitude = location && location.lng();
                this.setState({ markerName: value });
                this.props.addMarker(latitude, longitude, value);
            }
        }))
    });

    handleSearchValue = (value) => {
        this.setState({ markerName: value, dataSource: [], loading: value.length > 4 }, () => this.handleSearch(value))
    }

    handleSearch = ((value) => {
        if (value.length > 4) {
            const searchQuery = {
                input: value,
            };
            this.props.autoCompleteService.getQueryPredictions(searchQuery, ((response) => {
                if (response) {
                    const dataSource = response.map((resp) => resp.description);
                    this.setState({ dataSource, suggestions: response, loading: false });
                }
            }));
        }
    });

    onSelectPlace = () => {

    }

    render() {
        const { dataSource, markerName, loading } = this.state;
        return (
            <Autocomplete
                id="combo-box-maps"
                options={dataSource}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Find Place" />}
                onChange={(event, newValue) => { this.onSelect(newValue) }}
                onInputChange={(event, newInputValue) => this.handleSearch(newInputValue)}
            />
        );
    }
}

export default MapAutoComplete;