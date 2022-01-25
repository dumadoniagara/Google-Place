import React from 'react';
import { GoogleApiWrapper, Map, InfoWindow, Marker } from 'google-maps-react';
import Box from '@mui/material/Box';
import MapAutoComplete from './MapAutoComplete';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

const GOOGLE_API_KEY = 'AIzaSyDgbAWfq5T1O12EPpZrGSiJv-vM592Nihs';
export class MapComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: true,
            activeMarker: {},
            mapsLoaded: true,
            map: {},
            mapsApi: {},
            autoCompleteService: {},
            placesService: {},
            geoCoderService: {},
            markers: {
                // initial marker location
                lat: 3.139003,
                lng: 101.686855,
                name: "Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
            },
            selectedPlace: {},
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.marker !== this.props.marker) {
            this.setState({
                markers: this.props.marker
            })
        }
    }

    onMarkerClick = (props, marker, e) => {
        const selectedPlace = {
            ...props,
            name: props.name.description ? props.name.description : props.name,
        }
        this.setState({
            selectedPlace: selectedPlace,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }


    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
    };

    apiHasLoaded = (mapsApi, map) => {
        const { google } = mapsApi;
        this.setState({
            mapsLoaded: true,
            map,
            mapsApi,
            autoCompleteService: new google.maps.places.AutocompleteService(),
            placesService: new google.maps.places.PlacesService(map),
            geoCoderService: new google.maps.Geocoder(),
        });
    }

    render() {
        const { autoCompleteService, geoCoderService, markers } = this.state;
        return (
            <Box sx={{ mt: '10px' }}>
                <div>
                    <MapAutoComplete
                        autoCompleteService={autoCompleteService}
                        geoCoderService={geoCoderService}
                        markerName={(markers && markers.name) || ''}
                        addMarker={this.addMarker}
                    />
                    <Box className='box-map-wrapper' sx={{ mt: '20px', display: 'flex', justifyContent: 'center' }}>
                        <Map
                            center={markers ? {
                                lat: markers.lat,
                                lng: markers.lng
                            } : null}
                            google={this.props.google}
                            onClick={this.onMapClicked}
                            containerStyle={{
                                width: '90%',
                                height: '550px',
                                borderRadius: '20px',
                                overflow: 'hidden'
                            }}
                            onReady={(mapProps, map) => this.apiHasLoaded(mapProps, map)}
                        >
                            {markers !== null &&
                                <Marker
                                    onClick={this.onMarkerClick}
                                    position={{ lat: markers.lat, lng: markers.lng }}
                                    name={markers.name}
                                />
                            }
                            <InfoWindow
                                marker={this.state.activeMarker}
                                visible={this.state.showingInfoWindow}>
                                <div>
                                    <div>{this.state.selectedPlace.name}</div>
                                </div>
                            </InfoWindow>
                        </Map>
                    </Box>
                </div>
            </Box>
        )
    }
}

const mapStateToProps = (state, props) => ({
    places: state.places.places,
    marker: state.places.marker,
});

const mapDispatchToProps = (dispatch, props) => ({
    setPlaces: (data) => dispatch(actions.setPlaces(data)),
});

export default GoogleApiWrapper({
    apiKey: (GOOGLE_API_KEY)
})(connect(mapStateToProps, mapDispatchToProps)(MapComponent))