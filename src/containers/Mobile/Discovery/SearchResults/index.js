import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import _ from 'lodash';
import { Header, Page, Card, Svg, Tabs, Navigation, Comment } from '@/components/mobile';
import stylesSearch from '../Search/search.scss';
import stylesCatalog from '../Category/Catalog/catalog.scss';
import { actions } from '@/state/v4/SearchResults';
import queryString from 'query-string';
import Shared from '@/containers/Mobile/Shared';
import SearchNotFound from '@/containers/Mobile/Discovery/SearchNotFound';
import Scroller from '@/containers/Mobile/Shared/scroller';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';

import { actions as filterActions } from '@/state/v4/SortFilter';
import Filter from '@/containers/Mobile/Shared/Filter';
import Sort from '@/containers/Mobile/Shared/Sort';
import { to } from 'await-to-js';
// import Spinner from '../../../../components/mobile/Spinner';

import { actions as commentActions } from '@/state/v4/Comment';

class SearchResults extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.currentListState = 1;
		this.listType = [{
			type: 'grid',
			icon: 'ico_list.svg'
		}, {
			type: 'list',
			icon: 'ico_grid.svg'
		}];
		this.state = {
			listTypeState: this.listType[this.currentListState],
			notification: {
				show: true
			},
			showFilter: false,
			showSort: false
		};
	}

	// componentWillUnmount() {
	// 	const { dispatch } = this.props;
	// 	dispatch(new actions.loadingAction(true));
	// }

	async onApply(e) {
		console.log('onApply called');
		const { dispatch, cookies, filters } = this.props;
		const [err, response] = await to(dispatch(new filterActions.applyFilter(cookies.get('user.token'), 'search', filters)));
		console.log(err, response);
		if (err) {
			return err;
		}
		this.setState({
			showFilter: false
		});
		console.log(response);
		return response;
	}

	onUpdateFilter(e, type, value) {
		try {
			this.props.dispatch(new filterActions.updateFilter(type, value));
		} catch (error) {
			console.log(error);
		}
	}

	onReset(e) {
		this.props.dispatch(new filterActions.resetFilter());
	}

	onClose(e) {
		this.setState({
			showFilter: false
		});
	}

	getKeyword() {
		const parsedUrl = queryString.parse(this.props.location.search);
		const keywordFromUrl = parsedUrl.query !== undefined ? parsedUrl.query : '';

		return keywordFromUrl;
	}

	sort(e, value) {
		this.setState({
			showSort: false
		});
		this.props.dispatch(new filterActions.updateSort(value));
	}

	handlePick(e) {
		if (e === 'view') {
			this.currentListState = this.currentListState === 1 ? 0 : this.currentListState + 1;
			this.setState({ listTypeState: this.listType[this.currentListState] });
		} else {
			this.setState({
				showFilter: e === 'filter',
				showSort: e === 'sort'
			});
		}
	}

	loadingRender() {
		if (this.props.isLoading === true) {
			return (
				<div style={this.props.style}>
					&nbsp;
				</div>
			);
		}

		return null;
	}

	searchNotFound() {
		const { shared, promoData } = this.props;
		const foreverBannerData = shared.foreverBanner;
		foreverBannerData.show = this.state.notification.show;
		foreverBannerData.onClose = () => this.setState({ notification: { show: false } });

		return (
			<div style={this.props.style}>
				<SearchNotFound
					keyword={this.getKeyword()}
					data={promoData}
				/>
				{this.renderHeader()}
				<ForeverBanner {...foreverBannerData} />
				<Navigation />
			</div>
		);
	}

	searchFound(products) {
		if (products.length > 0) {
			const { shared, filters } = this.props;
			const { showSort } = this.state;
			const foreverBannerData = shared.foreverBanner;
			foreverBannerData.show = this.state.notification.show;
			foreverBannerData.onClose = () => this.setState({ notification: { show: false } });

			return (
				<div style={this.props.style}>
					<Page>
						<div className={stylesSearch.container} >
							<div className={stylesCatalog.cardContainer}>
								{
									products.map((product, index) =>
										this.renderList(product, index)
									)
								}
							</div>
						</div>
						<Sort shown={showSort} sorts={filters.sorts} onSelected={(e, value) => this.sort(e, value)} />
					</Page>
					{this.renderHeader()}
					{this.renderTabs()}
					{
						<ForeverBanner {...foreverBannerData} />
					}
					<Navigation />

					{this.props.scroller.loading}
				</div>
			);
		}

		return null;
	}

	searchRender() {
		let searchView = null;
		const { searchResults, filters } = this.props;
		const { showFilter } = this.state;
		if (typeof searchResults.searchStatus !== 'undefined' && searchResults.searchStatus !== '') {
			if (searchResults.searchStatus === 'success' && searchResults.searchData.products.length > 0) {
				if (showFilter) {
					searchView = (
						<Filter
							shown={showFilter}
							filters={filters}
							onUpdateFilter={(e, type, value) => this.onUpdateFilter(e, type, value)}
							onApply={(e) => {
								this.onApply(e);
							}}
							onReset={(e) => this.onReset(e)}
							onClose={(e) => this.onClose(e)}
						/>
					);
				} else {
					searchView = this.searchFound(searchResults.searchData.products);
				}
			} else if (searchResults.searchStatus === 'failed') {
				searchView = this.searchNotFound();
			}
		}

		return searchView;
	}

	renderList(productData, index) {
		if (productData) {
			switch (this.state.listTypeState.type) {
			case 'list':
				return (
					<div key={index} className={stylesCatalog.cardCatalog}>
						<Card.Catalog
							images={productData.images}
							productTitle={productData.product_title}
							brandName={productData.brand}
							pricing={productData.pricing}
						/>
						{this.renderComment(productData.product_id)}
					</div>
				);
			case 'grid':
				return (
					<Card.CatalogGrid
						key={index}
						images={productData.images}
						productTitle={productData.product_title}
						brandName={productData.brand}
						pricing={productData.pricing}
					/>
				);
			default:
				return null;
			}
		} else {
			return null;
		}
	}

	renderComment(productId) {
		let commentView = null;
		const { comments } = this.props;
		if (productId) {
			const commentById = _.find(comments.data, { product_id: productId }) || null;
			commentView = (
				<Comment
					className={stylesCatalog.commentBlock}
					type='comment_summary'
					data={commentById}
				/>
			);
		}

		return commentView;
	}

	renderHeader() {
		let back = () => { this.props.history.go(-2); };
		if (this.props.history.length === 0) {
			back = () => { this.props.history.push('/'); };
		}

		return (
			<Header.SearchResult
				back={back}
				value={this.getKeyword() || ''}
			/>
		);
	}

	renderTabs() {
		let tabsView = null;
		const searchResults = this.props.searchResults;
		if (typeof searchResults.searchStatus !== 'undefined' && searchResults.searchStatus !== '' && searchResults.searchStatus === 'success') {
			tabsView = (
				<Tabs
					className={stylesCatalog.fixed}
					type='segment'
					variants={[
						{
							id: 'sort',
							title: 'Urutkan'
						},
						{
							id: 'filter',
							title: 'Filter'
						},
						{
							id: 'view',
							title: <Svg src={this.state.listTypeState.icon} />
						}
					]}
					onPick={e => this.handlePick(e)}
				/>
			);
		}

		return tabsView;
	}

	render() {
		return this.props.isLoading ? this.loadingRender() : this.searchRender();
	}
}

