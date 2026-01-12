import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext(null);
const AppDispatchContext = createContext(null);

const initialState = {
    query: '',
    results: [],
    selectedJournal: null,
    brief: null,
    loading: false,
    error: null
};

function appReducer(state, action) {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: true, error: null };

        case 'SET_ERROR':
            return { ...state, loading: false, error: action.payload };

        case 'SEARCH_SUCCESS':
            return {
                ...state,
                query: action.payload.query,
                results: action.payload.results,
                loading: false,
                error: null
            };

        case 'SELECT_JOURNAL':
            return {
                ...state,
                selectedJournal: action.payload,
                loading: false,
                error: null
            };

        case 'GENERATE_BRIEF_SUCCESS':
            return {
                ...state,
                brief: action.payload,
                loading: false,
                error: null
            };

        case 'CLEAR_BRIEF':
            return { ...state, brief: null };

        case 'CLEAR_ALL':
            return { ...initialState };

        default:
            return state;
    }
}

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppContext.Provider value={state}>
            <AppDispatchContext.Provider value={dispatch}>
                {children}
            </AppDispatchContext.Provider>
        </AppContext.Provider>
    );
}

export function useAppState() {
    const context = useContext(AppContext);
    if (context === null) {
        throw new Error('useAppState must be used within AppProvider');
    }
    return context;
}

export function useAppDispatch() {
    const context = useContext(AppDispatchContext);
    if (context === null) {
        throw new Error('useAppDispatch must be used within AppProvider');
    }
    return context;
}
