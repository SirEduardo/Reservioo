import { BusinessClosure, BusinessInfo } from "@/types"


export type SettingsState = {
    businessSlug: string
    company: BusinessInfo | null
    slugError: string | null
    slugSuccess: string
    loadingSlug: boolean
    selectedClosureStartDate: Date | null
    selectedClosureEndDate: Date | null
    closureReason: string
    closurePeriods: BusinessClosure[]
    loadingClosure: boolean
}

type SettingsAction = 
| { type: 'SET_SLUG'; payload: string }
| { type: 'SET_COMPANY'; payload: BusinessInfo | null }
| { type: 'SET_SLUG_ERROR'; payload: string | null }
| { type: 'SET_SLUG_SUCCESS'; payload: string }
| { type: 'SET_LOADING_SLUG'; payload: boolean }
| { type: 'SET_SELECTED_CLOSURE_DATES'; payload: { startDate: Date |null; endDate: Date | null } }
| { type: 'SET_CLOSURE_REASON'; payload: string }
| { type: 'ADD_CLOSURE'; payload: BusinessClosure | BusinessClosure[] }
| { type: 'DELETE_CLOSURE'; payload: string }
| { type: 'SET_LOADING_CLOSURE'; payload: boolean }
| { type: 'RESET_CLOSURE_FORM' }


export const SettingsReducer = (state: SettingsState, action: SettingsAction): SettingsState => {
    switch (action.type) {
        case 'SET_SLUG':
            return { ...state, businessSlug: action.payload }
        case 'SET_COMPANY':
            return { ...state, company: action.payload}
        case 'SET_SLUG_ERROR':
            return { ...state, slugError: action.payload }
        case 'SET_SLUG_SUCCESS':
            return { ...state, slugSuccess: action.payload }
        case 'SET_LOADING_SLUG':
            return { ...state, loadingSlug: action.payload }
        case 'SET_SELECTED_CLOSURE_DATES':
            return { ...state, 
                selectedClosureStartDate: action.payload.startDate,
                selectedClosureEndDate: action.payload.endDate
            }
        case 'SET_CLOSURE_REASON':
            return { ...state, closureReason: action.payload }
        case 'ADD_CLOSURE':
            return {
                ...state,
                closurePeriods: Array.isArray(action.payload)
                    ? action.payload
                    : [...state.closurePeriods, action.payload]
            }
        case 'DELETE_CLOSURE':
            return { ...state, closurePeriods: state.closurePeriods.filter(period => period.id !== action.payload) }
        case 'SET_LOADING_CLOSURE':
            return { ...state, loadingClosure: action.payload }
        case 'RESET_CLOSURE_FORM':
            return { ...state, closureReason: '', selectedClosureStartDate: null, selectedClosureEndDate: null }
        default:
            return state;
    }
}