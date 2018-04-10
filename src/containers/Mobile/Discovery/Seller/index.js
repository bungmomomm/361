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
	Badge,
	SEO
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
import { renderIf } from '@/utils';
import _ from 'lodash';
import queryString from 'query-string';
import {
	CatalogView,
	GridView,
	SmallGridView
} from '@/containers/Mobile/Discovery/View';

import { actions as lovelistActions } from '@/state/v4/Lovelist';
import { actions as commentActions } from '@/state/v4/Comment';
import to from 'await-to-js';
import Discovery from '../Utils';

import {
	TrackingRequest,
	sendGtm,
	categoryViewBuilder,
	productClickBuilder
} from '@/utils/tracking';
import classNames from 'classnames';
import styles from './styles.scss';
import { userToken, isLogin } from '@/data/cookiesLabel';
import handler from '@/containers/Mobile/Shared/handler';
import { Utils } from '@/utils/tracking/lucidworks';

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
			category: product.product_category_names ? product.product_category_names.join('/') : '',
			position: key + 1,
			list: product.source
		};
	}) || [];
	const { users, shared } = props;
	const { userProfile } = users;
	const layerData = {
		emailHash: _.defaultTo(userProfile.enc_email, ''),
		userIdEncrypted: userProfile.enc_userid,
		userId: userProfile.id,
		ipAddress: shared.ipAddress || userProfile.ip_address,
		currentUrl: props.location.pathname,
		impressions,
		categoryInfo: brandInfo,
		fusionSessionId: Utils.getSessionID(),
		listProductId: productId.join('|')
	};
	const request = new TrackingRequest(layerData);
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
	const layerData = {
		fusionSessionId: Utils.getSessionID(),
		products: [productData],
		sourceName: source
	};
	const request = new TrackingRequest(layerData);
	const requestPayload = request.getPayload(productClickBuilder);
	if (requestPayload) sendGtm(requestPayload);
};

@handler
class Seller extends Component {
	constructor(props) {
		super(props);

		this.currentListState = 1;
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
		this.activeNav = 'Home';

		const propsObject = _.chain(props.seller);
		this.isLogin = this.props.cookies.get(isLogin) === 'true';

		this.state = {
			listTypeState: this.listType[this.currentListState],
			showFilter: false,
			showSort: false,
			query: {
				page: 1,
				store_id: '',
				fq: '',
				sort: '',
				...propsObject.get('query').value()
			},
			filterStyle: {},
			centerStyle: { opacity: 0 },
			headerNameY: false,
			seeMore: {
				bool: true,
				text: 'Lihat Selengkapnya',
				show: false
			},
			focusedProductId: ''
		};
	}

	componentWillMount() {
		window.addEventListener('scroll', this.onScroll, true);
	}

	componentDidMount() {
		let product = false;

		window.surfs.some((item) => {
			if (item.pathname.indexOf('.html') !== -1) product = true;

			if (product && ['', '/'].includes(item.pathname)) return true;

			if (product && item.pathname.indexOf('/category') !== -1) {
				this.activeNav = 'Categories';
				return true;
			};

			return false;
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.query) {
			this.setState({
				query: nextProps.query
			});
		}

		if (nextProps.seller.data !== this.props.seller.data) {
			const data = nextProps.seller.data;
			if (nextProps.seller.info.description.length > 110) {
				this.setState({
					seeMore: {
						...this.state.seeMore,
						show: true
					}
				});
			}
			trackSellerPageView(data.products, nextProps.seller.info, nextProps);
		}
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScroll, true);
	}

