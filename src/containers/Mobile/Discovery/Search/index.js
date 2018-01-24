import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Header, Page } from '@/components/mobile';
import styles from './search.scss';
import { connect } from 'react-redux';
import { actions } from '@/state/v4/Search';
import { Link } from 'react-router-dom';

class Search extends Component {
	static listSugestionMaker(lists) {
		return (<div>
			{lists.map(list => {
				const pathProd = `/products?category_id=&query=${list.value}`;
				return (<li key={Math.random()}><Link to={{ pathname: pathProd }}> {list.text} </Link></li>);
			})}
		</div>);
	};

	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			keyword: this.props.keyword, // this state for manipulating stateless search box input
			showHistory: true
		};
		this.userToken = this.props.cookies.get('user.token');
		this.searchKeywordUpdatedHandler = this.searchKeywordUpdatedHandler.bind(this);
		this.enterSearchHandler = this.enterSearchHandler.bind(this);
		this.searchListCookieName = 'user.search.list';
	}

	enterSearchHandler(event) {
		if (event.key === 'Enter') {
			let cookies = this.props.cookies.get(this.searchListCookieName);
			cookies = (!cookies || cookies === []) ? [] : cookies;
			const newSearch = { text: event.target.value, value: event.target.value };
			cookies.unshift(newSearch);
			this.props.cookies.set(this.searchListCookieName, cookies.filter((val, key) => (key <= 9)));
			const pathProd = `/products?category_id=&query=${event.target.value}`;
			top.location.href = pathProd;
		}
	}

	searchKeywordUpdatedHandler(event) {
		const newWord = event.target.value;
		if (newWord && newWord.length >= 3) {
			this.props.updatedKeyword(newWord, this.userToken);
			this.setState({
				...this.state,
				keyword: newWord,
				showHistory: false
			});
		} else {
			this.props.updatedKeyword('');
			this.setState({
				...this.state,
				keyword: '',
				showHistory: true
			});
		}
	}

	render() {
		let sectionSearchHistory = null;
		let listSearchHistory = null;
		const cookies = this.props.cookies.get(this.searchListCookieName);
		if (cookies && cookies.length > 0) {
			listSearchHistory = this.constructor.listSugestionMaker(cookies);
			sectionSearchHistory = (
				<section className={styles.section}>
					<div className={styles.heading}>Seach History</div>
					<ul className={styles.list}>
						{listSearchHistory}
					</ul>
				</section>
			);
		}

		let sectionRelatedCategory = null;
		let listRelatedCategory = null;
		if (this.props.relatedKeyword) {
			listRelatedCategory = this.constructor.listSugestionMaker(this.props.relatedKeyword);
			sectionRelatedCategory = (
				<section className={styles.section}>
					<div className={styles.heading}>Related Categories</div>
					<ul className={styles.list}>
						{listRelatedCategory}
					</ul>
				</section>
			);
		}

		let sectionRelatedKeyword = null;
		let listRelatedKeyword = null;
		if (this.props.relatedKeyword) {
			listRelatedKeyword = this.constructor.listSugestionMaker(this.props.relatedKeyword);
			sectionRelatedKeyword = (
				<section className={styles.section}>
					<div className={styles.heading}>Related Keywords</div>
					<ul className={styles.list}>
						{listRelatedKeyword}
					</ul>
				</section>
			);
		}

		let sectionRelatedHastag = null;
		let listRelatedHastag = null;
		if (this.props.relatedHastag) {
			listRelatedHastag = this.constructor.listSugestionMaker(this.props.relatedHastag);
			sectionRelatedHastag = (
				<section className={styles.section}>
					<div className={styles.heading}>Related Hastag</div>
					<ul className={styles.list}>
						{listRelatedHastag}
					</ul>
				</section>
			);
		}

		let mainList = null;
		if (this.state.showHistory && cookies && cookies.length > 0) {
			mainList = (<div>{ sectionSearchHistory }</div>);
		} else {
			mainList = (
				<div>
					{sectionRelatedCategory}
					{sectionRelatedKeyword}
					{sectionRelatedHastag}
				</div>
			);
		}

		return (
			<div style={this.props.style}>
				<Page>
					<div className={styles.container} >
						{mainList}
					</div>
				</Page>
				<Header.Search
					updatedKeywordHandler={this.searchKeywordUpdatedHandler}
					onKeyPressHandler={this.enterSearchHandler}
					dataProps={{ value: this.state.keyword }}
					value={this.state.keyword}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		keyword: state.search.keyword,
		relatedCategory: state.search.related_category,
		relatedKeyword: state.search.related_keyword,
		relatedHastag: state.search.related_hashtag,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updatedKeyword: (keyword, token) => dispatch(actions.updatedKeywordHandler(keyword, token)),
	};
};

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Search));
