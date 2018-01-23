import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
// import {
// 	Header,
// 	Tabs,
// 	Page,
// 	Image,
// 	Navigation
// } from '@/components/mobile';
// import * as C from '@/constants';
// import styles from './childCategory.scss';
// import reduxDevtoolsExtension from 'redux-devtools-extension';

class ChildCategory extends Component {
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
			<div>asdasd</div>
		);
	}
}

ChildCategory.defaultProps = {
	Home: 'hallo',
	Data: 'akjsdaskdjasldjsaldjalskdj'

};


export default withCookies(ChildCategory);
