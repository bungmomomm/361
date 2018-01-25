import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Header, Page, Navigation } from '@/components/mobile';
// import styles from './search.scss';
import { actions } from '@/state/v4/SearchResults';
import queryString from 'query-string';

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
		let back = () => { this.props.history.go(-2); };
		if (this.props.history.length === 0) {
			back = () => { this.props.history.push('/'); };
		}

		return (
			<div style={this.props.style}>
				<Page>
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
				</Page>
				<Header.SearchResult
					value={this.objParam.query || ''}
					back={back}
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