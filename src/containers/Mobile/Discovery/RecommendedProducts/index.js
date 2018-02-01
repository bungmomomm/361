import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Header, Page, Navigation, Svg, Card, Grid } from '@/components/mobile';
import { actions as recommendedActions } from '@/state/v4/RecommendedProducts';
import { withRouter } from 'react-router-dom';

class RecommendedProducts extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.userCookies = this.props.cookies.get('user.token');
		this.switchMode = this.switchMode.bind(this);
		this.touchDown = this.touchDown.bind(this);
	}

	componentDidMount() {
		window.addEventListener('scroll', this.touchDown, true);

		const dataInit = {
			token: this.userCookies,
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

	touchDown() {
		if (this.props.links.next && !this.props.isLoading)	{
			const nextLink = new URL(this.props.links.next).searchParams;

			const dataInit = {
				token: this.userCookies,
				page: nextLink.get('page')
			};

			this.props.initAction(dataInit);
		}
	};

	render() {
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

		const ProductCard = (productData) => {
			let productCard;

			switch (this.props.viewMode) {
			case 3:
				productCard = (
					<Card.CatalogSmall
						key={productData.idx}
						images={productData.images}
						pricing={productData.pricing}
					/>
				);
				break;
			case 2:
				productCard = (
					<Card.CatalogGrid
						key={productData.idx}
						images={productData.images}
						productTitle={productData.product_title}
						brandName={productData.brand}
						pricing={productData.pricing}
					/>
				);
				break;
			default:
				productCard = (
					<Card.Catalog
						key={productData.idx}
						images={productData.images}
						productTitle={productData.product_title}
						brandName={productData.brand}
						pricing={productData.pricing}
					/>
				);
			}

			return productCard;
		};

		return (
			<div style={this.props.style}>
				<Page>
					<Grid split={this.props.viewMode} >
						{
							this.props.products
							&&
							this.props.products.length
							&&
							this.props.products.map((product, i) => (
								<ProductCard {...product} idx={product.product_id} />
							))
						}
					</Grid>

					{this.props.isLoading && <button>&hellip;</button>}
				</Page>

				<Header.Modal {...HeaderPage} />
				<Navigation />
			</div>);
	}
}

const mapStateToProps = (state) => {
	return {
		...state.recommendedproducts
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		initAction: (token, page) => dispatch(recommendedActions.initAction(token, page)),
		switchMode: (mode) => dispatch(recommendedActions.switchViewMode(mode))
	};
};

export default withRouter(withCookies(connect(mapStateToProps, mapDispatchToProps)(RecommendedProducts)));
