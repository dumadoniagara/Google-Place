const initState = {
    places: [],
    marker: {},
}

const places = (state = initState, action) => {
    switch (action.type) {
        case 'SET_PLACES':
            return {
                ...state,
                places: action.places,
            }
        case 'SET_MARKER':
            return {
                ...state,
                marker: action.marker,
            }
        default:
            return state;
    }
}


export default places;