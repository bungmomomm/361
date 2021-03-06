import { sessStorageKey, cartStorageKey, categoryGlue } from './config';

export default class Utils {

	static isPageLoaded = () => {
		return (window.document.readyState === 'complete');
	}

	static isScarabQueueSet = () => {
		return (typeof window.ScarabQueue !== 'undefined');
	}

	static notEmptyVal(value) {
		return (typeof value !== 'undefined' && value !== null && value !== '');
	}

	static isEmpty(value) {
		return (typeof value === 'undefined' || value === null || value === '');
	}

	static IsJsonString = (str) => {
		if (Utils.isEmpty(str)) return false;
		try { JSON.parse(str); } catch (e) { return false; }
		return true;
	}

	static isStorageAvailable(key) {
		try {
			const isCompatible = (typeof window.sessionStorage !== 'undefined' && typeof window.sessionStorage.getItem === 'function');
			return (isCompatible && sessionStorage.getItem(key) !== null &&
			Utils.IsJsonString(sessionStorage.getItem(key)));
		} catch (error) { return false; }
	}

	static extractEmail() {
		let visitorEmail = '';
		try {
			if (Utils.isStorageAvailable(sessStorageKey)) {
				const { info } = JSON.parse(sessionStorage.getItem(sessStorageKey));
				const emailExists = typeof info.email !== 'undefined' && Utils.notEmptyVal(info.email);
				if (emailExists) visitorEmail = info.email;
			}
		} catch (error) { ; }
		return visitorEmail;
	}

	static extractCart() {
		let cartList = [];
		try {
			if (Utils.isStorageAvailable(cartStorageKey)) {
				cartList = JSON.parse(sessionStorage.getItem(cartStorageKey));
			}
		} catch (error) { ; }
		return cartList;
	}

	static getCategoryPath(category, pcpData = {}) {
		const categoryPath = [];
		const { activeSegment, categories } = category;
		const { info } = pcpData;

		if (Utils.notEmptyVal(activeSegment) && Utils.notEmptyVal(activeSegment.title)) {
			categoryPath.push(activeSegment.title);
		}

		if (Utils.notEmptyVal(categories) && Array.isArray(categories) && Utils.notEmptyVal(category.sub_category)) {
			const selectedCategory = categories.find(cat => cat.id === category.sub_category);
			categoryPath.push(selectedCategory.title);
		}

		if (Utils.notEmptyVal(info) && Utils.notEmptyVal(info.title)) {
			categoryPath.push(info.title);
		}

		if (categoryPath.length > 0 && Utils.notEmptyVal(category.sub_category)) {
			return categoryPath.join(categoryGlue);
		}

		return null;
	}
}