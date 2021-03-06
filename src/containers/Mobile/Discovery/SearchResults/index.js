import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import _ from 'lodash';
import { to } from 'await-to-js';
import queryString from 'query-string';

import Shared from '@/containers/Mobile/Shared';
import SearchNotFound from '@/containers/Mobile/Discovery/SearchNotFound';
import Scroller from '@/containers/Mobile/Shared/scroller';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import Footer from '@/containers/Mobile/Shared/footer';
import { Filter, Sort } from '@/containers/Mobile/Widget';
import {
	CatalogView,
	GridView,
} from '@/containers/Mobile/Discovery/View';

import {
	Header,
	Page,
	Svg,
	Tabs,
	Navigation,
	Spinner,
} from '@/components/mobile';

import { actions as actionSearch } from '@/state/v4/Search';
import { actions as searchActions } from '@/state/v4/SearchResults';
import { actions as commentActions } from '@/state/v4/Comment';
import { actions as lovelistActions } from '@/state/v4/Lovelist';

// TODO util management
import Discovery from '../Utils';
import { urlBuilder, renderIf } from '@/utils';
import { Collector } from '@/utils/tracking/emarsys';
import cookiesLabel from '@/data/cookiesLabel';

import handler from '@/containers/Mobile/Shared/handler';

@handler
class SearchResults extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.isLogin = this.props.cookies.get(cookiesLabel.isLogin) === 'true';

		const propsObject = _.chain(props.searchResults);
		this.state = {
			showFilter: false,
			showSort: false,
			query: {
				q: '',
				brand_id: '',
				store_id: '',
				category_id: '',
				page: 1,
				per_page: 10,
				fq: '',
				sort: '',
				...propsObject.get('query').value()
			},
			isFooterShow: false
		};

		this.loadingView = (
			<div style={{ margin: '20% auto 20% auto' }}>
				<Spinner />
			</div>
		);
		this.renderForeverBanner = (tprops) => {
			const { shared, dispatch } = tprops;
			return <ForeverBanner {...shared.foreverBanner} dispatch={dispatch} />;
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.query !== this.props.query) {
			this.setState({
				query: nextProps.query
			});
		}
	}

	componentWillUnmount() {
		const { dispatch } = this.props;
		dispatch(searchActions.loadingAction(true));
	}

	async onApply(e, fq, closeFilter) {
		const { query } = this.state;
		query.fq = fq;
		this.setState({
			query,
			showFilter: !closeFilter
		});
		this.update({
			fq,
			page: 1
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
		let parsedUrl = queryString.parse(location.search);
		parsedUrl = { ...parsedUrl, query: encodeURIComponent(parsedUrl.query) };
		urlBuilder.replace(history, {
			query: query.q,
			page: query.page,
			per_page: query.per_page,
			sort: query.sort,
			...parsedUrl,
			...params
		});

		const [err, response] = await to(dispatch(searchActions.searchAction({
			token: cookies.get(cookiesLabel.userToken),
			query: {
				...query,
				...params
			}
		})));
		if (err) {
			dispatch(searchActions.promoAction(cookies.get(cookiesLabel.userToken), 'empty'));
		}
		if (response) {
			if (!_.isEmpty(response.searchData.products)) {
				const productIdList = _.map(response.searchData.products, 'product_id') || null;
				dispatch(commentActions.bulkieCommentAction(cookies.get(cookiesLabel.userToken), productIdList));
				dispatch(lovelistActions.bulkieCountByProduct(cookies.get(cookiesLabel.userToken), productIdList));
			} else {
				dispatch(searchActions.promoAction(cookies.get(cookiesLabel.userToken), 'empty'));
			}
		}
	}

	sort(e, sort) {
		this.setState({
			sort,
			showSort: false
		});
		this.update({
			sort: sort.q,
			page: 1
		});
	}

	handlePick(e) {
		const { showSort } = this.state;
		if (e === 'view') {
			const { viewMode, dispatch } = this.props;
			const mode = viewMode.mode === 2 ? 1 : viewMode.mode + 1;
			dispatch(searchActions.viewModeAction(mode));
		} else {
			this.setState({
				showFilter: e === 'filter',
				showSort: showSort ? false : (e === 'sort')
			});
		}
	}

	forceLoginNow() {
		const { history } = this.props;
		history.push(`/login?redirect_uri=${encodeURIComponent(location.pathname + location.search)}`);
	}

	searchNotFound() {
		const { promoData } = this.props;
		
		return (
			<SearchNotFound
				keyword={this.getKeyword()}
				data={promoData}
				renderForeverBanner={() => this.renderForeverBanner(this.props)}
				forceLoginNow={() => this.forceLoginNow()}
			/>
		);
	}

	searchFound(searchData) {
		const { comments, scroller, viewMode } = this.props;
		const products = searchData.products;
		const info = searchData.info;

		let listView;
		switch (viewMode.mode) {
		case 1:
			listView = (
				<CatalogView comments={comments} loading={scroller.loading} forceLoginNow={() => this.forceLoginNow()} products={products} />
			);
			break;
		case 2:
			listView = (
				<GridView loading={scroller.loading} forceLoginNow={() => this.forceLoginNow()} products={products} />
			);
			break;
		default:
			listView = null;
			break;
		}
		return (
			<Page color='white'>
				{this.renderForeverBanner(this.props)}
				<div className='text-center margin--medium-v'>{info.product_count} Total Produk</div>
				{listView}
				<Footer isShow={this.state.isFooterShow} />
			</Page>
		);
	}

	renderPage() {
		const { isLoading, searchResults, cookies } = this.props;
		const { showFilter } = this.state;

		if (showFilter) {
			return (
				<Filter
					shown={showFilter}
					filters={searchResults.searchData}
					onApply={(e, fq, closeFilter) => {
						this.onApply(e, fq, closeFilter);
					}}
					onClose={(e) => this.onClose(e)}
				/>
			);
		}

		const navigationAttribute = {
			scroll: this.props.scroll
		};
		navigationAttribute.active = cookies.get(cookiesLabel.pageReferrer);
		navigationAttribute.isLogin = this.isLogin;


		return (
			<div style={this.props.style}>
				{isLoading ? this.loadingView : this.renderSearch()}
				{this.renderHeader()}
				<Navigation {...navigationAttribute} botNav={this.props.botNav} />
			</div>
		);
	}

	renderHeader() {
		const { dispatch, cookies } = this.props;
		let back = () => {
			dispatch(actionSearch.updatedKeywordHandler('', cookies.get(cookiesLabel.userToken)));
			this.props.history.go(-2);
		};
		if (this.props.history.length === 0) {
			back = () => {
				dispatch(actionSearch.updatedKeywordHandler('', cookies.get(cookiesLabel.userToken)));
				this.props.history.push('/');
			};
		}

		const iconRightAction = () => {
			dispatch(actionSearch.updatedKeywordHandler('', cookies.get(cookiesLabel.userToken)));
			this.props.history.push('/search');
		};

		const onClickInputAction = () => {
			dispatch(actionSearch.updatedKeywordHandler(this.getKeyword(), cookies.get(cookiesLabel.userToken)));
			this.props.history.push('/search');
		};

		return (
			<Header.SearchResult
				rows={this.renderTabs()}
				back={back}
				value={this.getKeyword() || ''}
				iconRightAction={iconRightAction}
				onClickInputAction={onClickInputAction}
			/>
		);
	}

	renderTabs() {
		const { searchResults, viewMode, isLoading, isFiltered } = this.props;
		const { showSort } = this.state;

		let tabsView = null;
		if (searchResults.searchData && !_.isEmpty(searchResults.searchData.products)) {
			const sorts = _.chain(searchResults).get('searchData.sorts').value() || [];
			tabsView = (
				<div>
					{renderIf(sorts)(
						<Sort shown={showSort} onCloseOverlay={() => this.setState({ showSort: false })} isSticky sorts={sorts} onSort={(e, value) => this.sort(e, value)} />
					)}
					<Tabs
						type='segment'
						variants={[
							{
								id: 'sort',
								title: 'Urutkan',
								disabled: isLoading
							},
							{
								id: 'filter',
								title: 'Filter',
								disabled: isLoading,
								checked: isFiltered
							},
							{
								id: 'view',
								title: <Svg src={viewMode.icon} />,
								disabled: searchResults.isLoading
							}
						]}
						onPick={e => this.handlePick(e)}
					/>
				</div>
			);
		}

		return tabsView;
	}


	renderSearch() {
		const { searchResults } = this.props;

		let searchView = null;
		if (searchResults.searchStatus === 'success' && !_.isEmpty(searchResults.searchData.products)) {
			searchView = this.searchFound(searchResults.searchData);
		} else if (searchResults.searchStatus === 'failed' || (searchResults.searchStatus === 'success' && _.isEmpty(searchResults.searchData.products))) {
			searchView = this.searchNotFound();
		}

		return searchView;
	}

	render() {
		return this.renderPage();
	}
}

const mapStateToProps = (state) => {
	const { comments, lovelist, searchResults } = state;
	searchResults.searchData.products = Discovery.mapProducts(searchResults.searchData.products, comments, lovelist);
	const isFiltered = Filter.utils.isFiltered(searchResults.searchData.facets);

	const getRecommendationData = _.find(searchResults.promoData, { type: 'recommended' }) || false;
	if (getRecommendationData) {
		state.searchResults.promoData = {
			...searchResults.promoData,
			recommendationData: {
				title: getRecommendationData.title,
				products: Discovery.mapPromoProducts(getRecommendationData.data, lovelist)
			}
		};
	}

	return {
		...state,
		searchResults,
		isFiltered,
		promoData: state.searchResults.promoData,
		query: state.searchResults.query,
		isLoading: state.searchResults.isLoading,
		viewMode: state.searchResults.viewMode
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, location, search } = props;

	if (search && _.has(search, 'keyword') && !_.isEmpty(search.keyword)) {
		Collector.push(Collector.SEARCH_PAGE, search.keyword);
	}

	const parsedUrl = queryString.parse(location.search);
	const searchParam = {
		q: parsedUrl.query !== undefined ? parsedUrl.query : '',
		brand_id: parsedUrl.brand_id !== undefined && !_.isEmpty(parsedUrl.brand_id) ? parseInt(parsedUrl.brand_id, 10) : '',
		store_id: parsedUrl.store_id !== undefined && !_.isEmpty(parsedUrl.store_id) ? parseInt(parsedUrl.store_id, 10) : '',
		category_id: parsedUrl.category_id !== undefined && !_.isEmpty(parsedUrl.category_id) ? parseInt(parsedUrl.category_id, 10) : '',
		page: parsedUrl.page !== undefined && !_.isEmpty(parsedUrl.page) ? parseInt(parsedUrl.page, 10) : 1,
		per_page: parsedUrl.per_page !== undefined && !_.isEmpty(parsedUrl.per_page) ? parseInt(parsedUrl.per_page, 10) : 30,
		fq: parsedUrl.fq !== undefined ? parsedUrl.fq : '',
		sort: parsedUrl.sort !== undefined ? parsedUrl.sort : '',
	};
	const [err, response] = await to(dispatch(searchActions.searchAction({ token: cookies.get(cookiesLabel.userToken), query: searchParam })));
	if (err) {
		await dispatch(searchActions.promoAction(cookies.get(cookiesLabel.userToken), 'empty'));
	}
	if (response) {
		if (!_.isEmpty(response.searchData.products)) {
			const productIdList = _.map(response.searchData.products, 'product_id') || null;
			await dispatch(searchActions.bulkieCommentAction(cookies.get(cookiesLabel.userToken), productIdList));
			await dispatch(lovelistActions.bulkieCountByProduct(cookies.get(cookiesLabel.userToken), productIdList));
		} else {
			await dispatch(searchActions.promoAction(cookies.get(cookiesLabel.userToken), 'empty'));
		}
	}
};

export default withCookies(connect(mapStateToProps)(Shared(Scroller(SearchResults), doAfterAnonymous)));
