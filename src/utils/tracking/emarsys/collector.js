import Emarsys from './core';
import Utils from './utils';

export default class Collector extends Emarsys {

	constructor() {
		super();
		this.init();
	}

	/**
	 * Init general commands on each page: init -> 'setEmail' -> 'cart'
	 */
	initGeneral() {
		if (!Utils.isScarabQueueSet()) this.initGeneral();
		this.ScarabQueue = window.ScarabQueue || [];
		this.setEmail().cart();
		return this;
	}

	/**
	 * Track general pages such us: 
	 * Home, Cart, Lovelist, HashTags, 404 pages etc.
	 */
	trackCommons() {
		this.initGeneral().go();
	}

	/**
	 * Track Product Catalog Page (PCP), Filter Page, Filter no Result
	 * @param {*} categoryPath 
	 */
	trackPCP(categoryPath) {
		this.initGeneral().category(categoryPath).go();
	}

	/**
	 * Track Product Detail Page
	 * @param {*} variantId 
	 */
	trackPDP(variantId) {
		this.initGeneral().view(variantId).go();
	}

	/**
	 * Track Search Page included Search Hashtags
	 * @param {*} term 
	 */
	trackSearch(term) {
		this.initGeneral().searchTerm(term).go();
	}

	/**
	 * Track Thank You Page
	 * @param {*} descriptor 
	 */
	trackPurchase(descriptor) {
		this.initGeneral().purchase(descriptor).go();
	}

	static get COMMONS_PAGE() {
		return 'commons';
	}

	static get PRODUCT_PAGE() {
		return 'pdp';
	}

	static get CATEGORY_PAGE() {
		return 'category';
	}

	static get SEARCH_PAGE() {
		return 'search';
	}

	static collect(page, data = null) {
		if (typeof window.emarsysMM === 'undefined') {
			window.emarsysMM = new Collector();
		}
		const emarysObj = window.emarsysMM;
		switch (page) {
		case Collector.COMMONS_PAGE:
			emarysObj.trackCommons();
			break;
		case Collector.PRODUCT_PAGE:
			emarysObj.trackPDP(data);
			break;
		case Collector.CATEGORY_PAGE:
			emarysObj.trackPCP(data);
			break;
		case Collector.SEARCH_PAGE:
			emarysObj.trackSearch(data);
			break;
		default:
			break;
		}
	}
}