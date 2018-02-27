import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Navigation, Svg, Tabs, Header, Page, Button, Level, Image, Input, Card } from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import Scroller from '@/containers/Mobile/Shared/scroller';
import { actions } from '@/state/v4/Seller';
import { actions as scrollerActions } from '@/state/v4/Scroller';
import Filter from '@/containers/Mobile/Shared/Filter';
import Sort from '@/containers/Mobile/Shared/Sort';
import { withRouter } from 'react-router-dom';
import stylesCatalog from '../Category/Catalog/catalog.scss';
import styles from './styles.scss';
import Spinner from '@/components/mobile/Spinner';
import Share from '@/components/mobile/Share';
import { hyperlink, renderIf } from '@/utils';
import _ from 'lodash';
import queryString from 'query-string';
import SellerProfile from './components/SellerProfile';
import Helmet from 'react-helmet';

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
			centerStyle: { opacity: 0 }
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
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScroll, true);
	}

	onScroll = (e) => {
		const header = document.getElementById('store-filter');
		const sticky = header.offsetTop;
		const scrollY = e.srcElement.scrollTop;

		if (scrollY >= sticky) {
			this.setState({
				centerStyle: { opacity: 1 },
				filterStyle: {
					position: 'fixed',
					width: '100%',
					top: '60px',
					zIndex: '1'
				}
			});
		} else {
			let o = 0;
			if (scrollY > 115 && scrollY < 128) {
				o = (((scrollY - 115) * 12) / 12) / 10;
			} else if (scrollY > 127) {
				o = 1;
			} else {
				o = 0;
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

	update = (filters) => {
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

		dispatch(actions.getProducts(data));
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
					<Sort shown={showSort} sorts={sorts} onSort={(e, value) => this.sort(e, value)} />
				)}
			</div>
		);
	}

	sellerHeader = () => {
		const { seller } = this.props;
		return (seller.info.seller && (
			<div className='border-bottom'>
				<SellerProfile
					image={seller.info.seller_logo || ''}
					status='gold'
					isNewStore={false}
					successOrder={_.chain(seller).get('seller.info.success_order.rate').value() || ''}
					rating={seller.info.rating || ''}
					totalProduct={seller.info.product || ''}
					name={seller.info.seller || ''}
					location={seller.info.seller_location || ''}
					description={seller.info.description || ''}
				/>
			</div>
		)) || '';
	};

	loadProducts = () => {
		const { seller: { data: { products } } } = this.props;

		return (
			<div className={styles.cardContainer}>
				{
					products.map((product, index) =>
						this.renderList(product, index)
					)
				}
			</div>
		);
	};

	renderList = (productData, index) => {
		if (productData) {
			const renderBlockComment = (
				<div className={stylesCatalog.commentBlock}>
					<Button>View 38 comments</Button>
					<Level>
						<Level.Left><div style={{ marginRight: '10px' }}><Image avatar width={25} height={25} local src='temp/pp.jpg' /></div></Level.Left>
						<Level.Item>
							<Input color='white' placeholder='Write comment' />
						</Level.Item>
					</Level>
				</div>
			);
			switch (this.state.listTypeState.type) {
			case 'list':
				return (
					<div key={index} className={stylesCatalog.cardCatalog}>
						<Card.Catalog
							images={productData.images}
							productTitle={productData.product_title}
							brandName={productData.brand.name}
							pricing={productData.pricing}
							linkToPdp={hyperlink('', ['product', productData.product_id], null)}
						/>
						{renderBlockComment}
					</div>
				);
			case 'grid':
				return (
					<Card.CatalogGrid
						key={index}
						images={productData.images}
						productTitle={productData.product_title}
						brandName={productData.brand.name}
						pricing={productData.pricing}
						linkToPdp={hyperlink('', ['product', productData.product_id], null)}
					/>
				);
			case 'small':
				return (
					<Card.CatalogSmall
						key={index}
						images={productData.images}
						pricing={productData.pricing}
						linkToPdp={hyperlink('', ['product', productData.product_id], null)}
					/>
				);
			default:
				return null;
			}
		} else {
			return null;
		}
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
			</Helmet>
		);
	};

	renderData = () => {

		const { showFilter, centerStyle } = this.state;
		const { seller, history, location, scroller } = this.props;
		const title = seller.info.seller;
		const url = `${process.env.MOBILE_URL}${location.pathname}${location.search}`;
		const storename = (!title) ? '' : (title.length > 30) ? `${title.substring(0, 30)}&hellip;` : title;

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
						<Page>
							{seller.info.seller && this.renderHelmet()}
							{this.sellerHeader()}
							{this.filterTabs()}
							{this.loadProducts()}
							{scroller.loading && <Spinner />}
						</Page>

						<Header.Modal {...HeaderPage} />
						<Navigation />
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
	return {
		...state
	};
};

const doAfterAnonymous = (props) => {
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

	dispatch(actions.initSeller(data.token, data.query.store_id));
	dispatch(actions.getProducts(data));
};

export default withRouter(withCookies(connect(mapStateToProps)(Scroller(Shared(Seller, doAfterAnonymous)))));
