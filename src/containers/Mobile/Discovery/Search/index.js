import React, { PureComponent } from 'react';
import { withCookies } from 'react-cookie';
import { Header, Page } from '@/components/mobile';
import styles from './search.scss';
import { connect } from 'react-redux';
import { actions } from '@/state/v4/Search';
import { Link } from 'react-router-dom';

class Search extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			keyword: this.props.keyword, // this state for manipulating stateless search box input
			showHistory: true
		};
		this.searchListCookieName = 'user.search.list';
		this.userToken = this.props.cookies.get('user.token');
		this.SUGGEST_KEYWORD = 'SUGGEST_KEYWORD';
		this.SUGGEST_CATEGORY = 'SUGGEST_CATEGORY';
		this.SUGGEST_HASTAG = 'SUGGEST_HASTAG';
		this.SUGGEST_HISTORY = 'SUGGEST_HISTORY';
		this.searchKeywordUpdatedHandler = this.searchKeywordUpdatedHandler.bind(this);
		this.enterSearchHandler = this.enterSearchHandler.bind(this);
		this.listSugestionMaker = this.listSugestionMaker.bind(this);
		this.urlBuilder = this.urlBuilder.bind(this);
	}

	setCookieSearch(sText, sValue, sType) {
		let cookies = this.props.cookies.get(this.searchListCookieName);
		cookies = (!cookies || cookies === []) ? [] : cookies;
		const newSearch = { text: sText, value: sValue, type: sType };
		cookies.unshift(newSearch);
		this.props.cookies.set(this.searchListCookieName, cookies.filter((val, key) => (key <= 9)));
	}

	urlBuilder(type, text, value) {
		let pathProd = null;
		switch (type) {
		case this.SUGGEST_KEYWORD || this.SUGGEST_HASTAG:
			pathProd = `/products?category_id=&query=${value}`;
			break;
		case this.SUGGEST_HASTAG:
			pathProd = `/products?category_id=&query=${value}`;
			break;
		case this.SUGGEST_CATEGORY:
			pathProd = `/products?category_id=${value}&query=${text}`;
			break;
		default:
			pathProd = '/';
		}
		return pathProd;
	}

	enterSearchHandler(event) {
		if (event.key === 'Enter') {
			this.setCookieSearch(event.target.value, event.target.value);
			const pathProd = `/products?category_id=&query=${event.target.value}`;
			this.props.history.push(pathProd);
		}
	}

	searchKeywordUpdatedHandler(event) {
		const newWord = (event.target.value) ? event.target.value : '';
		this.props.updatedKeyword(newWord, this.userToken);
		if (newWord && newWord.length >= 3) {
			this.setState({
				...this.state,
				keyword: newWord,
				showHistory: false
			});
		} else {
			this.setState({
				...this.state,
				keyword: newWord,
				showHistory: true
			});
		}
	}

	listSugestionMaker(lists, type) {
		return (<div>
			{lists.map(list => {
				const pathProd = (type === this.SUGGEST_HISTORY) ? this.urlBuilder(list.type, list.text, list.value) : this.urlBuilder(type, list.text, list.value);
				const cookieType = (type === this.SUGGEST_HISTORY) ? list.type : type;
				return (
					<li key={Math.random()} >
						<Link to={{ pathname: pathProd }} onClick={() => this.setCookieSearch(list.text, list.value, cookieType)}> {list.text} </Link>
					</li>);
			})}
		</div>);
	};

	render() {
		let sectionSearchHistory = null;
		let listSearchHistory = null;
		const cookies = this.props.cookies.get(this.searchListCookieName);
		if (cookies && cookies.length > 0) {
			listSearchHistory = this.listSugestionMaker(cookies, this.SUGGEST_HISTORY);
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
		if (this.props.relatedCategory) {
			listRelatedCategory = this.listSugestionMaker(this.props.relatedCategory, this.SUGGEST_CATEGORY);
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
			listRelatedKeyword = this.listSugestionMaker(this.props.relatedKeyword, this.SUGGEST_KEYWORD);
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
			listRelatedHastag = this.listSugestionMaker(this.props.relatedHastag, this.SUGGEST_HASTAG);
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
					value={this.state.keyword || ''}
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
