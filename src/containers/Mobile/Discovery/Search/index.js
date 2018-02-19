import React, { PureComponent } from 'react';
import { withCookies } from 'react-cookie';
import { Header, Page } from '@/components/mobile';
import styles from './search.scss';
import { connect } from 'react-redux';
import { actions as actionSearch } from '@/state/v4/Search';
import { Link } from 'react-router-dom';
import CONST from '@/constants';
import Shared from '@/containers/Mobile/Shared';
class Search extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			keyword: this.props.keyword,
			showHistory: true
		};
		this.searchListCookieName = CONST.COOKIE_USER_SEARCH_LIST;
		this.searchHashtagListCookieName = CONST.COOKIE_USER_SEARCH_HASHTAG_LIST;
		this.userToken = this.props.cookies.get(CONST.COOKIE_USER_TOKEN);
		this.SUGGEST_KEYWORD = CONST.SEARCH_SUGGEST_TYPE.suggestKeyword;
		this.SUGGEST_CATEGORY = CONST.SEARCH_SUGGEST_TYPE.suggestCategory;
		this.SUGGEST_HASTAG = CONST.SEARCH_SUGGEST_TYPE.suggestHashtag;
		this.SUGGEST_HISTORY = CONST.SEARCH_SUGGEST_TYPE.suggestHistory;
		this.searchKeywordUpdatedHandler = this.searchKeywordUpdatedHandler.bind(this);
		this.enterSearchHandler = this.enterSearchHandler.bind(this);
		this.listSugestionMaker = this.listSugestionMaker.bind(this);
		this.setCookieSearch = this.setCookieSearch.bind(this);
		this.urlBuilder = this.urlBuilder.bind(this);
		this.deleteAllCookieSearchByType = this.deleteAllCookieSearchByType.bind(this);
	}

	setCookieSearch(sText, sValue, sType) {
		const usedCookie = (sText.charAt(0) === '#') ? this.searchHashtagListCookieName : this.searchListCookieName;
		let cookies = this.props.cookies.get(usedCookie);
		cookies = (!cookies || cookies === []) ? [] : cookies;
		const newSearch = { text: sText, value: sValue, type: sType };
		cookies.unshift(newSearch);
		this.props.cookies.set(usedCookie, cookies.filter((val, key) => (key <= 9)));
	}

	deleteAllCookieSearchByType(type) {
		this.props.cookies.set(type, '[]');
		this.forceUpdate();
	}

	urlBuilder(type, text, value) {
		let pathProd = null;
		const eText = encodeURIComponent(text);
		const eVal = encodeURIComponent(value);
		switch (type) {
		case this.SUGGEST_KEYWORD || this.SUGGEST_HASTAG:
			pathProd = `/products?category_id=&query=${eVal.toLowerCase()}`;
			break;
		case this.SUGGEST_HASTAG:
			pathProd = `/products?category_id=&query=${eVal.toLowerCase()}`;
			break;
		case this.SUGGEST_CATEGORY:
			pathProd = `/products?category_id=${value}&query=${eText.toLowerCase()}`;
			break;
		default:
			pathProd = `/products?category_id=&query=${eVal}`;
		}
		return pathProd;
	}

	enterSearchHandler(event) {
		if (event.key === 'Enter') {
			this.setCookieSearch(event.target.value, event.target.value);
			const pathProd = `/products?category_id=&query=${encodeURIComponent(event.target.value)}`;
			this.props.history.push(pathProd);
		}
	}

	searchKeywordUpdatedHandler(event) {
		const newWord = event.target.value || null;
		const { dispatch } = this.props;
		dispatch(actionSearch.updatedKeywordHandler(newWord, this.userToken));
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
				const pathProd = (type === this.SUGGEST_HISTORY) ? this.urlBuilder(list.type, list.text, list.value)
					: this.urlBuilder(type, list.text, list.value);
				const cookieType = (type === this.SUGGEST_HISTORY) ? list.type : type;
				return (
					<li key={Math.random()} >
						<Link to={pathProd} onClick={() => this.setCookieSearch(list.text, list.value, cookieType)}>
							{list.text}
						</Link>
					</li>);
			})}
		</div>);
	};

	render() {
		let sectionSearchHistory = null;
		let listSearchHistory = null;
		const cookieSearch = this.props.cookies.get(this.searchListCookieName);
		if (cookieSearch && cookieSearch.length > 0) {
			listSearchHistory = this.listSugestionMaker(cookieSearch, this.SUGGEST_HISTORY);

			sectionSearchHistory = (
				<section className={styles.section}>
					<div className={styles.heading}>
						<span>Pencarian Terakhir</span>
						<span
							className={styles.delete}
							onClick={() => this.deleteAllCookieSearchByType(this.searchListCookieName)}
							role='button'
							tabIndex='0'
						>
							HAPUS SEMUA
						</span>
					</div>
					<ul className={styles.list}>
						{listSearchHistory}
					</ul>
				</section>
			);
		}

		let sectionHashtagHistory = null;
		let listHashtagHistory = null;
		const cookieHashtag = this.props.cookies.get(this.searchHashtagListCookieName);
		if (cookieHashtag && cookieHashtag.length > 0) {
			listHashtagHistory = this.listSugestionMaker(cookieHashtag, this.SUGGEST_HISTORY);
			sectionHashtagHistory = (
				<section className={styles.section}>
					<div className={styles.heading}>
						<span>#hashtags Terakhir</span>
						<span
							className={styles.delete}
							onClick={() => this.deleteAllCookieSearchByType(this.searchHashtagListCookieName)}
							role='button'
							tabIndex='0'
						>
							HAPUS SEMUA
						</span>
					</div>
					<ul className={styles.list}>
						{listHashtagHistory}
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

		const showSuggestion = (this.props.relatedHastag || this.props.relatedKeyword || this.props.relatedCategory);

		let mainList = null;
		if (showSuggestion) {
			mainList = (<div>{sectionRelatedCategory}{sectionRelatedKeyword}{sectionRelatedHastag}</div>
			);
		} else {
			mainList = (<div>
				{ sectionSearchHistory }
				{ sectionHashtagHistory }
			</div>);
		}

		const displayLoading = (<div style={{ textAlign: 'center', padding: '5px 0px' }} > hhmmmm..... </div>);

		return (
			<div style={this.props.style}>
				<Page>
					<div className={styles.container} >
						{this.props.isLoading ? displayLoading : mainList}
					</div>
				</Page>
				<Header.Search
					updatedKeywordHandler={this.searchKeywordUpdatedHandler}
					onKeyPressHandler={this.enterSearchHandler}
					value={this.state.keyword || ''}
					back={this.props.history.goBack}
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
		isLoading: state.search.loading
	};
};

export default withCookies(connect(mapStateToProps)(Shared(Search)));
