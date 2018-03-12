import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Header, Page, Navigation, Svg, Card, Grid } from '@/components/mobile';
import { actions as recommendedActions } from '@/state/v4/RecommendedProducts';
import Love from '@/containers/Mobile/Shared/Widget/Love';
import { withRouter } from 'react-router-dom';
import Discovery from '../Utils';
import _ from 'lodash';

class RecommendedProducts extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.switchMode = this.switchMode.bind(this);
		this.touchDown = this.touchDown.bind(this);
	}

	componentDidMount() {
		const { cookies } = this.props;
		window.addEventListener('scroll', this.touchDown, true);

		const dataInit = {
			token: cookies.get('user.token'),
			page: this.props.nextPage,
			docHeight: this.props.docHeight ? this.props.docHeight : 0
		};
		this.props.initAction(dataInit);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.touchDown);
	}

	switchMode(e) {
		e.preventDefault();
		const mode = (this.props.viewMode === 3) ? 1 : (this.props.viewMode === 1) ? 2 : 3;
		this.props.switchMode(mode);
	}

	forceLoginNow() {
		const { history } = this.props;
		history.push(`/login?redirect_uri=${location.pathname}`);
	}

	touchDown(e) {
		const { cookies } = this.props;
		const body = document.body;
		const html = document.documentElement;

		const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
		const scrollY = e.srcElement.scrollTop;
		const scrHeight = window.screen.height;

		if ((scrollY + scrHeight) >= docHeight && this.props.links.next && !this.props.isLoading)	{
			const nextLink = new URL(this.props.links.next).searchParams;

			const dataInit = {
				token: cookies.get('user.token'),
				page: nextLink.get('page')
			};

			this.props.initAction(dataInit);
		}
	};

	render() {
		const { isLoading, recommendedproducts, style, viewMode } = this.props;
		
		const HeaderPage = {
			left: (
				<button onClick={this.props.history.goBack}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</button>
			),
			center: 'Recommended Products',
			right: (
				<button onClick={this.switchMode}>
					|||
				</button>
			)
		};

		const ProductCard = (product) => {
			let productCard;

			switch (this.props.viewMode) {
			case 3:
				productCard = (
					<Card.CatalogSmall
						key={product.idx}
						images={product.images}
						pricing={product.pricing}
					/>
				);
				break;
			case 2:
				productCard = (
					<Card.CatalogGrid
						key={product.idx}
						images={product.images}
						productTitle={product.product_title}
						brandName={product.brand}
						pricing={product.pricing}
						linkToPdp={product.url}
						love={(
							<Love
								status={product.lovelistStatus}
								data={product.product_id}
								total={product.lovelistTotal}
								onNeedLogin={() => this.forceLoginNow()}
								showNumber
							/>
						)}
					/>
				);
				break;
			default:
				productCard = (
					<Card.Catalog
						key={product.idx}
						images={product.images}
						productTitle={product.product_title}
						brandName={product.brand}
						pricing={product.pricing}
					/>
				);
			}

			return productCard;
		};

		return (
			<div style={style}>
				<Page>
					<Grid split={viewMode} >
						{
							recommendedproducts.products
							&&
							recommendedproducts.products.length
							&&
							recommendedproducts.products.map((product, i) => (
								<ProductCard {...product} idx={product.product_id} />
							))
						}
					</Grid>

					{isLoading && <button>&hellip;</button>}
				</Page>

				<Header.Modal {...HeaderPage} />
				<Navigation />
			</div>);
	}
}

const mapStateToProps = (state) => {
	const { comments, lovelist, recommendedproducts } = state;
	recommendedproducts.products = Discovery.mapProducts(recommendedproducts.products, comments, lovelist);
	return {
		recommendedproducts: {
			...recommendedproducts
		}
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		initAction: (token, page) => dispatch(recommendedActions.initAction(token, page)),
		switchMode: (mode) => dispatch(recommendedActions.switchViewMode(mode))
	};
};

export default withRouter(withCookies(connect(mapStateToProps, mapDispatchToProps)(RecommendedProducts)));
