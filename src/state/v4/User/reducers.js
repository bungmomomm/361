import { handleAction } from 'redux-actions'
import constants from './constants'

initialState = {
	isLoading: false
};

export default handleActions({
    constants.USER_LOGIN: (state, action) => ([
        ...state,
        action.payload,
        isLoading: true
    ]),
    constants.USER_LOGOUT: (state, action) => ([
        ...state,
        action.payload,
        isLoading: true
    ])
}, initialState )