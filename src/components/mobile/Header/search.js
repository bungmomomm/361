import React, { Component } from 'react';
import Input from '../Input';
import styles from './header.scss';
import Svg from '../Svg';
import Suggestion from './Search/suggestion';


class Search extends Component {
	
	
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			showSuggestion: false
		};
		this.showSuggestion = this.showSuggestion.bind(this);
		this.hideSuggestion = this.hideSuggestion.bind(this);
	}
	
	showSuggestion() {
		this.setState(() => {
			return {
				showSuggestion: true
			};
		});
	}
	
	hideSuggestion() {
		this.setState(() => {
			return {
				showSuggestion: false
			};
		});
	}
	
	render() {
		
		const { showSuggestion } = this.state;
		
		return (
			<div className={styles.center}>
				<Input
					onFocus={this.showSuggestion}
					onBlur={this.hideSuggestion}
					placeholder=''
					value=''
				/>
				<div className={styles.dummyplaceholder}>
					<span className='padding--small-h'>Cari produk</span>
					<span><Svg src='ico_search_361_small.svg' /></span>
				</div>
				<Suggestion show={showSuggestion} />
			</div>
		
		);
	}
	
}

export default Search;
