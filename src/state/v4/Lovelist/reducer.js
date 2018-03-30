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
	lovedEmpty: false,
	bulkieCountProducts: [],
	loading: false
};

const { countLovelist, loveListItems, activeUser, bulkieCount, addItem, removeItem, loadingState, lovelistEmpty } = createActions(
	'COUNT_LOVELIST', 'LOVE_LIST_ITEMS', 'ACTIVE_USER', 'BULKIE_COUNT', 'ADD_ITEM', 'REMOVE_ITEM', 'LOADING_STATE', 'LOVELIST_EMPTY'
);

const listActions = {
	// action used to get total number of lovelist
	[countLovelist](state, { payload: { count } }) {
		return {
			...state,
			count
		};
	},
	[loveListItems](state, { payload: { items, type } }) {
		if (type === 'update') {
			const { ids, list } = items;
			items.list = state.items.list.concat(list);
			items.ids = state.items.ids.concat(ids);
		}

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
		// pushing added item
		const { user } = state;
		user.added.push(addedItem);
		return {
			...state,
			user
		};
	},
	[removeItem](state, { payload: item }) {
		// pushing removed item
		const { user } = state;
		user.deleted.push(item.productId);

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
	},
	[lovelistEmpty](state, { payload: { lovedEmpty } }) {
		return {
			...state,
			lovedEmpty
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
	loadingState,
	lovelistEmpty
};