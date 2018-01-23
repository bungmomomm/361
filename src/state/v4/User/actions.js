import { createAction } from 'redux-actions'
import constants from './constants'

const userLogin = createAction(constants.USER_LOGIN)
const userLogout = createAction(constants.USER_LOGOUT)

export default {
	userLogin,
	userLogout
}