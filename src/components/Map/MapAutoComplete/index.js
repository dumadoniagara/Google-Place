import React, { Component } from 'react';
import { connect } from 'react-redux';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import debounce from 'lodash/debounce';
import * as actions from '../../../store/actions';

class MapAutoComplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            markerName: null,
            loading: false
        }
        this.handleSearch = debounce(this.handleSearch, 500);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.markerName !== this.props.markerName) {
            this.setState({ markerName: this.props.markerName })
        }
        if (prevProps.places !== this.props.places) {
            this.setState({
                dataSource: this.props.places.places,
            })
        }
    }

    onSelect = ((value) => {
        this.props.geoCoderService.geocode({ address: value }, ((response) => {
            if (response && response[0] && response[0].geometry) {
                const { location } = response[0].geometry;
                const latitude = location && location.lat();
                const longitude = location && location.lng();
                this.setState({ markerName: value });
                const markerData = {
                    lat: latitude,
                    lng: longitude,
                    name: value,
                }
                this.props.setMarker(markerData);
            }
        }))
    });

    handleSearchValue = (value) => {
        this.setState({ markerName: value, loading: value.length > 2 }, () => this.handleSearch(value));
        this.props.setPlaces([]);
    }

    handleSearch = ((value) => {
        if (value.length > 2) {
            const searchQuery = {
                input: value,
            };
            this.props.autoCompleteService.getQueryPredictions(searchQuery, ((response) => {
                if (response) {
                    const dataSource = response.map((resp) => resp.description);
                    this.setState({ loading: false });
                    this.props.setPlaces(dataSource);
                }
            }));
        }
    });

    render() {
        const { dataSource } = this.state;
        return (
            <Autocomplete
                id="combo-box-maps"
                filterOptions={(x) => x}
                options={dataSource}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Find Place" />}
                onChange={(event, newValue) => { this.onSelect(newValue) }}
                onInputChange={(event, newInputValue) => this.handleSearch(newInputValue)}
            />
        );
    }
}

const mapStateToProps = (state, props) => ({
    places: state.places,
});

const mapDispatchToProps = (dispatch, props) => ({
    setPlaces: (data) => dispatch(actions.setPlaces(data)),
    setMarker: (data) => dispatch(actions.setMarker(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(MapAutoComplete);