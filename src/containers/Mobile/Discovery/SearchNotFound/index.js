import React, { PureComponent } from 'react';
import { withCookies } from 'react-cookie';
import { Header, Page, Navigation } from '@/components/mobile';
import styles from './search.scss';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class SearchNotFound extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		const inlineStyle = {
			textAlign: 'center',
			margin: '10px auto 10px auto'
		};

		return (
			<div style={this.props.style}>
				<Page>
					<div className={styles.container} >
						<div style={inlineStyle}>[image kantong kosong]</div>
						<div style={inlineStyle}>No result found</div>
						<div><button><Link to={{ pathname: '/search' }}>Cari kembali</Link></button></div>
						<div style={inlineStyle}>[Rich Relevant Recommendation section]</div>
						<div style={inlineStyle}>[Footer]</div>
					</div>
				</Page>
				<Link to={{ pathname: '/search' }}>
					<Header.SearchResult
						value={this.props.keyword}
					/>
				</Link>
				<Navigation active='Home' />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		keyword: state.search.keyword,
	};
};

export default withCookies(connect(mapStateToProps)(SearchNotFound));
