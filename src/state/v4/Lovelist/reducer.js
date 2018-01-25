import { handleActions, createActions } from 'redux-actions';

const defaultLovelist = {
	count: 0,
	items: {},
	user: {
		loggedIn: false,
		added: [],
		deleted: []
	},
	showHomeIcon: false,
	perVariant: {
		variantId: false,
		total: 0
	}
};

const { countLovelist, loveListItems, activeUser, lovelistPdp, addItem, removeItem } = createActions(
	'COUNT_LOVELIST', 'LOVE_LIST_ITEMS', 'ACTIVE_USER', 'LOVELIST_PDP', 'ADD_ITEM', 'REMOVE_ITEM'
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
	[lovelistPdp](state, { payload: { perVariant } }) {
		return {
			...state,
			perVariant
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
		user.added.push(removedItem);
		return {
			...state,
			user
		};
	}
};

const reducer = handleActions(listActions, defaultLovelist);

export default {
	reducer,
	countLovelist,
	loveListItems,
	activeUser,
	lovelistPdp,
	addItem,
	removeItem
};