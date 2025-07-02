
interface Identifiable {
    id: string
}

interface CrudState<T extends Identifiable>  {
    items: T[]
    loading: boolean
    error: string | null
}

type CrudAction<T> =
| { type: 'SET_ITEMS'; payload: T[] }
| { type: 'ADD_ITEMS'; payload: T }
| { type: 'REMOVE_ITEMS'; payload: string }
| { type: 'SET_LOADING'; payload: boolean }
| { type: 'SET_ERROR'; payload: string | null }

export function CrudReducer<T extends Identifiable>(state: CrudState<T>, action: CrudAction<T>): CrudState<T> {
    switch (action.type) {
        case 'SET_ITEMS':
            return { ...state, items: action.payload, loading: false }
        case 'ADD_ITEMS':
            return { ...state, items: [ ...state.items, action.payload ] }
        case 'REMOVE_ITEMS':
            return { ...state, items: state.items.filter(item => item.id !== action.payload) }
        case 'SET_LOADING':
            return { ...state, loading: action.payload }
        case 'SET_ERROR':
            return { ...state, error: action.payload }
        default:
            return state
    }
}