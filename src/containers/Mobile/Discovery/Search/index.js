import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Header, Page } from '@/components/mobile';
import styles from './search.scss';
import { connect } from 'react-redux';
import { actions } from '@/state/v4/Search';
import { Link } from 'react-router-dom';
class Search extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			keyword: this.props.keyword
		};
		this.userToken = this.props.cookies.get('user.token');
		this.searchKeywordUpdatedHandler = this.searchKeywordUpdatedHandler.bind(this);
	}

	searchKeywordUpdatedHandler(newWord) {
		if (newWord.length >= 3) {
			this.props.updatedKeyword(newWord, this.userToken);
			this.setState({
				...this.state,
				keyword: newWord
			});
		} else {
			this.props.updatedKeyword('');
			this.setState({
				...this.state,
				keyword: ''
			});
		}
	}

	render() {
		const listSugestionMaker = (lists) => {
			return (<div>
				{lists.map(list => {
					const pathProd = `/products?category_id=&query=${list.value}`;
					return (<li key={Math.random()}><Link to={{ pathname: pathProd }}> {list.text} </Link></li>);
				})}
			</div>);
		};

		let sectionRelatedCategory = null;
		let listRelatedCategory = null;
		if (this.props.relatedKeyword) {
			listRelatedCategory = listSugestionMaker(this.props.relatedKeyword);
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
			listRelatedKeyword = listSugestionMaker(this.props.relatedKeyword);
			sectionRelatedKeyword = (
				<section className={styles.section}>
					<div className={styles.heading}>Related Categories</div>
					<ul className={styles.list}>
						{listRelatedKeyword}
					</ul>
				</section>
			);
		}

		let sectionRelatedHastag = null;
		let listRelatedHastag = null;
		if (this.props.relatedHastag) {
			listRelatedHastag = listSugestionMaker(this.props.relatedHastag);
			sectionRelatedHastag = (
				<section className={styles.section}>
					<div className={styles.heading}>Related Hastag</div>
					<ul className={styles.list}>
						{listRelatedHastag}
					</ul>
				</section>
			);
		}

		return (
			<div style={this.props.style}>
				<Page>
					<div className={styles.container}>
						{sectionRelatedCategory}
						{ this.props.relatedKeyword ? sectionRelatedKeyword : null }
						{sectionRelatedHastag}
					</div>
				</Page>
				<Header.Search
					updatedKeyword={this.searchKeywordUpdatedHandler}
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
