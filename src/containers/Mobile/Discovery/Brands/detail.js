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
		window.addEventListener('scroll', this.handleScroll, true);
		if ('serviceUrl' in this.props.shared) {
			const { dispatch } = this.props;
			dispatch(brandAction.brandProductAction(this.userToken, 'brandId-123'));
			dispatch(brandAction.brandBannerAction(this.userToken, 'brandId-123'));
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
			dispatch(brandAction.brandProductsCommentsAction(this.userCookies, productId));
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
		if (this.props.brands.products_comments) {
			const commentData = this.props.brands.products_comments.filter(e => e.product_id === productId)[0];
			return (
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
		return false;

	}

	renderList(product, index) {
		if (product) {
			const urlPcp = `/product/${product.product_id}`;
			const comment = (this.props.brands.products_comments) ?
				this.props.brands.products_comments.filter(e => e.product_id === product.product_id)[0] : null;
			switch (this.state.listTypeState.type) {
			case 'list':
				return (
					<div key={index} className={stylesCatalog.cardCatalog}>
						<Card.Catalog
							images={product.images}
							productTitle={product.product_title}
							brandName={product.brand}
							pricing={product.pricing}
							url={urlPcp}
							commentTotal={(comment) ? comment.total : null}
							commentUrl={`/product/comments/${product.product_id}`}
						/>
						{this.renderComment(product.product_id)}
					</div>
				);
			case 'grid':
				return (
					<Card.CatalogGrid
						key={index}
						images={product.images}
						productTitle={product.product_title}
						brandName={product.brand}
						pricing={product.pricing}
						url={urlPcp}
					/>
				);
			case 'small':
				return (
					<Card.CatalogSmall
						key={index}
						images={product.images}
						pricing={product.pricing}
						url={urlPcp}
					/>
				);
			default:
				return null;
			}
		}
		return null;
	}

	render() {
		const imgBanner = this.props.brands.banner && this.props.brands.banner.images.mobile;
		const renderBenner = (imgBanner && this.props.brands.brand_info) ?
		(
			<div
				className={`${styles.backgroundCover} flex-center`}
				style={
					{ backgroundImage: `url(${imgBanner})` }}
			>
				<div className='text-uppercase font--lato-bold font-medium'>
					{this.props.brands.brand_info.title}
				</div>
				<div>{this.props.brands.brand_info.product_count} produk</div>
			</div>
		) : '';

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
			center: (imgBanner) ? '' : 'Brand',
			right: <Button><Svg src='ico_share.svg' /></Button>
		};

		const renderTabs = this.props.brands.brand_info && (
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

		const renderProduct = this.props.brands.products
			&& this.props.brands.products.map((product, index) => this.renderList(product, index));

		return (
			<div>
				{ this.props.brands.products && (
					<div style={this.props.style}>
						<Page>
							<div style={{ marginTop: '-61px', marginBottom: '30px' }}>
								{renderBenner}
								{renderTabs}
								<div className='flex-row flex-wrap'>
									{(renderProduct) || '' }
								</div>

								{/* <div className='flex-center margin--large'>
									<Button color='secondary' outline size='large'> LOAD MORE </Button>
								</div> */}
							</div>
						</Page>
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