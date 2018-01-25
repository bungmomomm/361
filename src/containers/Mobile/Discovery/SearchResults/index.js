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
	}

	componentDidMount() {
		const parsedUrl = queryString.parse(this.props.location.search);
		// console.log(parsedUrl);

		const objParam = {
			query: parsedUrl.query !== undefined ? parsedUrl.query : '',
			brand_id: parsedUrl.brand_id !== undefined ? parsedUrl.brand_id : '',
			store_id: parsedUrl.store_id !== undefined ? parsedUrl.store_id : '',
			category_id: parsedUrl.category_id !== undefined ? parsedUrl.category_id : '',
			page: parsedUrl.page !== undefined ? parsedUrl.page : 1,
			per_page: parsedUrl.per_page !== undefined ? parsedUrl.per_page : 10,
			sort: parsedUrl.sort !== undefined ? parsedUrl.sort : 'energy DESC',
		};

		this.props.dispatch(actions.initAction(this.userCookies, objParam));
	}

	render() {
		console.log('state', this.props.searchResults.searchParam.query);
		return (
			<div style={this.props.style}>
				<Page>
					<div>
						we
					</div>
				</Page>
				<Header.Search />
				<Navigation />
			</div>);
	}
}

const mapStateToProps = (state) => {
	console.log(state);
	return {
		...state
	};
};

export default withCookies(connect(mapStateToProps)(SearchResults));