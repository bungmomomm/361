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
import Filter from '@/containers/Mobile/Shared/Filter';
import Sort from '@/containers/Mobile/Shared/Sort';
import { to } from 'await-to-js';
import Spinner from '@/components/mobile/Spinner';
import hyperlink from '@/utils/hyperlink';
import renderIf from '../../../../utils/renderIf';

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
		const propsObject = _.chain(props.searchResults);
		this.state = {
			listTypeState: this.listType[this.currentListState],
			showFilter: false,
			showSort: false,
			query: {
				per_page: 0,
				page: 0,
				q: '',
				brand_id: '',
				store_id: '',
				category_id: '',
				fq: '',
				sort: '',
				...propsObject.get('query').value()
			}
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.query) {
			this.setState({
				query: nextProps.query
			});
		}
	}

	// componentWillUnmount() {
	// 	const { dispatch } = this.props;
	// 	dispatch(new actions.loadingAction(true));
	// }
	
	async onApply(e, fq) {
		const { query } = this.state;
		query.fq = fq;
		this.setState({
			query,
			showFilter: false
		});
		this.update({
			fq
		});
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

	update(params) {
		const { shared, cookies, dispatch, location, history } = this.props;
		const { query } = this.state;

		const parsedUrl = queryString.parse(location.search);
		const urlParam = {
			query: query.q,
			sort: query.sort,
			per_page: query.per_page,
			page: query.page,
			...parsedUrl,
			...params
		};

		const url = queryString.stringify(urlParam, {
			encode: false
		});
		history.push(`products?${url}`);
		const searchService = _.chain(shared).get('serviceUrl.product').value() || false;
		const objParam = {
			...query,
			...params
		};
		dispatch(actions.searchAction(cookies.get('user.token'), searchService, objParam));
	}

	sort(e, sort) {
		this.setState({
			sort,
			showSort: false
		});
		this.update({
			sort: sort.q
		});
	}

	handlePick(e) {
		console.log(e);
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
					<Spinner />
				</div>
			);
		}

		return null;
	}

	searchNotFound() {
		const { promoData } = this.props;

		return (
			<SearchNotFound
				keyword={this.getKeyword()}
				data={promoData}
			/>
		);
	}

	searchFound(products) {
		if (products.length > 0) {
			const productList = _.map(products, (product, index) => {
				return this.renderList(product, index);
			});

			return (
				<Page>
					<div className={stylesSearch.container} >
						<div className={stylesCatalog.cardContainer}>
							{ productList }
						</div>
					</div>
				</Page>
			);
		}

		return null;
	}

	renderPage() {
		let pageView = null;
		const { searchResults } = this.props;
		const { showFilter } = this.state;
		if (showFilter) {
			pageView = (
				<Filter
					shown={showFilter}
					filters={searchResults.searchData}
					onApply={(e, fq) => {
						this.onApply(e, fq);
					}}
					onClose={(e) => this.onClose(e)}
				/>
			);
		} else {
			pageView = (
				<div style={this.props.style}>
					{this.renderSearch()}
					{this.renderHeader()}
					{this.renderTabs()}
					{this.renderForeverBanner()}
					<Navigation />

					{this.props.scroller.loading}
				</div>
			);
		}

		return pageView;
	}

	renderSearch() {
		let searchView = null;
		const { searchResults } = this.props;
		if (searchResults.searchStatus !== undefined && searchResults.searchStatus !== '') {
			if (searchResults.searchStatus === 'success' && searchResults.searchData.products.length > 0) {
				searchView = this.searchFound(searchResults.searchData.products);
			} else if (searchResults.searchStatus === 'failed') {
				searchView = this.searchNotFound();
			}
		}

		return searchView;
	}

	renderList(productData, index) {
		const { comments } = this.props;
		const { listTypeState } = this.state;
		if (productData) {
			switch (listTypeState.type) {
			case 'list':
				return (
					<div key={index} className={stylesCatalog.cardCatalog}>
						<Card.Catalog
							images={productData.images}
							productTitle={productData.product_title}
							brandName={productData.brand.name}
							pricing={productData.pricing}
							linkToPdp={hyperlink.product(productData.product_id, productData.product_title)}
						/>
						{comments && comments.loading ? <Spinner /> : this.renderComment(productData.product_id)}
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
						linkToPdp={hyperlink.product(productData.product_id, productData.product_title)}
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
		if (comments && comments.data.length > 0) {
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
		const { searchResults } = this.props;
		const { showSort } = this.state;
		let tabsView = null;
		const sorts = _.chain(searchResults).get('searchData.sorts').value() || [];
		tabsView = (
			<div>
				<Tabs
					className={stylesCatalog.filterBlockContainer}
					type='segment'
					variants={[
						{
							id: 'sort',
							title: 'Urutkan',
							disabled: typeof searchResults.searchData === 'undefined'
						},
						{
							id: 'filter',
							title: 'Filter',
							disabled: typeof searchResults.searchData === 'undefined'	
						},
						{
							id: 'view',
							title: <Svg src={this.state.listTypeState.icon} />,
							disabled: searchResults.isLoading
						}
					]}
					onPick={e => this.handlePick(e)}
				/>
				{renderIf(sorts)(
					<Sort shown={showSort} sorts={sorts} onSort={(e, value) => this.sort(e, value)} />
				)}
			</div>
		);
		return tabsView;
	}

	renderForeverBanner() {
		const { shared, dispatch } = this.props;

		return <ForeverBanner {...shared.foreverBanner} dispatch={dispatch} />;
	}

	render() {
		return this.renderPage();
	}
}

const mapStateToProps = (state) => {
	return {
		...state,
		query: state.searchResults.query,
		promoData: state.searchResults.promoData,
		isLoading: state.searchResults.isLoading
	};
};

const doAfterAnonymous = async (props) => {
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
		console.log(err);
		return err;
	}
	const promoService = _.chain(shared).get('serviceUrl.promo').value() || false;
	dispatch(actions.promoAction(cookies.get('user.token'), promoService));
	const productIdList = _.map(response.products, 'product_id') || null;
	const commentService = _.chain(shared).get('serviceUrl.productsocial').value() || false;
	dispatch(commentActions.bulkieCommentAction(cookies.get('user.token'), productIdList, commentService));
	return response;
};

export default withCookies(connect(mapStateToProps)(Shared(Scroller(SearchResults), doAfterAnonymous)));
