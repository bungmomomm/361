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
import { actions as brandAction } from '@/state/v4/Brand';
import Shared from '@/containers/Mobile/Shared';
import stylesCatalog from '@/containers/Mobile/Discovery/Category/Catalog/catalog.scss';
import queryString from 'query-string';
import { urlBuilder, renderIf } from '@/utils';
import Sort from '@/containers/Mobile/Shared/Sort';
import Love from '@/containers/Mobile/Shared/Widget/Love';
import Scroller from '@/containers/Mobile/Shared/scroller';
import Share from '@/components/mobile/Share';
import Footer from '@/containers/Mobile/Shared/footer';
import { actions as commentActions } from '@/state/v4/Comment';
import { actions as searchActions } from '@/state/v4/SearchResults';
import { actions as lovelistActions } from '@/state/v4/Lovelist';
import { Promise } from 'es6-promise';
import Spinner from '../../../../components/mobile/Spinner';

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
			icon: 'ico_grid-3x3.svg'
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
			},
			isFooterShow: true,
			newComment: { product_id: '', comment: '' },
			lovelistProductId: null
		};
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll, true);

		if ('serviceUrl' in this.props.shared) {
			const { dispatch, match: { params } } = this.props;
			const qs = queryString.parse(location.search);
			const data = {
				token: this.userToken,
				query: {
					brand_id: params.brandId || 0,
					...qs
				}
			};
			console.log('data', data);
			dispatch(brandAction.brandProductAction(data));
			dispatch(brandAction.brandBannerAction(this.userToken, this.props.match.params.brandId));
		}
	}

	componentWillReceiveProps(nextProps) {
		const { cookies } = this.props;
		if (!('serviceUrl' in this.props.shared) && 'serviceUrl' in nextProps.shared) {
			const { dispatch, match: { params } } = this.props;
			const qs = queryString.parse(location.search);
			const data = {
				token: this.userToken,
				query: {
					brand_id: params.brandId || 0,
					...qs
				}
			};
			console.log('data', data);
			dispatch(brandAction.brandProductAction(data));

			dispatch(brandAction.brandBannerAction(cookies.get('user.token'), nextProps.match.params.brandId));
		}

		if (this.props.brands.searchData.products !== nextProps.brands.searchData.products) {
			const { dispatch } = this.props;
			const productIdList = _.map(nextProps.brands.searchData.products, 'product_id') || [];
			if (productIdList.length > 0) {
				dispatch(searchActions.bulkieCommentAction(cookies.get('user.token'), productIdList));
				dispatch(lovelistActions.bulkieCountByProduct(cookies.get('user.token'), productIdList));
			}
		}

		if (nextProps.brands.products_lovelist !== this.props.brands.products_lovelist) {
			this.setState({ lovelistProductId: '' });
		}
		if (nextProps.brands.products_comments !== this.props.brands.products_comments) {
			this.setState({ newComment: { product_id: '', comment: '' } });
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

	onItemLoved(productId) {
		const { cookies, dispatch } = this.props;
		dispatch(searchActions.bulkieCommentAction(cookies.get('user.token'), [productId]));
		dispatch(lovelistActions.bulkieCountByProduct(cookies.get('user.token'), [productId]));
	}

	getCommentOfProduct(productId) {
		return this.props.brands.products_comments && this.props.brands.products_comments.filter(e => e.product_id === productId)[0];
	}
	
	getLovelistOfProduct(productId) {
		return this.props.brands.products_lovelist && this.props.brands.products_lovelist.filter(e => e.product_id === productId)[0];
	}

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
		history.push(`${params.brandTitle}?${url}`);
		const data = {
			token: cookies.get('user.token'),
			query: {
				...query,
				...filters,
				store_id: params.store_id || 0
			},
			type: 'init'
		};
		dispatch(brandAction.brandProductAction(data));
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

	handleScroll(e) {
		const { styleHeader } = this.state;
		if (e.target.scrollTop > 300 && styleHeader) {
			this.setState({ styleHeader: false });
		}
		if (e.target.scrollTop < 300 && !styleHeader) {
			this.setState({ styleHeader: true });
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

	forceLoginNow() {
		const { history, location } = this.props;
		history.push(`/login?redirect_uri=${location.pathname}`);
	}

	addCommentHandler(event, productId) {
		const { cookies } = this.props;
		if (event.key === 'Enter') {
			const { dispatch } = this.props;
			const newComment = this.state.newComment;
			const addingComment = new Promise((resolve, reject) => resolve(
				dispatch(commentActions.commentAddAction(cookies.get('user.token'), newComment.product_id, newComment.comment))
			));
			addingComment.then((res) => {
				const productIds = [productId];
				dispatch(brandAction.brandProductsCommentsAction(cookies.get('user.token'), productIds));
			}).catch((err) => this.setState({ newComment: { product_id: '', comment: '' } }));
		}
	}

	addCommentOnChange(event, productId) {
		this.setState({ newComment: { product_id: productId, comment: event.target.value } });
	}

	renderTabs() {
		const { searchResults } = this.props;
		const { showSort } = this.state;
		let tabsView = null;
		const sorts = _.chain(searchResults).get('searchData.sorts').value() || [];
		tabsView = (
			<div>
				<Tabs
					isSticky
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
		const { cookies } = this.props;
		const commentData = this.getCommentOfProduct(productId);
		let lastComments = null;
		if (commentData) {
			const lastCommentShorted = _.orderBy(commentData.last_comment, ['id']);
			lastComments = (
				<div>
					<Link to={`/product/comments/${commentData.product_id}`}>
						<Button>View {commentData.total} comments</Button>
					</Link>
					<Comment
						data={lastCommentShorted}
						type='lite-review'
						loading={this.props.brands.loading_prodcuts_comments}
					/>
				</div>
			);
		}
		return (<div className={stylesCatalog.commentBlock}>
			{lastComments}
			<Level>
				<Level.Item>
					{
						cookies.get('isLogin') === 'true' ?
							this.props.comments.loading || this.props.brands.loading_prodcuts_comments ? <div>Sending comment...</div> :
								(
									<Input
										color='white'
										placeholder='Write comment'
										onKeyPress={(e) => this.addCommentHandler(e, productId)}
										onChange={(e) => this.addCommentOnChange(e, productId)}
									/>)
						: (
							<span><Link to='/login'>Login / Register</Link> untuk memberikan komentar</span>
						)
					}
				</Level.Item>
			</Level>
		</div>);
	}

	renderBenner() {
		const { brands } = this.props;
		const brand = _.chain(brands);
		const bannerImages = brand.get('banner.images.original');
		const brandTitle = brand.get('searchData.info.title');
		const imgBg = !bannerImages.isEmpty().value() ? { backgroundImage: `url(${bannerImages.value()})` }
			: { backgroundImage: '' };
		return (
			<div
				className={`${styles.backgroundCover} border-bottom flex-center`}
			>
				<div className={styles.coverImage} style={imgBg} />
				<div>
					<div className='text-uppercase font--lato-bold font-large'>{brandTitle.value() || ''}</div>
				</div>
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
						isSticky
						className='margin--medium-v'
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
							brandProducts.value().map((product, e) => {
								const loveButton = (
									<Love
										status={product.lovelistStatus}
										data={product.product_id}
										total={product.lovelistTotal}
										onNeedLogin={() => this.forceLoginNow()}
									/>
								);
								return (
									<Card.CatalogGrid
										key={e}
										images={product.images}
										productTitle={product.product_title}
										brandName={product.brand.name}
										pricing={product.pricing}
										linkToPdp={product.url}
										love={loveButton}
									/>
								);
							})
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
									linkToPdp={product.url}
								/>
							))
						}
					</div>
				);
			default:
				return (
					<div className='flex-row flex-wrap'>
						{
							brandProducts.value().map((product, e) => {
								const loveButton = (
									<Love
										status={product.lovelistStatus}
										data={product.product_id}
										total={product.lovelistTotal}
										onNeedLogin={() => this.forceLoginNow()}
										showNumber
									/>
								);
								return (
									<div key={e} className={stylesCatalog.cardCatalog}>
										<Card.Catalog
											images={product.images}
											productTitle={product.product_title}
											brandName={product.brand.name}
											pricing={product.pricing}
											commentTotal={product.commentTotal}
											commentUrl={product.commentUrl}
											linkToPdp={product.url}
											love={loveButton}
										/>
										{this.renderComment(product.product_id)}
									</div>
								);
							})
						}
					</div>
				);
			}
		}

		return null;
	}

	renderHeader() {
		const { searchData } = this.props.brands;
		const title = (searchData.info) ? searchData.info.title : '';
		const url = `${process.env.MOBILE_URL}/${this.props.location.pathname}`;
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

			center: !this.state.styleHeader && 'Brand',
			right: <Share title={title} url={url} />
		};
		return <Header.Modal className={this.state.styleHeader ? styles.headerClear : ''} {...headerComponent} />;
	}

	renderTotalProduct() {
		const productCount = this.props.brands.searchData.info && this.props.brands.searchData.info.product_count;
		return productCount && (
			<div className='margin--medium-v margin--none-t text-center'>{productCount} Total Produk</div>
		);
	}

	render() {
		const { showFilter } = this.state;

		return (
			<div style={this.props.style}>
				<Page color='white'>
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
								{this.renderTotalProduct()}
								{this.renderProduct()}
								{this.props.scroller.loading && (<Spinner />)}
							</div>
						)
						}
					</div>
					<Footer isShow={this.state.isFooterShow} />
				</Page>

				{(!showFilter) && (
					<div>
						{this.renderHeader()}
						<Navigation active='Categories' scroll={this.props.scroll} />
					</div>
				)}
			</div>
		);

	}
}

const mapStateToProps = (state) => {
	const { comments, lovelist, brands } = state;
	brands.searchData.products = _.map(brands.searchData.products, (product) => {
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
		...state,
		brands
	};
};

const doAfterAnonymous = async (props) => {

};

export default withCookies(connect(mapStateToProps)(Scroller(Shared(Detail, doAfterAnonymous))));
