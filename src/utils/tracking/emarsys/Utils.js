export class Utils {

	static isPageLoaded = () => {
		return (window.document.readyState === 'complete');
	}

	static isScarabQueueSet = () => {
		return (typeof window.ScarabQueue !== 'undefined');
	}

	static isTrackingReady = () => {
		return Utils.isScarabQueueSet() && Utils.isPageLoaded();
	}

	static notEmptyVal(value) {
		return (typeof value !== 'undefined' && value !== null && value !== '');
	}

	static isEmpty(value) {
		return (typeof value === 'undefined' || value === null || value === '');
	}
}