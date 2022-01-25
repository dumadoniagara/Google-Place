const initState = {
    places: [
        {
            id: 1,
            name: 'Bandung'
        },
        {
            id: 2,
            name: 'Jakarta'
        },
    ],
}

const places = (state = initState, action) => {
    switch (action.type) {
        case 'SET_PLACES':
            return {
                ...state,
                places: [...state.places, action.places]
            }
        default:
            return state;

    }
}


export default places;