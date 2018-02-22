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

import CONST from '@/constants';
import { actions as brandAction } from '@/state/v4/Brand';
import Shared from '@/containers/Mobile/Shared';
import stylesCatalog from '@/containers/Mobile/Discovery/Category/Catalog/catalog.scss';

class Detail extends Component {
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

		this.currentListState = 0;
		this.handleScroll = this.handleScroll.bind(this);
		this.state = {
			listTypeState: this.listType[this.currentListState],
			styleHeader: true
		};

		this.userToken = this.props.cookies.get(CONST.COOKIE_USER_TOKEN);
	}
	componentDidMount() {
		const { match } = this.props;
		window.addEventListener('scroll', this.handleScroll, true);

		if ('serviceUrl' in this.props.shared) {
			const { dispatch } = this.props;
			dispatch(brandAction.brandProductAction(this.userToken, match.params.brandId));
			dispatch(brandAction.brandBannerAction(this.userToken, match.params.brandId));
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!('serviceUrl' in this.props.shared) && 'serviceUrl' in nextProps.shared) {
			const { dispatch } = this.props;
			dispatch(brandAction.brandProductAction(this.userToken, nextProps.match.params.brandId));
			dispatch(brandAction.brandBannerAction(this.userToken, nextProps.match.params.brandId));
		}

		if (this.props.brands.products !== nextProps.brands.products) {
			const { dispatch } = this.props;
			const productId = nextProps.brands.products.map(e => (e.product_id));
			dispatch(brandAction.brandProductsCommentsAction(this.userToken, productId));
		}
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll, true);
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
				filterShown: e === 'filter',
				sortShown: e === 'sort'
			});
		}
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

		const bren = _.chain(brands);
		const bannerImages = bren.get('banner.image');
		const brandTitle = bren.get('brand_info.title');
		const productCount = bren.get('brand_info.product_count');

		const imgBg = !bannerImages.isEmpty().value() ? { backgroundImage: `url(${bannerImages.value().thumbnail})` } : {};

		return (
			<div
				className={`${styles.backgroundCover} flex-center`}
				style={imgBg}
			>
				<div className='text-uppercase font--lato-bold font-medium'>{brandTitle.value() || ''}</div>
				<div>{productCount.value() || 0}</div>
			</div>
		);
	}

	renderFilter() {
		const { brands } = this.props;
		const brandInfo = _.chain(brands).get('brand_info');

		if (!brandInfo.isEmpty().value()) {
			return (
				<Tabs
					className='margin--medium'
					type='segment'
					variants={[
						{
							id: 'sort',
							title: 'Urutkan'
						},
						{
							id: 'filter',
							title: 'Filter'
						},
						{
							id: 'view',
							title: <Svg src={this.state.listTypeState.icon} />
						}
					]}
					onPick={e => this.handlePick(e)}
				/>
			);
		}

		return null;
	}

	renderProduct() {
		const { brands } = this.props;
		const { listTypeState } = this.state;

		const brandProducts = _.chain(brands).get('products');

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
										// url={`/product/${product.product_id}`}
										// commentTotal='10'// {comment.total}
										// commentUrl={`/product/comments/${product.product_id}`}
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
		const { styleHeader } = this.state;
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
					<div style={{ marginTop: '-61px', marginBottom: '30px' }}>
						{ this.renderBenner() }
						{ this.renderFilter() }
						{ this.renderProduct() }
					</div>
				</Page>
				<Header.Modal className={styleHeader ? styles.headerClear : ''} {...headerComponent} />
				<Navigation active='Categories' />
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