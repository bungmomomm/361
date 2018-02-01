import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { Header, Page, Card, Svg, Tabs, Button, Level, Image, Input, Navigation } from '@/components/mobile';
import stylesCatalog from '../Catalog/catalog.scss';
import { actions } from '@/state/v4/ProductCategory';

class Product extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.userCookies = this.props.cookies.get('user.token');
		this.categoryId = this.props.match.params.categoryId;

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
  
	componentDidMount() {
		const pcpParam = {
			category_id: this.categoryId
		};
		this.props.dispatch(actions.initAction(this.userCookies, pcpParam));
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
				<Page>
					<div>
						<div style={inlineStyle}>&nbsp;</div>
						<div style={inlineStyle}>&nbsp;</div>
						<div style={inlineStyle}>&nbsp;</div>
						<div style={inlineStyle}>&nbsp;</div>
						<div style={inlineStyle}>Loading...</div>
						<div style={inlineStyle}>&nbsp;</div>
						<div style={inlineStyle}>&nbsp;</div>
						<div style={inlineStyle}>&nbsp;</div>
						<div style={inlineStyle}>&nbsp;</div>
					</div>
				</Page>
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
					<Page>
						<div className={stylesCatalog.cardContainer}>
							{
								pcpResults.pcpData.products.map((product, index) => 
									this.renderList(product, index)
								)
							}
						</div>
						<div className={stylesCatalog.loadmore}>
							<Button color='secondary' outline size='large'> LOAD MORE </Button>
						</div>
					</Page>
				);
			} else if (pcpResults.pcpStatus === 'failed') {
				pcpView = (<Page.Page404 />);
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

	render() {
		let back = () => { this.props.history.go(-1); };
		if (this.props.history.length === 0) {
			back = () => { this.props.history.push('/'); };
		}

		const HeaderPage = {
			left: (
				<Link to='' onClick={back}>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			), 
			center: this.props.productCategory.pcpData.info.title || '',
			right: null
		};

		return (
			<div style={this.props.style}>
				{
					this.props.isLoading ? this.loadingRender() : this.pcpRender()
				}
				<Header.Modal {...HeaderPage} />
				<Tabs
					className={stylesCatalog.fixed}
					type='segment'
					variants={[
						{
							id: 'urutkan',
							Title: 'Urutkan'
						},
						{
							id: 'filter',
							Title: 'Filter'
						},
						{
							id: 'view',
							Title: <Svg src={this.state.listTypeState.icon} />
						}
					]}
					onPick={e => this.handlePick(e)}
				/>
				<Navigation active='Categories' />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	console.log(state);
	return {
		...state,
		shared: state.shared,
		isLoading: state.productCategory.isLoading
	};
};

export default withCookies(connect(mapStateToProps)(Product));