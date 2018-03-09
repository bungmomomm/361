import React, { Component } from 'react';
import styles from './page.scss';
import className from 'classnames';

class Page extends Component {
	render() {
		const pageClass = className(
			styles.container,
			this.props.hasTab ? styles.hasTab : null,
			this.props.color ? styles[this.props.color] : styles.grey
		);
		return (
			<div className={pageClass}>
				<div className={styles.page} ref={(n) => { this.node = n; }}>
					{this.props.children}
				</div>
			</div>
		);
	}
};

export default Page;
