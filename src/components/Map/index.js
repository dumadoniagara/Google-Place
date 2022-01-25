import React from 'react';
import { GoogleApiWrapper, Map, InfoWindow, Marker } from 'google-maps-react';
import Box from '@mui/material/Box';
import MapAutoComplete from './MapAutoComplete';

export class MapContainer extends React.Component {
    state = {
        showingInfoWindow: true,
        activeMarker: {},
        mapsLoaded: true,
        map: {},
        mapsApi: {},
        autoCompleteService: {},
        placesService: {},
        geoCoderService: {},
        markers: {
            lat: 3.139003,
            lng: 101.686855,
            name: "Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
        },
        selectedPlace: {},
    };

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });

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

    addMarker = (lat, lng, name) => {
        const markers = { lat, lng, name }
        this.setState({ markers });
    };

    render() {
        const { autoCompleteService, geoCoderService, markers } = this.state;
        return (
            <div>
                <MapAutoComplete
                    autoCompleteService={autoCompleteService}
                    geoCoderService={geoCoderService}
                    markerName={(markers && markers.name) || ''}
                    addMarker={this.addMarker}
                />
                <Box sx={{ mt: '20px', display: 'flex', justifyContent: 'center' }}>
                    <Map
                        center={markers ? {
                            lat: markers.lat,
                            lng: markers.lng
                        } : null}
                        google={this.props.google}
                        onClick={this.onMapClicked}
                        containerStyle={{ width: 650, height: 550 }}
                        onReady={(mapProps, map) => this.apiHasLoaded(mapProps, map)}
                    >
                        {markers !== null &&
                            <Marker
                                onClick={this.onMarkerClick}
                                name={'Current location'}
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
        )
    }
}
export default GoogleApiWrapper({
    apiKey: ('AIzaSyDgbAWfq5T1O12EPpZrGSiJv-vM592Nihs')
})(MapContainer)