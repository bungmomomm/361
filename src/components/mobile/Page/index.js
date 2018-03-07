import React, { Component } from 'react';
import styles from './page.scss';

class Page extends Component {
	render() {
		return (
			<div className={styles.container}>
				<div className={styles.page} ref={(n) => { this.node = n; }}>
					{this.props.children}
				</div>
			</div>
		);
	}
};

export default Page;