const mapStateToProps = (state) => {
	return {
		...state,
		shared: state.shared,
		searchResults: state.searchResults,
		comments: state.comments,
		promoData: state.searchResults.promoData,
		isLoading: state.searchResults.isLoading,
		scroller: state.scroller
	};
};

const doAfterAnonymous = async (props) => {
	console.log(props);
	const { shared, dispatch, cookies, location } = props;

	const searchService = _.chain(shared).get('serviceUrl.product').value() || false;
	const parsedUrl = queryString.parse(location.search);
	const objParam = {
		q: parsedUrl.query !== undefined ? parsedUrl.query : '',
		brand_id: parsedUrl.brand_id !== undefined ? parseInt(parsedUrl.brand_id, 10) : '',
		store_id: parsedUrl.store_id !== undefined ? parseInt(parsedUrl.store_id, 10) : '',
		category_id: parsedUrl.category_id !== undefined ? parseInt(parsedUrl.category_id, 10) : '',
		page: parsedUrl.page !== undefined ? parseInt(parsedUrl.page, 10) : 1,
		per_page: parsedUrl.per_page !== undefined ? parseInt(parsedUrl.per_page, 10) : 10,
		fq: parsedUrl.fq !== undefined ? parsedUrl.fq : '',
		sort: parsedUrl.sort !== undefined ? parsedUrl.sort : 'energy DESC',
	};
	
	const [err, response] = await to(dispatch(actions.searchAction(cookies.get('user.token'), searchService, objParam)));

	if (err) {
		console.log(err.message);

		const promoService = _.chain(shared).get('serviceUrl.promo').value() || false;
		dispatch(actions.promoAction(cookies.get('user.token'), promoService));
	} else {
		const productIdList = _.map(response.products, 'product_id') || null;
		const commentService = _.chain(shared).get('serviceUrl.productsocial').value() || false;
		dispatch(commentActions.bulkieCommentAction(cookies.get('user.token'), productIdList, commentService));

		dispatch(filterActions.initializeFilter(response));
	}
};

export default withCookies(connect(mapStateToProps)(Shared(Scroller(SearchResults), doAfterAnonymous)));
