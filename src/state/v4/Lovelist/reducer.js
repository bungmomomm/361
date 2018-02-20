import { handleActions, createActions } from 'redux-actions';

const defaultLovelist = {
	count: 0,
	items: {
		list: [],
		ids: []
	},
	user: {
		loggedIn: false,
		added: [],
		deleted: []
	},
	showHomeIcon: false,
	bulkieCountProducts: [],
	loading: false
};

const { countLovelist, loveListItems, activeUser, bulkieCount, addItem, removeItem, loadingState } = createActions(
	'COUNT_LOVELIST', 'LOVE_LIST_ITEMS', 'ACTIVE_USER', 'BULKIE_COUNT', 'ADD_ITEM', 'REMOVE_ITEM', 'LOADING_STATE'
);

const listActions = {
	// action used to get total number of lovelist
	[countLovelist](state, { payload: { count } }) {
		// set flag (state) for displaying lovelist icon
		state.showHomeIcon = (count > 0);
		return {
			...state,
			count
		};
	},
	[loveListItems](state, { payload: { items } }) {
		return {
			...state,
			items
		};
	},
	[activeUser](state, { payload: { user } }) {
		return {
			...state,
			user
		};
	},
	[bulkieCount](state, { payload: { bulkieCountProducts } }) {
		return {
			...state,
			bulkieCountProducts
		};
	},
	[addItem](state, { payload: { addedItem } }) {
		const user = state.user;
		// pushing added item
		user.added.push(addedItem);
		return {
			...state,
			user
		};
	},
	[removeItem](state, { payload: { removedItem } }) {
		const user = state.user;
		// pushing removed item
		user.deleted.push(removedItem);
		return {
			...state,
			user
		};
	},
	[loadingState](state, { payload: { loading } }) {
		return {
			...state,
			loading
		};
	}
};

const reducer = handleActions(listActions, defaultLovelist);

export default {
	reducer,
	countLovelist,
	loveListItems,
	activeUser,
	bulkieCount,
	addItem,
	removeItem,
	loadingState
};