	onScroll = (e) => {
		const { headerNameY } = this.state;
		const header = document.getElementById('store-filter');
		const sticky = header.offsetTop;
		const scrollY = window.scrollY;

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

	onApply = async (e, fq, closeFilter) => {
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
	};

	onClose = (e) => {
		this.setState({
			showFilter: false
		});
	};

	setFocusedProduct(id) {
		this.setState({ focusedProductId: id });
	}

	forceLoginNow = () => {
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
			token: cookies.get(userToken),
			query: {
				...query,
				...filters,
				store_id: params.store_id || 0
			},
			type: 'init'
		};

		const response = await to(dispatch(actions.getProducts(data)));

		const productIdList = _.map(response[1].data.products, 'product_id') || [];
		dispatch(commentActions.bulkieCommentAction(cookies.get(userToken), productIdList));
		dispatch(lovelistActions.bulkieCountByProduct(cookies.get(userToken), productIdList));
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
			sort: sort.q,
			page: 1
		});
	};

	filterTabs = () => {
		const { seller, scroller, isFiltered } = this.props;
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
							disabled: scroller.loading
						},
						{
							id: 'filter',
							title: 'Filter',
							disabled: scroller.loading,
							checked: isFiltered
						},
						{
							id: 'view',
							title: <Svg src={listTypeState.icon} />,
							disabled: scroller.loading
						}
					]}
					onPick={e => this.handlePick(e)}
				/>
				{renderIf(sorts)(
					<Sort shown={showSort} onCloseOverlay={() => this.setState({ showSort: false })} sorts={sorts} onSort={(e, value) => this.sort(e, value)} />
				)}
			</div>
		);
	};

	toggleSeeMore = () => {
		this.setState({
			seeMore: {
				...this.state.seeMore,
				bool: !this.state.seeMore.bool,
				text: !this.state.seeMore.bool ? 'Lihat Selengkapnya' : 'Tutup'
			}
		});
	};

	sellerHeader = () => {
		const { seller, location } = this.props;
		const { seeMore } = this.state;

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
						<div>
							<div className={seeMore.bool && seeMore.show ? classNames('font-small padding--medium-h', styles.textOnlyShowTwoLines) : 'font-small padding--medium-h'}>{seller.info.description || ''}</div>
							{seeMore.show && (
								<div style={{ textAlign: 'center', paddingTop: '20px' }}>
									<span className='padding--medium-h'>
										<button className='font-small font-color--grey' onClick={this.toggleSeeMore} style={{ color: '#2f67b7' }}>
											{seeMore.text}
										</button>
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		)) || '';
	};

	loadProducts = () => {
		const { comments, scroller, seller: { data: { products } }, location } = this.props;
		const { focusedProductId } = this.state;

		const redirectPath = location.pathname !== '' ? location.pathname : '';
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
					focusedProductId={focusedProductId}
					setFocusedProduct={(id) => this.setFocusedProduct(id)}
					redirectPath={redirectPath}
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

	renderData = () => {

		const { showFilter, centerStyle } = this.state;
		const { seller, history, location, scroller } = this.props;
		const title = seller.info.seller;
		const url = `${process.env.MOBILE_URL}${location.pathname}${location.search}`;
		const storename = (!title) ? '' : (title.length > 30) ? `${title.substring(0, 30)}&hellip;` : title;
		// const prevLocation = _.chain(window.prevLocation).get('pathname').value();
		// const activeNav = prevLocation && prevLocation.indexOf('.html') > -1 ? 'Categories' : ['', '/'].includes(prevLocation) ? 'Home' : null;

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
						onApply={(e, fq, closeFilter) => {
							this.onApply(e, fq, closeFilter);
						}}
						onClose={(e) => this.onClose(e)}
					/>
				) : (
					<div style={this.props.style}>
						<Page color='white'>
							<SEO
								paramCanonical={process.env.MOBILE_UR}
							/>
							{this.sellerHeader()}
							{this.filterTabs()}
							{this.loadProducts()}
							{scroller.loading && <Spinner />}
						</Page>

						<Header.Modal {...HeaderPage} style={{ zIndex: 1 }} />
						<Navigation scroll={this.props.scroll} active={this.activeNav} botNav={this.props.botNav} />
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
	const { products, facets } = _.chain(seller).get('data').value() || { products: [], facets: [] };
	seller.data.products = Discovery.mapProducts(products, comments, lovelist);
	const isFiltered = Filter.utils.isFiltered(facets);
	return {
		...state,
		seller,
		isFiltered
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, match: { params }, location } = props;

	if (isNaN(parseInt(params.store_id, 10))) {
		props.history.push('/404');
	}

	const qs = queryString.parse(location.search);
	const data = {
		token: cookies.get(userToken),
		query: {
			store_id: params.store_id || 0,
			...qs
		}
	};

	await dispatch(actions.initSeller(data.token, data.query.store_id));
	const response = await to(dispatch(actions.getProducts(data)));
	const productIdList = _.map(response[1].data.products, 'product_id') || [];
	dispatch(commentActions.bulkieCommentAction(cookies.get(userToken), productIdList));
	dispatch(lovelistActions.bulkieCountByProduct(cookies.get(userToken), productIdList));

};

export default withRouter(withCookies(connect(mapStateToProps)(Scroller(Shared(Seller, doAfterAnonymous)))));
