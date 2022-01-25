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
        const description = value && value.description;
        this.props.geoCoderService.geocode({ address: description }, ((response) => {
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
                    const dataSource = response;
                    this.setState({ loading: false });
                    this.props.setPlaces(dataSource);
                }
            }));
        }
    });

    render() {
        const { dataSource } = this.state;
        return (
            <div className='autocomplete-wrapper'>
                <Autocomplete
                    id="combo-box-maps"
                    className="autocomplete"
                    filterOptions={(x) => x}
                    options={dataSource}
                    getOptionLabel={(option) =>
                        typeof option === 'string' ? option : option.description
                    }
                    sx={{ width: '100%' }}
                    renderInput={(params) => <TextField autoFocus {...params} label="Find Place" />}
                    onChange={(event, newValue) => { this.onSelect(newValue) }}
                    onInputChange={(event, newInputValue) => this.handleSearch(newInputValue)}
                    renderOption={(props, option) => {
                        const matches = option.structured_formatting.main_text_matched_substrings;
                        const parts = parse(
                            option.structured_formatting.main_text,
                            matches.map((match) => [match.offset, match.offset + match.length]),
                        );
                        return (
                            <li {...props}>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Box
                                            component={LocationOnIcon}
                                            sx={{ color: 'text.secondary', mr: 2 }}
                                        />
                                    </Grid>
                                    <Grid item xs>
                                        {parts.map((part, index) => (
                                            <span
                                                key={index}
                                                style={{
                                                    fontWeight: part.highlight ? 700 : 400,
                                                }}
                                            >
                                                {part.text}
                                            </span>
                                        ))}

                                        <Typography variant="body2" color="text.secondary">
                                            {option.structured_formatting.secondary_text}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </li>
                        );
                    }}
                />
            </div>
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