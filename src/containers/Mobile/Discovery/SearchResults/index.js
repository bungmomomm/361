import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Header, Page, Navigation } from '@/components/mobile';
import styles from './search.scss';
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
	}

	componentDidMount() {
		this.props.dispatch(actions.initAction(this.userCookies, this.objParam));
	}

	render() {
		const inlineStyle = {
			textAlign: 'center',
			margin: '10px auto 10px auto'
		};

		let searchRender = null;
		if (this.props.searchResults.searchData !== '') {
			searchRender = (
				<div>
					{
						this.props.searchResults.searchData.products.map((product, index) => {
							return (
								<ul key={index}>
									<li>{index + 1}</li>
									<li>
										<img src={product.images.mobile} alt={product.product_title} />
									</li>
									<li>{product.product_title}</li>
									<li>{product.pricing.formatted.effective_price}</li>
									<hr />
								</ul>
							);
						})
					}
				</div>
			);
		} else {
			searchRender = (
				<div className={styles.container} >
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

		let back = () => { this.props.history.go(-2); };
		if (this.props.history.length === 0) {
			back = () => { this.props.history.push('/'); };
		}

		return (
			<div style={this.props.style}>
				<Page>
					{searchRender}
				</Page>
				<Header.SearchResult
					back={back}
					value={this.objParam.query || ''}
				/>
				<Navigation />
			</div>);
	}
}

const mapStateToProps = (state) => {
	// console.log(state);
	return {
		...state
	};
};

export default withCookies(connect(mapStateToProps)(SearchResults));