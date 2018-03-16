import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Navigation,
	Svg,
	Tabs,
	Header,
	Page,
	Button,
	Level,
	Image,
	Badge
} from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import Scroller from '@/containers/Mobile/Shared/scroller';
import { actions } from '@/state/v4/Seller';
import { actions as scrollerActions } from '@/state/v4/Scroller';
import {
	Filter,
	Sort
} from '@/containers/Mobile/Widget';
import { withRouter, Link } from 'react-router-dom';
import stylesCatalog from '../Category/Catalog/catalog.scss';
import Spinner from '@/components/mobile/Spinner';
import Share from '@/components/mobile/Share';
import { urlBuilder, renderIf } from '@/utils';
import _ from 'lodash';
import queryString from 'query-string';
import Helmet from 'react-helmet';
import {
	CatalogView,
	GridView,
	SmallGridView
} from '@/containers/Mobile/Discovery/View';

import { actions as lovelistActions } from '@/state/v4/Lovelist';
import { actions as commentActions } from '@/state/v4/Comment';
import to from 'await-to-js';

import {
	TrackingRequest,
	sendGtm,
	categoryViewBuilder,
	productClickBuilder
} from '@/utils/tracking';

const trackSellerPageView = (products, info, props) => {
	const productId = _.map(products, 'product_id') || [];
	const brandInfo = {
		id: props.match.params.store_id,
		name: info.title,
		url_path: props.location.pathname
	};
	const impressions = _.map(products, (product, key) => {
		return {
			name: product.product_title,
			id: product.product_id,
			price: product.pricing.original.effective_price,
			brand: product.brand.name,
			category: product.product_category_names.join('/'),
			position: key + 1,
			list: 'mm'
		};
	}) || [];
	const request = new TrackingRequest();
	request.setEmailHash('').setUserId('').setUserIdEncrypted('').setCurrentUrl(props.location.pathname);
	request.setFusionSessionId('').setIpAddress('').setImpressions(impressions).setCategoryInfo(brandInfo);
	request.setListProductId(productId.join('|'));
	const requestPayload = request.getPayload(categoryViewBuilder);
	if (requestPayload) sendGtm(requestPayload);
};

const trackProductOnClick = (product, position, source = 'mm') => {
	const productData = {
		name: product.product_title,
		id: product.product_id,
		price: product.pricing.original.effective_price,
		brand: product.brand.name,
		category: product.product_category_names.join('/'),
		position
	};
	const request = new TrackingRequest();
	request.setFusionSessionId('').setProducts([productData]).setSourceName(source);
	const requestPayload = request.getPayload(productClickBuilder);
	if (requestPayload) sendGtm(requestPayload);
};


class Seller extends Component {
	constructor(props) {
		super(props);

		this.currentListState = 0;
		this.listType = [{
			type: 'list',
			icon: 'ico_grid.svg'
		}, {
			type: 'grid',
			icon: 'ico_grid-3x3.svg'
		}, {
			type: 'small',
			icon: 'ico_list.svg'
		}];

		const propsObject = _.chain(props.seller);

		this.state = {
			listTypeState: this.listType[this.currentListState],
			showFilter: false,
			showSort: false,
			query: {
				page: 0,
				store_id: '',
				fq: '',
				sort: '',
				...propsObject.get('query').value()
			},
			filterStyle: {},
			centerStyle: { opacity: 0 },
			headerNameY: false
		};
	}

	componentWillMount() {
		window.addEventListener('scroll', this.onScroll, true);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.query) {
			this.setState({
				query: nextProps.query
			});
		}

