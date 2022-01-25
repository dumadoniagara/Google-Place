export const SET_PLACES = 'SET_PLACES';
export const SET_MARKER = 'SET_MARKER';

export const setPlaces = (data) => {
    return {
        type: SET_PLACES,
        places: data,
    }
}

export const setMarker = (data) => {
    return {
        type: SET_MARKER,
        marker: data,
    }
}
