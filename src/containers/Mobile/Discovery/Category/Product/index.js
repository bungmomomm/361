import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Header, Page, Card, Svg, Tabs, Button, Level, Image, Input, Navigation } from '@/components/mobile';
import stylesCatalog from '../Catalog/catalog.scss';
import Shared from '@/containers/Mobile/Shared';
import { actions } from '@/state/v4/ProductCategory';
import queryString from 'query-string';
import Scroller from '@/containers/Mobile/Shared/scroller';

class Product extends Component {
	constructor(props) {
		super(props);
		this.props = props;

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
		this.state = {
			listTypeState: this.listType[this.currentListState]
		};
	}

	handlePick(e) {
		switch (e) {
		case 'view':
			this.currentListState = this.currentListState === 2 ? 0 : this.currentListState + 1;
			this.setState({ listTypeState: this.listType[this.currentListState] });
			break;
		// case 'filter':
		// 	this.props.history.push('/filterCategory');
		// 	break;
		default:
			break;
		}
	}

	loadingRender() {
		const inlineStyle = {
			textAlign: 'center',
			margin: '10px auto 10px auto'
		};

		if (this.props.isLoading === true) {
			return (
				<div style={this.props.style}>
					<Page>
						<div style={inlineStyle}>&nbsp;</div>
						<div style={inlineStyle}>&nbsp;</div>
						<div style={inlineStyle}>&nbsp;</div>
						<div style={inlineStyle}>&nbsp;</div>
						<div style={inlineStyle}>Loading...</div>
						<div style={inlineStyle}>&nbsp;</div>
						<div style={inlineStyle}>&nbsp;</div>
						<div style={inlineStyle}>&nbsp;</div>
						<div style={inlineStyle}>&nbsp;</div>
					</Page>
				</div>
			);
		}

		return null;
	}

	pcpRender() {
		let pcpView = null;
		const pcpResults = this.props.productCategory;
		if (typeof pcpResults.pcpStatus !== 'undefined' && pcpResults.pcpStatus !== '') {
			if (pcpResults.pcpStatus === 'success' && pcpResults.pcpData.products.length > 0) {
				pcpView = (
					<div style={this.props.style}>
						<Page>
							<div>&nbsp;</div>
							<div>&nbsp;</div>
							<div>&nbsp;</div>
							<div>&nbsp;</div>
							<div>&nbsp;</div>
							<div>&nbsp;</div>
							<div>&nbsp;</div>
							<div>&nbsp;</div>
							<div className={stylesCatalog.cardContainer}>
								{
									pcpResults.pcpData.products.map((product, index) => 
										this.renderList(product, index)
									)
								}
							</div>
						</Page>
						{this.renderHeader()}
						{this.renderTabs()}
						<Navigation active='Categories' />

						{this.props.scroller && this.props.scroller.loading}
					</div>
				);
			} else if (pcpResults.pcpStatus === 'failed') {
				window.location.href = '/not-found';
			}
		}

		return pcpView;
	}

	renderList(productData, index) {
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
							brandName={productData.brand}
							pricing={productData.pricing}
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
						brandName={productData.brand}
						pricing={productData.pricing}
					/>
				);
			case 'small':
				return (
					<Card.CatalogSmall
						key={index}
						images={productData.images}
						pricing={productData.pricing}
					/>
				);
			default:
				return null;
			}
		} else {
			return null;
		}
	}

	renderHeader() {
		let back = () => { this.props.history.goBack(); };
		if (this.props.history.length === 0) {
			back = () => { this.props.history.push('/'); };
		}

		const pcpResults = this.props.productCategory;
		const HeaderPage = {
			left: (
				<Link to='' onClick={back}>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: pcpResults.pcpData.info.title || '',
			right: null
		};

		return (
			<Header.Modal {...HeaderPage} />
		);
	}

	renderTabs() {
		return (
			<Tabs
				className={stylesCatalog.fixed}
				type='segment'
				variants={[
					{
						id: 'urutkan',
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

	render() {
		return this.props.isLoading ? this.loadingRender() : this.pcpRender();
	}
}

const mapStateToProps = (state) => {
	return {
		shared: state.shared,
		productCategory: state.productCategory,
		isLoading: state.productCategory.isLoading,
		scroller: state.scroller
	};
};

const doAfterAnonymous = (props) => {
	console.log(props);
	const { shared, dispatch, cookies, match, location } = props;

	const productService = _.chain(shared).get('serviceUrl.product').value() || false;
	const parsedUrl = queryString.parse(location.search);
	const pcpParam = {
		category_id: match.params.categoryId !== undefined ? parseInt(match.params.categoryId, 10) : '',
		page: parsedUrl.page !== undefined ? parsedUrl.page : 1,
		per_page: parsedUrl.per_page !== undefined ? parsedUrl.per_page : 10,
		fq: parsedUrl.fq !== undefined ? parsedUrl.fq : '',
		sort: parsedUrl.sort !== undefined ? parsedUrl.sort : 'energy DESC',
	};
	
	dispatch(actions.initAction(cookies.get('user.token'), productService, pcpParam));
};

// export default withCookies(connect(mapStateToProps)(Shared(Product, doAfterAnonymous)));
export default withCookies(connect(mapStateToProps)(Shared(Scroller(Product), doAfterAnonymous)));