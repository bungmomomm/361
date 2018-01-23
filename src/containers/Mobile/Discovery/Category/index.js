import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import {
	Header,
	Tabs,
	Page,
	Image,
	Navigation
} from '@/components/mobile';
import * as C from '@/constants';
import styles from './category.scss';

class Category extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			current: 'wanita',
			notification: {
				show: true
			}
		};
	}

	render() {
		return (
			<div style={this.props.style}>
				<Page>
					<Tabs
						current={this.state.current}
						variants={C.MAIN_NAV_CATEGORIES}
					/>
					<div className={styles.list}>
						<Image local src='temp/category-1.jpg' />
						<div className={styles.label}>New in</div>
					</div>
					<div className={styles.list}>
						<Image local src='temp/category-1.jpg' />
						<div className={styles.label}>New in</div>
					</div>
					<div className={styles.list}>
						<Image local src='temp/category-1.jpg' />
						<div className={styles.label}>New in</div>
					</div>
					<div className={styles.list}>
						<Image local src='temp/category-1.jpg' />
						<div className={styles.label}>New in</div>
					</div>
					<div className={styles.list}>
						<Image local src='temp/category-1.jpg' />
						<div className={styles.label}>New in</div>
					</div>
					<div className={styles.list}>
						<Image local src='temp/category-1.jpg' />
						<div className={styles.label}>New in</div>
					</div>
					<div className={styles.list}>
						<Image local src='temp/category-1.jpg' />
						<div className={styles.label}>New in</div>
					</div>
					<div className={styles.list}>
						<Image local src='temp/category-1.jpg' />
						<div className={styles.label}>New in</div>
					</div>
				</Page>
				<Header />
				<Navigation active='Categories' />
			</div>
		);
	}
}

Category.defaultProps = {
	Home: 'hallo',
	Data: 'akjsdaskdjasldjsaldjalskdj'

};


export default withCookies(Category);
