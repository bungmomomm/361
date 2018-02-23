import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Navigation, Svg, Tabs, Header, Page, Button, Level, Image, Input, Card, Grid } from '@/components/mobile';
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

class Seller extends Component {
	constructor(props) {
		super(props);

		this.currentListState = 0;
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
				showSort: val === 'sort'
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
		const { listTypeState, showSort } = this.state;
		const sorts = _.chain(seller).get('data.sorts').value() || [];

		return (
			<div style={this.props.style}>
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

		return (
			<div>
				<div>
					<Grid split={4}>
						<div>
							<Image width={60} src={seller.info.seller_logo || ''} />
							<br />
							{seller.info.seller || ''}
							<p>
								{seller.info.seller_location || ''}
							</p>
						</div>
						<div>
							<Image width={60} src={seller.info.seller_badge_image || ''} />
							<br />
							{seller.info.seller_badge || ''}
						</div>
						<div>
							{seller.info.rating || ''}
						</div>
						<div>
							{seller.info.product || ''}
						</div>
					</Grid>
				</div>
				<div>
					{seller.info.description || ''}
				</div>
			</div>
		);
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

	renderData = () => {
		const { showFilter } = this.state;
		const { seller, history } = this.props;
		const title = seller.info.seller;
		const url = `${process.env.MOBILE_URL}/store/${seller.info.seller_id}`;

		const HeaderPage = {
			left: (
				<Button onClick={history.goBack}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</Button>
			),
			center: null,
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
							{this.sellerHeader()}
							{this.loadProducts()}
							{this.props.scroller.loading && <Spinner />}
							{this.filterTabs()}
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