		if (nextProps.seller.data !== this.props.seller.data) {
			const data = nextProps.seller.data;
			trackSellerPageView(data.products, data.info, nextProps);
		}
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScroll, true);
	}

	onScroll = (e) => {
		const { headerNameY } = this.state;
		const header = document.getElementById('store-filter');
		const sticky = header.offsetTop;
		const scrollY = e.srcElement.scrollTop;

		if (!headerNameY) {
			this.setState({
				headerNameY: this.headerName.getBoundingClientRect().top ? this.headerName.getBoundingClientRect().top - 60 : 85
			});
		}

		if (scrollY >= sticky) {
			this.setState({
				centerStyle: { opacity: 1 },
				filterStyle: {
					position: 'fixed',
					width: '100%',
					top: '60px',
					zIndex: '1',
					overflow: 'hidden',
					maxWidth: '480px'
				}
			});
		} else {
			let o = 0;
			const y = !headerNameY ? 85 : headerNameY;

			if (scrollY > y && scrollY < (y + 13)) {
				o = (((scrollY - y) * 12) / 12) / 10;
			} else if (scrollY > (y + 12)) {
				o = 1;
			}

			this.setState({
				centerStyle: { opacity: o },
				filterStyle: {},
			});
		}
	};

	onApply = async (e, fq) => {
		const { query } = this.state;
		query.fq = fq;

		this.setState({
			query,
			showFilter: false
		});
		this.update({
			fq
		});
	};

	onClose = (e) => {
		this.setState({
			showFilter: false
		});
	};

	forceLoginNow() {
		const { history } = this.props;
		const currentUrl = encodeURIComponent(`${location.pathname}${location.search}`);
		history.push(`/login?redirect_uri=${currentUrl}`);
	}

	update = async (filters) => {
		const { cookies, dispatch, match: { params }, location, history } = this.props;
		const { query } = this.state;

		const parsedUrl = queryString.parse(location.search);
		const urlParam = {
			sort: query.sort,
			...parsedUrl,
			...filters
		};

		const url = queryString.stringify(urlParam, {
			encode: false
		});

		history.push(`?${url}`);

		const data = {
			token: cookies.get('user.token'),
			query: {
				...query,
				...filters,
				store_id: params.store_id || 0
			},
			type: 'init'
		};

		const response = await to(dispatch(actions.getProducts(data)));

		const productIdList = _.map(response[1].data.products, 'product_id') || [];
		dispatch(commentActions.bulkieCommentAction(cookies.get('user.token'), productIdList));
		dispatch(lovelistActions.bulkieCountByProduct(cookies.get('user.token'), productIdList));
	};

	handlePick = (val) => {
		if (val === 'view') {
			this.currentListState = this.currentListState === 2 ? 0 : this.currentListState + 1;
			this.setState({ listTypeState: this.listType[this.currentListState] });
		} else {
			if (val === 'filter') {
				this.props.dispatch(scrollerActions.onScroll({ nextPage: false }));
			}

			this.setState({
				showFilter: val === 'filter',
				showSort: (val === 'sort' && !this.state.showSort) || false
			});
		}
	};

	sort = async (e, sort) => {
		this.setState({
			sort,
			showSort: false
		});
		this.update({
			sort: sort.q
		});
	};

	filterTabs = () => {
		const { seller } = this.props;
		const { listTypeState, showSort, filterStyle } = this.state;
		const sorts = _.chain(seller).get('data.sorts').value() || [];

		return (
			<div id='store-filter' style={filterStyle}>
				<Tabs
					className={stylesCatalog.filterBlockContainer}
					type='segment'
					variants={[
						{
							id: 'sort',
							title: 'Urutkan',
							disabled: _.isEmpty(seller.data.sorts)
						},
						{
							id: 'filter',
							title: 'Filter',
							disabled: _.isEmpty(seller.data.facets)
						},
						{
							id: 'view',
							title: <Svg src={listTypeState.icon} />,
							disabled: _.isEmpty(seller.data.products)
						}
					]}
					onPick={e => this.handlePick(e)}
				/>
				{renderIf(sorts)(
					<Sort shown={showSort} onCloseOverlay={() => this.setState({ showSort: false })} sorts={sorts} onSort={(e, value) => this.sort(e, value)} />
				)}
			</div>
		);
	}

	sellerHeader = () => {
		const { seller, location } = this.props;
		return (seller.info.seller && (
			<div className='border-bottom'>
				<div className='margin--medium-v'>
					<div className='padding--small-h flex-row flex-spaceBetween'>
						<div className='padding--small-h'>
							<div className='avatar'>
								<Link to={`${location.pathname}${location.search}`} >
									<Image avatar width={60} height={60} src={seller.info.seller_logo || ''} />
									<Badge attached position='bottom-right'><Image src={seller.info.seller_badge_image} width={12} /></Badge>
								</Link>
							</div>
						</div>
						<Level divider>
							{
								seller.info.is_new_seller !== 0 && (
									<Level.Item className='text-center'>
										<div className='font-large flex-row flex-center'>
											<Svg src='ico_newstore.svg' />
										</div>
										<div className='font-small font-color--primary-ext-2' style={{ minWidth: '50px' }}>New Store</div>
									</Level.Item>
								)
							}
							{
								seller.info.is_new_seller === 0 && (
									<Level.Item className='text-center'>
										<div className='font-large flex-row flex-center flex-middle'>
											<Svg src='ico_successorder.svg' />
											<span className='padding--small-h padding--none-r'>{_.chain(seller).get('info.success_order.rate').value() || 0}%</span>
										</div>
										<div className='font-small font-color--primary-ext-2 text-no-wrap' style={{ minWidth: '50px' }}>Order Sukses</div>
									</Level.Item>
								)
							}
							<Level.Item className='text-center'>
								<div className='font-large flex-row flex-middle'>
									<Svg src='ico_reviews_solid_selected_small.svg' />
									<span className='padding--small-h padding--none-r'>{seller.info.rating || 0}</span>
								</div>
								<div className='font-small font-color--primary-ext-2' style={{ minWidth: '50px' }}>Rating</div>
							</Level.Item>
							<Level.Item className='text-center'>
								<div className='font-large'>{seller.info.product || 0}</div>
								<div className='font-small font-color--primary-ext-2' style={{ minWidth: '50px' }}>Produk</div>
							</Level.Item>
						</Level>
					</div>
					<div className='padding--medium-h margin--small-v'>
						<div className='font-medium' ref={(el) => { this.headerName = el; }}>{seller.info.seller || ''}</div>
						<div className='font-small flex-row flex-middle'><Svg src='ico_pinlocation-black.svg' /> <span>{seller.info.seller_location || ''}</span></div>
						<div className='font-small'>{seller.info.description || ''}</div>
					</div>
				</div>
			</div>
		)) || '';
	};

	loadProducts = () => {
		const { comments, scroller, seller: { data: { products } } } = this.props;
		let listView;
		switch (this.state.listTypeState.type) {
		case 'list':
			listView = (
				<CatalogView
					comments={comments}
					loading={scroller.loading}
					forceLoginNow={() => this.forceLoginNow()}
					products={products}
					productOnClick={trackProductOnClick}
				/>
			);
			break;
		case 'grid':
			listView = (
				<GridView
					loading={scroller.loading}
					forceLoginNow={() => this.forceLoginNow()}
					products={products}
					productOnClick={trackProductOnClick}
				/>
			);
			break;
		case 'small':
			listView = (
				<SmallGridView
					loading={scroller.loading}
					products={products}
					productOnClick={trackProductOnClick}
				/>
			);
			break;
		default:
			listView = null;
			break;
		}

		return listView;
	};

	renderHelmet = () => {
		const { seller: { info }, location } = this.props;

		return (
			<Helmet>
				<title>{`${info.seller} | MatahariMall.com`}</title>
				<meta name='twitter:card' content='summary' />
				<meta name='twitter:site' content='@MatahariMallCom' />
				<meta name='twitter:creator' content='@MatahariMallCom' />
				<meta name='twitter:title' content={info.description} />
				<meta name='twitter:url' content={`${process.env.MOBILE_URL}${location.pathname}${location.search}`} />
				<meta name='twitter:description' content={info.description} />
				<meta name='twitter:image' content={info.seller_logo} />
				<meta property='og:title' content={info.seller} />
				<meta property='og:url' content={`${process.env.MOBILE_URL}${location.pathname}${location.search}`} />
				<meta property='og:type' content='website' />
				<meta property='og:description' content={info.description} />
				<meta property='og:image' content={info.seller_logo} />
				<meta property='og:site_name' content='MatahariMall.com' />
				<link rel='canonical' href={process.env.MOBILE_URL} />
			</Helmet>
		);
	};

	renderData = () => {

		const { showFilter, centerStyle } = this.state;
		const { seller, history, location, scroller } = this.props;
		const title = seller.info.seller;
		const url = `${process.env.MOBILE_URL}${location.pathname}${location.search}`;
		const storename = (!title) ? '' : (title.length > 30) ? `${title.substring(0, 30)}&hellip;` : title;
		const prevLocation = _.chain(window.prevLocation).get('pathname').value();
		const activeNav = prevLocation && prevLocation.indexOf('.html') > -1 ? 'Categories' : ['', '/'].includes(prevLocation) ? 'Home' : null;

		const HeaderPage = {
			left: (
				<Button onClick={history.goBack}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</Button>
			),
			center: <span style={centerStyle}>{storename}</span>,
			right: <Share title={title} url={url} />
		};

		return (
			<span>
				{showFilter ? (
					<Filter
						shown={showFilter}
						filters={seller.data}
						onApply={(e, fq) => {
							this.onApply(e, fq);
						}}
						onClose={(e) => this.onClose(e)}
					/>
				) : (
					<div style={this.props.style}>
						<Page color='white'>
							{seller.info.seller && this.renderHelmet()}
							{this.sellerHeader()}
							{this.filterTabs()}
							{this.loadProducts()}
							{scroller.loading && <Spinner />}
						</Page>

						<Header.Modal {...HeaderPage} style={{ zIndex: 1 }} />
						<Navigation scroll={this.props.scroll} active={activeNav} />
					</div>
				)}
			</span>
		);
	};

	render() {
		return (
			<div>
				{this.renderData()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { comments, lovelist, seller } = state;
	seller.data.products = _.map(seller.data.products, (product) => {
		const commentData = !_.isEmpty(comments.data) ? _.find(comments.data, { product_id: product.product_id }) : false;
		const lovelistData = !_.isEmpty(lovelist.bulkieCountProducts) ? _.find(lovelist.bulkieCountProducts, { product_id: product.product_id }) : false;
		if (lovelistData) {
			product.lovelistTotal = lovelistData.total;
			product.lovelistStatus = lovelistData.status;
		}
		if (commentData) {
			product.commentTotal = commentData.total;
		}
		return {
			...product,
			url: urlBuilder.buildPdp(product.product_title, product.product_id),
			commentUrl: `/${urlBuilder.buildPcpCommentUrl(product.product_id)}`
		};
	});
	return {
		...state
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, match: { params }, location } = props;

	if (isNaN(parseInt(params.store_id, 10))) {
		props.history.push('/404');
	}

	const qs = queryString.parse(location.search);
	const data = {
		token: cookies.get('user.token'),
		query: {
			store_id: params.store_id || 0,
			...qs
		}
	};

	await dispatch(actions.initSeller(data.token, data.query.store_id));
	const response = await to(dispatch(actions.getProducts(data)));

	const productIdList = _.map(response[1].data.products, 'product_id') || [];
	dispatch(commentActions.bulkieCommentAction(cookies.get('user.token'), productIdList));
	dispatch(lovelistActions.bulkieCountByProduct(cookies.get('user.token'), productIdList));

};

export default withRouter(withCookies(connect(mapStateToProps)(Scroller(Shared(Seller, doAfterAnonymous)))));
