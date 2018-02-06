import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import _ from 'lodash';
import { Header, Page, Card, Svg, Tabs, Button, Level, Image, Input, Navigation } from '@/components/mobile';
import stylesSearch from '../Search/search.scss';
import stylesCatalog from '../Category/Catalog/catalog.scss';
import { actions } from '@/state/v4/SearchResults';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import Shared from '@/containers/Mobile/Shared';
import Scroller from '@/containers/Mobile/Shared/scroller';

class SearchResults extends Component {
	constructor(props) {
		super(props);
		this.props = props;

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

	getKeyword() {
		const parsedUrl = queryString.parse(this.props.location.search);
		const keywordFromUrl = parsedUrl.query !== undefined ? parsedUrl.query : '';

		return keywordFromUrl;
	}

	handlePick(e) {
		switch (e) {
		case 'view':
			this.currentListState = this.currentListState === 1 ? 0 : this.currentListState + 1;
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
				</Page>
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
			<div style={this.props.style}>
				<Page>
					<div className={stylesSearch.container} >
						<div style={inlineStyle}>[image kantong kosong]</div>
						<div style={inlineStyle}>
							{'Mohon maaf hasil pencarian untuk "'}{this.getKeyword()}
							{ '" tidak dapat ditemukan. Silakan periksa pengejaan kata, atau menggunakan kata kunci lain!'}
						</div>
						<div><button><Link to={'/search'}>Cari kembali</Link></button></div>
						<div style={inlineStyle}>[Rich Relevant Recommendation section]</div>
						<div style={inlineStyle}>[Footer]</div>
					</div>
				</Page>
				{this.renderHeader()}
			</div>
		);
	}

	searchFound(products) {
		console.log('SearchFound');
		if (products.length > 0) {
			return (
				<div style={this.props.style}>
					<Page>
						<div className={stylesSearch.container} >
							<div className={stylesCatalog.cardContainer}>
								{
									products.map((product, index) => 
										this.renderList(product, index)
									)
								}
							</div>
						</div>
					</Page>
					{this.renderHeader()}
					{this.renderTabs()}
					<Navigation />

					{this.props.scroller.loading}
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
				searchView = this.searchFound(searchResults.searchData.products);
			} else if (searchResults.searchStatus === 'failed') {
				searchView = this.notFound();
			}
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
			default:
				return null;
			}
		} else {
			return null;
		}
	}

	renderHeader() {
		let back = () => { this.props.history.go(-2); };
		if (this.props.history.length === 0) {
			back = () => { this.props.history.push('/'); };
		}

		return (
			<Header.SearchResult
				back={back}
				value={this.getKeyword() || ''}
			/>
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
		return this.props.isLoading ? this.loadingRender() : this.searchRender();
	}
}

const mapStateToProps = (state) => {
	return {
		shared: state.shared,
		searchResults: state.searchResults,
		isLoading: state.searchResults.isLoading,
		scroller: state.scroller
	};
};

const doAfterAnonymous = (props) => {
	console.log(props);
	const { shared, dispatch, cookies, location } = props;

	const parsedUrl = queryString.parse(location.search);
	const objParam = {
		q: parsedUrl.query !== undefined ? parsedUrl.query : '',
		brand_id: parsedUrl.brand_id !== undefined ? parseInt(parsedUrl.brand_id, 10) : '',
		store_id: parsedUrl.store_id !== undefined ? parseInt(parsedUrl.store_id, 10) : '',
		category_id: parsedUrl.category_id !== undefined ? parseInt(parsedUrl.category_id, 10) : '',
		page: parsedUrl.page !== undefined ? parseInt(parsedUrl.page, 10) : 1,
		per_page: parsedUrl.per_page !== undefined ? parseInt(parsedUrl.per_page, 10) : 10,
		fq: parsedUrl.fq !== undefined ? parsedUrl.fq : '',
		sort: parsedUrl.sort !== undefined ? parsedUrl.sort : 'energy DESC',
	};

	const searchService = _.chain(shared).get('serviceUrl.product').value() || false;
	dispatch(actions.initAction(cookies.get('user.token'), searchService, objParam));
};

export default withCookies(connect(mapStateToProps)(Shared(Scroller(SearchResults), doAfterAnonymous)));