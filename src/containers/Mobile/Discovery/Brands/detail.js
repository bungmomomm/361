import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import {
	Page,
	Navigation,
	Card,
	Svg,
	Header,
	Button,
	Tabs,
	Level,
	Input,
	Comment
} from '@/components/mobile';
import styles from './brands.scss';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Filter from '@/containers/Mobile/Shared/Filter';
import CONST from '@/constants';
import { actions as brandAction } from '@/state/v4/Brand';
import Shared from '@/containers/Mobile/Shared';
import stylesCatalog from '@/containers/Mobile/Discovery/Category/Catalog/catalog.scss';
import queryString from 'query-string';
import renderIf from '../../../../utils/renderIf';
import Sort from '@/containers/Mobile/Shared/Sort';

class Detail extends Component {
	static queryObject(props) {
		const brandId = props.match.params.brandId;
		const parsedUrl = queryString.parse(props.location.search);
		return {
			q: parsedUrl.query !== undefined ? parsedUrl.query : '',
			brand_id: Number(brandId),
			store_id: parsedUrl.store_id !== undefined ? parseInt(parsedUrl.store_id, 10) : '',
			category_id: parsedUrl.category_id !== undefined ? parseInt(parsedUrl.category_id, 10) : '',
			page: parsedUrl.page !== undefined ? parseInt(parsedUrl.page, 10) : 1,
			per_page: parsedUrl.per_page !== undefined ? parseInt(parsedUrl.per_page, 10) : 10,
			fq: parsedUrl.fq !== undefined ? parsedUrl.fq : '',
			sort: parsedUrl.sort !== undefined ? parsedUrl.sort : 'energy DESC',
		};
	}

	constructor(props) {
		super(props);
		this.props = props;
		this.listType = [{
			type: 'list',
			icon: 'ico_grid.svg'
		}, {
			type: 'grid',
			icon: 'ico_three-line.svg'
		}, {
			type: 'small',
			icon: 'ico_list.svg'
		}];
		const propsObject = _.chain(props.searchResults);
		this.currentListState = 0;
		this.handleScroll = this.handleScroll.bind(this);
		this.state = {
			listTypeState: this.listType[this.currentListState],
			styleHeader: true,
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

		this.userToken = this.props.cookies.get(CONST.COOKIE_USER_TOKEN);
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll, true);

		if ('serviceUrl' in this.props.shared) {
			const { dispatch, shared } = this.props;
			const searchService = _.chain(shared).get('serviceUrl.product').value() || false;
			dispatch(brandAction.brandProductAction(this.userToken, searchService, Detail.queryObject(this.props)));
			dispatch(brandAction.brandBannerAction(this.userToken, this.props.match.params.brandId));
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!('serviceUrl' in this.props.shared) && 'serviceUrl' in nextProps.shared) {
			const { dispatch, shared } = nextProps;
			const searchService = _.chain(shared).get('serviceUrl.product').value() || false;
			dispatch(brandAction.brandProductAction(this.userToken, searchService, Detail.queryObject(nextProps)));
			dispatch(brandAction.brandBannerAction(this.userToken, nextProps.match.params.brandId));
		}

		if (this.props.brands.searchData.products !== nextProps.brands.searchData.products) {
			const { dispatch } = this.props;
			const productId = nextProps.brands.searchData.products.map(e => (e.product_id));
			dispatch(brandAction.brandProductsCommentsAction(this.userToken, productId));
		}
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll, true);
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

	handleScroll(e) {
		const { styleHeader } = this.state;
		if (e.target.scrollTop > 300 && styleHeader) {
			this.setState({ styleHeader: false });
		}
		if (e.target.scrollTop < 300 && !styleHeader) {
			this.setState({ styleHeader: true });
		}
	}

	handlePick(e) {
		if (e === 'view') {
			this.currentListState = this.currentListState === 2 ? 0 : this.currentListState + 1;
			this.setState({ listTypeState: this.listType[this.currentListState] });
		} else {
			this.setState({
				showFilter: e === 'filter',
				showSort: e === 'sort'
			});
		}
	}

