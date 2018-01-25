import React, { PureComponent } from 'react';
import { withCookies } from 'react-cookie';
import { Header, Page, Navigation } from '@/components/mobile';
import styles from './search.scss';
import { connect } from 'react-redux';

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
						<div style={inlineStyle}>
							Maaf, halaman yang kamu tuju tidak ditemukan
						</div>
						<div style={inlineStyle}>
							Periksa kembali link yang kamu tuju.
						</div>
						<div style={inlineStyle}>[Rich Relevant Recommendation section]</div>
						<div style={inlineStyle}>[Footer]</div>
					</div>
				</Page>
				<Header.SearchResult
					value={this.props.keyword}
					back={this.props.history.goBack}
				/>
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
