import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { to } from 'await-to-js';
import queryString from 'query-string';

import Shared from '@/containers/Mobile/Shared';
import SearchNotFound from '@/containers/Mobile/Discovery/SearchNotFound';
import Scroller from '@/containers/Mobile/Shared/scroller';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import Filter from '@/containers/Mobile/Shared/Filter';
import Sort from '@/containers/Mobile/Shared/Sort';

import {
	Header,
	Page,
	Card,
	Svg,
	Tabs,
	Button, 
	Level, 
	Input, 
	Navigation,
	Spinner,
	Comment
} from '@/components/mobile';

import { actions as searchActions } from '@/state/v4/SearchResults';
import { actions as commentActions } from '@/state/v4/Comment';
import { actions as lovelistActions } from '@/state/v4/Lovelist';

import { hyperlink, renderIf } from '@/utils';
import stylesSearch from '../Search/search.scss';
import stylesCatalog from '../Category/Catalog/catalog.scss';


class SearchResults extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.isLogin = this.props.cookies.get('isLogin') || false;

		const propsObject = _.chain(props.searchResults);
		this.state = {
			notification: {
				show: true
			},
			showFilter: false,
			showSort: false,
			query: {
				q: '',
				brand_id: '',
				store_id: '',
				category_id: '',
				page: 0,
				per_page: 0,
				fq: '',
				sort: '',
				...propsObject.get('query').value()
			},
			productComment: ''
		};

		this.loadingView = <div style={{ margin: '20px auto 20px auto' }}><Spinner /></div>;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.query) {
			this.setState({
				query: nextProps.query
			});
		}
	}
	
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
		const { location } = this.props;
		const parsedUrl = queryString.parse(location.search);
		const keywordFromUrl = parsedUrl.query !== undefined ? parsedUrl.query : '';

		return keywordFromUrl;
	}

	update = async (params) => {
		const { cookies, dispatch, location, history } = this.props;
		const { query } = this.state;

		const parsedUrl = queryString.parse(location.search);
		const urlParam = {
			query: query.q,
			page: query.page,
			per_page: query.per_page,
			sort: query.sort,
			...parsedUrl,
			...params
		};

		const url = queryString.stringify(urlParam, {
			encode: false
		});
		history.push(`?${url}`);

		const searchParam = {
			...query,
			...params
		};

		const [err, response] = await to(dispatch(searchActions.searchAction({ token: cookies.get('user.token'), query: searchParam })));
		if (err) {
			dispatch(searchActions.promoAction(cookies.get('user.token')));
		}
		if (response) {
			if (!_.isEmpty(response.searchData.products)) {
				const productIdList = _.map(response.searchData.products, 'product_id') || null;
				dispatch(searchActions.bulkieCommentAction(cookies.get('user.token'), productIdList));
				dispatch(lovelistActions.bulkieCountByProduct(cookies.get('user.token'), productIdList));
			} else {
				dispatch(searchActions.promoAction(cookies.get('user.token')));
			}
		}
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
		if (e === 'view') {
			const { viewMode, dispatch } = this.props;
			const mode = viewMode.mode === 2 ? 1 : viewMode.mode + 1;
			dispatch(searchActions.viewModeAction(mode));
		} else {
			this.setState({
				showFilter: e === 'filter',
				showSort: e === 'sort'
			});
		}
	}

	writeComment(e) {
		this.setState({
			productComment: e.target.value
		});

	}

	postComment = async (e, productId) => {
		if (e.key === 'Enter') {
			const { dispatch, cookies, searchResults } = this.props;
			const { productComment } = this.state;

			dispatch(commentActions.commentAddAction(cookies.get('user.token'), productId, productComment));

			const productIdList = _.map(searchResults.searchData.products, 'product_id') || null;
			dispatch(searchActions.bulkieCommentAction(cookies.get('user.token'), productIdList));
		}
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
			const { scroller } = this.props;
			const productList = _.map(products, (product, index) => {
				return this.renderList(product, index);
			});

			return (
				<Page>
					<div className={stylesSearch.container} >
						<div className={stylesCatalog.cardContainer}>
							{productList}
							{scroller.loading && this.loadingView}
						</div>
					</div>
				</Page>
			);
		}

		return null;
	}

	renderPage() {
		const { searchResults } = this.props;
		const { showFilter } = this.state;

		if (showFilter) {
			return (
				<Filter
					shown={showFilter}
					filters={searchResults.searchData}
					onApply={(e, fq) => {
						this.onApply(e, fq);
					}}
					onClose={(e) => this.onClose(e)}
				/>
			);
		}

		return (
			<div style={this.props.style}>
				{this.renderSearch()}
				{this.renderHeader()}
				{this.renderTabs()}
				{this.renderForeverBanner()}
				<Navigation />
			</div>
		);
	}

	renderSearch() {
		let searchView = null;
		const { isLoading, searchResults } = this.props;

		if (isLoading) {
			searchView = this.loadingView;
		} 

		if (searchResults.searchStatus === 'success' && !_.isEmpty(searchResults.searchData.products)) {
			searchView = this.searchFound(searchResults.searchData.products);
		} else if (searchResults.searchStatus === 'failed' || (searchResults.searchStatus === 'success' && _.isEmpty(searchResults.searchData.products))) {
			searchView = this.searchNotFound();
		}

		return searchView;
	}

	renderList(productData, index) {
		if (productData) {
			const { isLoading, viewMode, searchResults, lovelist } = this.props;
			const linkToPdp = hyperlink('', ['product', productData.product_id], null);
			const commentData = !_.isEmpty(searchResults.commentData) ? _.find(searchResults.commentData, { product_id: productData.product_id }) : false;
			const commentTotal = commentData ? commentData.total : null;
			const lovelistData = !_.isEmpty(lovelist.bulkieCountProducts) ? _.find(lovelist.bulkieCountProducts, { product_id: productData.product_id }) : false;
			const lovelistTotal = lovelistData ? lovelistData.total : null;
			const lovelistStatus = lovelistData ? lovelistData.status : null;

			const listCardCatalogAttribute = {
				images: productData.images,
				productTitle: productData.product_title,
				brandName: productData.brand.name,
				pricing: productData.pricing,
				linkToPdp,
				commentTotal,
				commentUrl: `/product/comments/${productData.product_id}`,
				lovelistTotal,
				lovelistStatus
			};
			
			const cardCatalogGridAttribute = {
				key: index,
				images: productData.images,
				productTitle: productData.product_title,
				brandName: productData.brand.name,
				pricing: productData.pricing,
				linkToPdp,
				lovelistStatus
			};

			switch (viewMode.mode) {
			case 1:
				return (
					<div key={index} className={stylesCatalog.cardCatalog}>
						<Card.Catalog {...listCardCatalogAttribute} />
						{isLoading ? this.renderLoading : this.renderComment(productData.product_id)}
					</div>
				);
			case 2:
				return (
					<Card.CatalogGrid {...cardCatalogGridAttribute} />
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
		const { isLoading, searchResults } = this.props;

		if (isLoading) {
			commentView = this.loadingView;
		}

		const commentProduct = _.find(searchResults.commentData, { product_id: productId }) || false;
		const commentLink = commentProduct ? (
			<Link to={`/product/comments/${commentProduct.product_id}`}>
				<Button>View {commentProduct.total} comments</Button>
			</Link>
		) : '';
		const commentDetail = commentProduct ? (
			<Comment data={commentProduct.last_comment} type='lite-review' />
		) : '';

		commentView = (
			<div className={stylesCatalog.commentBlock}>
				{commentLink}
				{commentDetail}
				{this.renderAddComment(productId)}
			</div>
		);

		return commentView;
	}

	renderAddComment(productId) {
		let addCommentView = null;
		// if (this.isLogin === 'true') {
		// 	addCommentView = (
		// 		<Level>
		// 			<Level.Item>
		// 				<Input color='white' placeholder='Write comment' />
		// 			</Level.Item>
		// 		</Level>
		// 	);
		// } else {
		// 	addCommentView = (
		// 		<Level>
		// 			<Link to='/user/login'>Log in</Link> / <Link to='/user/register'>Register</Link> untuk memberi komentar
		// 		</Level>
		// 	);
		// }

		addCommentView = (
			<Level>
				<Level.Item>
					<Input color='white' placeholder='Write comment' onChange={(e) => this.writeComment(e)} onKeyPress={(e) => this.postComment(e, productId)} />
				</Level.Item>
			</Level>
		);

		return addCommentView;
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
		const { searchResults, viewMode } = this.props;
		const { showSort } = this.state;
		let tabsView = null;

		if (searchResults.searchData && !_.isEmpty(searchResults.searchData.products)) {
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
								title: <Svg src={viewMode.icon} />,
								disabled: searchResults.isLoading
							}
						]}
						onPick={e => this.handlePick(e)}
						isSticky
					/>
					{renderIf(sorts)(
						<Sort shown={showSort} sorts={sorts} onSort={(e, value) => this.sort(e, value)} />
					)}
				</div>
			);
		}

		return tabsView;
	}

	renderForeverBanner() {
		const { shared } = this.props;
		const foreverBannerData = shared.foreverBanner;
		foreverBannerData.show = this.state.notification.show;
		foreverBannerData.onClose = () => this.setState({ notification: { show: false } });

		return <ForeverBanner {...foreverBannerData} />;
	}

	render() {
		return this.renderPage();
	}
}

