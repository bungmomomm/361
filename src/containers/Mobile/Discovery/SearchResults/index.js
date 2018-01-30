import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Header, Page, Card, Svg, Tabs, Button, Level, Image, Input, Navigation, /* Spinner */ } from '@/components/mobile';
import stylesSearch from '../Search/search.scss';
import stylesCatalog from '../Category/Catalog/catalog.scss';
import { actions } from '@/state/v4/SearchResults';
import queryString from 'query-string';
import { Link } from 'react-router-dom';

class SearchResults extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.userCookies = this.props.cookies.get('user.token');

		this.parsedUrl = queryString.parse(this.props.location.search);
		this.objParam = {
			query: this.parsedUrl.query !== undefined ? this.parsedUrl.query : '',
			brand_id: this.parsedUrl.brand_id !== undefined ? this.parsedUrl.brand_id : '',
			store_id: this.parsedUrl.store_id !== undefined ? this.parsedUrl.store_id : '',
			category_id: this.parsedUrl.category_id !== undefined ? this.parsedUrl.category_id : '',
			page: this.parsedUrl.page !== undefined ? this.parsedUrl.page : 1,
			per_page: this.parsedUrl.per_page !== undefined ? this.parsedUrl.per_page : 10,
			sort: this.parsedUrl.sort !== undefined ? this.parsedUrl.sort : 'energy DESC',
		};

		this.currentListState = 0;
		this.listType = [{
			type: 'grid',
			icon: 'ico_list.svg'
		}, {
			type: 'list',
			icon: 'ico_grid.svg'
		}];
		this.state = {
			listTypeState: this.listType[this.currentListState]
		};
	}

	componentDidMount() {
		this.props.dispatch(actions.initAction(this.userCookies, this.objParam));
	}

	handlePick(e) {
		switch (e) {
		case 'view':
			this.currentListState = this.currentListState === 1 ? 0 : this.currentListState + 1;
			this.setState({ listTypeState: this.listType[this.currentListState] });
			break;
		case 'filter':
			this.props.history.push('/filterCategory');
			break;
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
				<div className={stylesSearch.container} >
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
			);
		}

		return null;
	}

	notFound() {
		console.log('NotFound');
		const inlineStyle = {
			textAlign: 'center',
			margin: '10px auto 10px auto'
		};
		return (
			<div className={stylesSearch.container} >
				<div style={inlineStyle}>[image kantong kosong]</div>
				<div style={inlineStyle}>
					{'Mohon maaf hasil pencarian untuk "'}{this.objParam.query}
					{ '" tidak dapat ditemukan. Silakan periksa pengejaan kata, atau menggunakan kata kunci lain!'}
				</div>
				<div><button><Link to={'/search'}>Cari kembali</Link></button></div>
				<div style={inlineStyle}>[Rich Relevant Recommendation section]</div>
				<div style={inlineStyle}>[Footer]</div>
			</div>
		);
	}

	searchFound(products) {
		console.log('SearchFound');
		if (products.length > 0) {
			return (
				<div className={stylesCatalog.cardContainer}>
					{
						products.map((product, index) => 
							this.renderList(product, index)
						)
					}
				</div>
			);
		}

		return null;
	}

	searchRender() {
		let searchView = null;
		const searchResults = this.props.searchResults;
		if (typeof searchResults.searchStatus !== 'undefined' && searchResults.searchStatus !== '') {
			if (searchResults.searchStatus === 'success' && searchResults.searchData.products.length > 0) {
				searchView = (
					<div>
						{ 
							this.searchFound(searchResults.searchData.products)
						}
						<div className={stylesCatalog.loadmore}>
							<Button color='secondary' outline size='large'> LOAD MORE </Button>
						</div>
					</div>
				);
			} else if (searchResults.searchStatus === 'failed') {
				searchView = (
					<div>{this.notFound()}</div>
				);
			}
		} else {
			searchView = null; // TO DO: change this with loading state
		}

		return searchView;
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
							images={productData.images_url}
							productTitle={productData.product_title}
							brandName={productData.brand}
							basePrice={productData.pricing.formatted.base_price}
							effectivePrice={productData.pricing.formatted.effective_price}
						/>
						{renderBlockComment}
					</div>
				);
			case 'grid':
				return (
					<Card.CatalogGrid
						key={index}
						image={productData.images_url}
						productTitle={productData.product_title}
						basePrice={productData.pricing.formatted.base_price}
						effectivePrice={productData.pricing.formatted.effective_price}
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
		let back = () => { this.props.history.go(-2); };
		if (this.props.history.length === 0) {
			back = () => { this.props.history.push('/'); };
		}

		const { listTypeState } = this.state;

		return (
			<div style={this.props.style}>
				<Page>
					<div>
						{
							this.props.isLoading ? this.loadingRender() : this.searchRender()
						}
					</div>
				</Page>
				<Header.SearchResult
					back={back}
					value={this.objParam.query || ''}
				/>
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
							Title: <Svg src={listTypeState.icon} />
						}
					]}
					onPick={e => this.handlePick(e)}
				/>
				<Navigation />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	console.log(state);
	return {
		...state,
		shared: state.shared,
		searchResult: state.searchResult,
		isLoading: state.searchResults.isLoading
	};
};

export default withCookies(connect(mapStateToProps)(SearchResults));