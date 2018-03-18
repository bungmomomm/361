import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import queryString from 'query-string';
import to from 'await-to-js';

import Shared from '@/containers/Mobile/Shared';
import Scroller from '@/containers/Mobile/Shared/scroller';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import Footer from '@/containers/Mobile/Shared/footer';
import { Filter, Sort } from '@/containers/Mobile/Widget';
import {
	CatalogView,
	GridView,
	SmallGridView
} from '@/containers/Mobile/Discovery/View';

import {
	Header,
	Page,
	Svg,
	Tabs,
	Navigation,
	Spinner,
} from '@/components/mobile';

import { actions as pcpActions } from '@/state/v4/ProductCategory';
import { actions as commentActions } from '@/state/v4/Comment';
import { actions as lovelistActions } from '@/state/v4/Lovelist';

import {
	renderIf,
	urlBuilder
} from '@/utils';

import Discovery from '../../Utils';

class Product extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		const propsObject = _.chain(props.productCategory);
		this.state = {
			showFilter: false,
			showSort: false,
			query: {
				category_id: '',
				page: 0,
				per_page: 0,
				fq: '',
				sort: '',
				...propsObject.get('query').value()
			},
			isFooterShow: true
		};
		this.loadingView = <Spinner />;
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

	update = async (params) => {
		const { cookies, dispatch, location, history } = this.props;
		const { query } = this.state;

		const parsedUrl = queryString.parse(location.search);

		urlBuilder.replace(history, {
			query: query.q,
			page: query.page,
			per_page: query.per_page,
			sort: query.sort,
			...parsedUrl,
			...params
		});

		const pcpParam = {
			...query,
			...params
		};

		const [err, response] = await to(dispatch(pcpActions.pcpAction({ token: cookies.get('user.token'), query: pcpParam })));
		if (err) {
			console.log(err);
			return err;
		}
		const productIdList = _.map(response.pcpData.products, 'product_id') || [];
		dispatch(commentActions.bulkieCommentAction(cookies.get('user.token'), productIdList));
		await dispatch(lovelistActions.bulkieCountByProduct(cookies.get('user.token'), productIdList));
		return response;
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
		const { showSort } = this.state;
		const { viewMode, dispatch } = this.props;
		if (e === 'view') {
			console.log('request');
			const mode = viewMode.mode === 3 ? 1 : viewMode.mode + 1;
			dispatch(pcpActions.viewModeAction(mode));
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

	foreverBannerBlock() {
		const { shared, dispatch } = this.props;

		return <ForeverBanner {...shared.foreverBanner} dispatch={dispatch} />;
	}

	tabBlock() {
		const { isFiltered, productCategory, viewMode } = this.props;
		const { showSort } = this.state;
		const productChain = _.chain(productCategory);
		let tabsView = null;
		if (!_.isEmpty(productChain.get('pcpData.products').value())) {
			const sorts = productChain.get('pcpData.sorts').value() || [];
			tabsView = (
				<div className={'tabContainer'}>
					{renderIf(sorts)(
						<Sort shown={showSort} onCloseOverlay={() => this.setState({ showSort: false })} isSticky sorts={sorts} onSort={(e, value) => this.sort(e, value)} />
					)}
					<Tabs
						type='segment'
						variants={[
							{
								id: 'sort',
								title: 'Urutkan',
								disabled: typeof productCategory.pcpData === 'undefined'
							},
							{
								id: 'filter',
								title: 'Filter',
								disabled: typeof productCategory.pcpData === 'undefined',
								checked: isFiltered
							},
							{
								id: 'view',
								title: <Svg src={viewMode.icon} />,
								disabled: productCategory.isLoading
							}
						]}
						onPick={e => this.handlePick(e)}
					/>
				</div>
			);
		}
		return tabsView;
	}

	productsBlock() {
		const { comments, productCategory, scroller, viewMode } = this.props;
		if (productCategory.pcpStatus !== '') {
			if (productCategory.pcpStatus === 'success') {
				const products = productCategory.pcpData.products;
				const info = productCategory.pcpData.info;
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
				case 3:
					listView = (
						<SmallGridView loading={scroller.loading} products={products} />
					);
					break;
				default:
					listView = null;
					break;
				}
				return (
					<Page color='white'>
						{this.foreverBannerBlock()}
						<div className='text-center margin--medium-v'>{info.product_count} Total Produk</div>
						{listView}
						<Footer isShow={this.state.isFooterShow} />
					</Page>
				);
			} else if (productCategory.pcpStatus === 'failed') {
				window.location.href = '/not-found';
			}
		}

		return null;
	}

	headerBlock() {
		const { isLoading, productCategory } = this.props;
		const headerTitle = _.chain(productCategory).get('pcpData.info.title').value();
		const HeaderPage = {
			left: (
				<Link to='/sub-category'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: isLoading ? this.loadingView : headerTitle,
			right: null,
			rows: this.tabBlock()
		};

		return (
			<Header.Modal {...HeaderPage} />
		);
	}

	renderPage() {
		const { productCategory } = this.props;
		const { showFilter } = this.state;
		if (showFilter) {
			return (
				<Filter
					shown={showFilter}
					filters={productCategory.pcpData}
					onApply={(e, fq) => {
						this.onApply(e, fq);
					}}
					onClose={(e) => this.onClose(e)}
				/>
			);
		}
		return (
			<div style={this.props.style}>
				{this.productsBlock()}
				{this.headerBlock()}
				<Navigation active='Categories' scroll={this.props.scroll} />
			</div>
		);
	}

	render() {
		return this.renderPage();
	}
}

const mapStateToProps = (state) => {
	const { comments, lovelist, productCategory } = state;
	const { products, facets } = _.chain(productCategory).get('pcpData').value() || { products: [], facets: [] };
	productCategory.pcpData.products = Discovery.mapProducts(products, comments, lovelist);
	const isFiltered = Filter.utils.isFiltered(facets);

	return {
		...state,
		isFiltered,
		productCategory,
		query: state.productCategory.query,
		isLoading: state.productCategory.isLoading,
		viewMode: state.productCategory.viewMode,
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, match, location } = props;

	const categoryId = _.chain(match).get('params.categoryId').value() || '';
	const parsedUrl = queryString.parse(location.search);
	const pcpParam = {
		category_id: parseInt(categoryId, 10),
		page: parsedUrl.page !== undefined ? parseInt(parsedUrl.page, 10) : 1,
		per_page: parsedUrl.per_page !== undefined ? parseInt(parsedUrl.per_page, 10) : 30,
		fq: parsedUrl.fq !== undefined ? parsedUrl.fq : '',
		sort: parsedUrl.sort !== undefined ? parsedUrl.sort : 'energy DESC',
	};

	const response = await dispatch(pcpActions.pcpAction({ token: cookies.get('user.token'), query: pcpParam }));

	const productIdList = _.map(response.pcpData.products, 'product_id') || [];
	if (productIdList.length > 0) {
		await dispatch(commentActions.bulkieCommentAction(cookies.get('user.token'), productIdList));
		await dispatch(lovelistActions.bulkieCountByProduct(cookies.get('user.token'), productIdList));
	}
};

export default withCookies(connect(mapStateToProps)(Scroller(Shared(Product, doAfterAnonymous))));
