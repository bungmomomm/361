import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Header, Page } from '@/components/mobile';
import styles from './search.scss';

class Search extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		return (
			<div>
				<Page>
					<div className={styles.container}>
						<section className={styles.section}>
							<div className={styles.heading}>Related Search Categories</div>
							<ul className={styles.list}>
								<li><a href='/'>Esse dolore deserunt sint est</a> </li>
								<li><a href='/'>Esse dolore deserunt sint est</a> </li>
								<li><a href='/'>Esse dolore deserunt sint est</a> </li>
								<li><a href='/'>Esse dolore deserunt sint est</a> </li>
								<li><a href='/'>Esse dolore deserunt sint est</a> </li>
							</ul>
						</section>
						<section className={styles.section}>
							<div className={styles.heading}>#hashtags Terakhir</div>
							<ul className={styles.list}>
								<li><a href='/'>Esse dolore deserunt sint est</a> </li>
								<li><a href='/'>Esse dolore deserunt sint est</a> </li>
								<li><a href='/'>Esse dolore deserunt sint est</a> </li>
								<li><a href='/'>Esse dolore deserunt sint est</a> </li>
								<li><a href='/'>Esse dolore deserunt sint est</a> </li>
							</ul>
						</section>
						<section className={styles.section}>
							<div className={styles.heading}>Related Search Categories</div>
							<ul className={styles.list}>
								<li><a href='/'>Esse dolore deserunt sint est</a> </li>
								<li><a href='/'>Esse dolore deserunt sint est</a> </li>
								<li><a href='/'>Esse dolore deserunt sint est</a> </li>
								<li><a href='/'>Esse dolore deserunt sint est</a> </li>
								<li><a href='/'>Esse dolore deserunt sint est</a> </li>
							</ul>
						</section>
					</div>
				</Page>
				<Header.Search />
			</div>
		);
	}
}

Search.defaultProps = {
	Home: 'hallo',
	Data: 'akjsdaskdjasldjsaldjalskdj'

};


export default withCookies(Search);