const mapStateToProps = (state) => {
	return {
		...state,
		shared: state.shared,
		searchResults: state.searchResults,
		promoData: state.searchResults.promoData,
		query: state.searchResults.query,
		comments: state.comments,
		isLoading: state.searchResults.isLoading,
		viewMode: state.searchResults.viewMode,
		scroller: state.scroller
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, location } = props;

	const parsedUrl = queryString.parse(location.search);
	const searchParam = {
		q: parsedUrl.query !== undefined ? parsedUrl.query : '',
		brand_id: parsedUrl.brand_id !== undefined && !_.isEmpty(parsedUrl.brand_id) ? parseInt(parsedUrl.brand_id, 10) : '',
		store_id: parsedUrl.store_id !== undefined && !_.isEmpty(parsedUrl.store_id) ? parseInt(parsedUrl.store_id, 10) : '',
		category_id: parsedUrl.category_id !== undefined && !_.isEmpty(parsedUrl.category_id) ? parseInt(parsedUrl.category_id, 10) : '',
		page: parsedUrl.page !== undefined && !_.isEmpty(parsedUrl.page) ? parseInt(parsedUrl.page, 10) : 1,
		per_page: parsedUrl.per_page !== undefined && !_.isEmpty(parsedUrl.per_page) ? parseInt(parsedUrl.per_page, 10) : 36,
		fq: parsedUrl.fq !== undefined ? parsedUrl.fq : '',
		sort: parsedUrl.sort !== undefined ? parsedUrl.sort : 'energy DESC',
	};

	const [err, response] = await to(dispatch(searchActions.searchAction({ token: cookies.get('user.token'), query: searchParam })));
	if (err) {
		dispatch(searchActions.promoAction(cookies.get('user.token')));
	}
	if (response) {
		if (!_.isEmpty(response.searchData.products)) {
			const productIdList = _.map(response.searchData.products, 'product_id') || null;
			dispatch(searchActions.bulkieCommentAction(cookies.get('user.token'), productIdList));
			dispatch(lovelistActions.bulkieCountByProduct(cookies.get('user.token'), productIdList));
		} else {
			dispatch(searchActions.promoAction(cookies.get('user.token')));
		}
	}
};

export default withCookies(connect(mapStateToProps)(Shared(Scroller(SearchResults), doAfterAnonymous)));