	update(params) {
		const { shared, cookies, dispatch, location, history, match } = this.props;
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
		history.push(`${match.params.brandTitle}?${url}`);
		const searchService = _.chain(shared).get('serviceUrl.product').value() || false;
		const objParam = {
			...query,
			...params
		};
		dispatch(brandAction.brandProductAction(cookies.get('user.token'), searchService, objParam));
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


	renderComment(productId) {
		let komen = null;
		if (this.props.brands.products_comments) {
			const commentData = this.props.brands.products_comments.filter(e => e.product_id === productId)[0];
			komen = (
				<div className={stylesCatalog.commentBlock}>
					<Link to={`/product/comments/${commentData.product_id}`}>
						<Button>View {commentData.total} comments</Button>
					</Link>
					<Comment data={commentData.last_comment} type='lite-review' />
					<Level>
						<Level.Item>
							<Input color='white' placeholder='Write comment' />
						</Level.Item>
					</Level>
				</div>
			);

		}
		return (
			<div>
				{ komen }
				<Level>
					<Level.Item>
						<Input color='white' placeholder='Write comment' />
					</Level.Item>
				</Level>
			</div>
		);

	}

	renderBenner() {
		const { brands } = this.props;

		const brand = _.chain(brands);
		const bannerImages = brand.get('banner.image');
		const brandTitle = brand.get('searchData.info.title');
		const productCount = brand.get('searchData.info.product_count');

		const imgBg = !bannerImages.isEmpty().value() ? { backgroundImage: `url(${bannerImages.value().thumbnail})` }
			: {};

		return (
			<div
				className={`${styles.backgroundCover} flex-center`}
				style={imgBg}
			>
				<div className='text-uppercase font--lato-bold font-medium'>{brandTitle.value() || ''}</div>
				<div>{(productCount.value()) && (`${productCount.value()} Produk`)}</div>
			</div>
		);
	}

	renderFilter() {
		const isProductSet = this.props.brands.searchData.products.length >= 1;
		const { showSort } = this.state;
		const sorts = _.chain(this.props.brands).get('searchData.sorts').value() || [];
		if (isProductSet) {
			return (
				<div>
					<Tabs
						className='margin--medium'
						type='segment'
						variants={[
							{
								id: 'sort',
								title: 'Urutkan',
								disabled: !isProductSet
							},
							{
								id: 'filter',
								title: 'Filter',
								disabled: !isProductSet
							},
							{
								id: 'view',
								title: <Svg src={this.state.listTypeState.icon} />,
								disabled: !isProductSet
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

		return null;
	}

	renderProduct() {
		const { brands } = this.props;
		const { listTypeState } = this.state;
		const brandProducts = _.chain(brands.searchData).get('products');

		if (!brandProducts.isEmpty().value()) {
			switch (listTypeState.type) {
			case 'grid':
				return (
					<div className='flex-row flex-wrap'>
						{
							brandProducts.value().map((product, e) => (
								<Card.CatalogGrid
									key={e}
									images={product.images}
									productTitle={product.product_title}
									brandName={product.brand.name}
									pricing={product.pricing}
									linkToPdp={`/product/${product.product_id}`}
								/>
							))
						}
					</div>
				);
			case 'small':
				return (
					<div className='flex-row flex-wrap'>
						{
							brandProducts.value().map((product, e) => (
								<Card.CatalogSmall
									key={e}
									images={product.images}
									pricing={product.pricing}
									linkToPdp={`/product/${product.product_id}`}
								/>
							))
						}
					</div>
				);
			default:
				return (
					<div className='flex-row flex-wrap'>

						{
							brandProducts.value().map((product, e) => (
								<div key={e} className={stylesCatalog.cardCatalog}>
									<Card.Catalog
										images={product.images}
										productTitle={product.product_title}
										brandName={product.brand.name}
										pricing={product.pricing}
										// commentTotal={10}
										commentUrl={`/product/comments/${product.product_id}`}
										linkToPdp={`/product/${product.product_id}`}
									/>
									{this.renderComment(product.product_id)}
								</div>
							))
						}
					</div>
				);
			}

		}

		return null;
	}

	render() {
		const { styleHeader, showFilter } = this.state;
		const headerComponent = {
			left: (
				<span
					onClick={() => this.props.history.goBack()}
					role='button'
					tabIndex='0'
				>
					<Svg src='ico_arrow-back-left.svg' />
				</span>
			),
			center: 'Brand', // (imgBanner) ? '' : 'Brand',
			right: <Button><Svg src='ico_share.svg' /></Button>
		};
		return (
			<div style={this.props.style}>
				<Page>
					<div style={{ marginTop: '-112px', marginBottom: '30px' }}>
						{(showFilter) ? (
							<Filter
								shown={showFilter}
								filters={this.props.brands.searchData}
								onApply={(e, fq) => {
									this.onApply(e, fq);
								}}
								onClose={(e) => this.onClose(e)}
							/>
						) : (
							<div>
								{this.renderBenner()}
								{this.renderFilter()}
								{this.renderProduct()}
							</div>
						)
						}
					</div>
				</Page>

				{(!showFilter) && (
					<div>
						<Header.Modal className={styleHeader ? styles.headerClear : ''} {...headerComponent} />
						<Navigation active='Categories' />
					</div>
				)}
			</div>
		);

	}
}

const mapStateToProps = (state) => {
	return {
		category: state.category,
		brands: state.brands,
		shared: state.shared
	};
};

export default withCookies(connect(mapStateToProps)(Shared(Detail)));