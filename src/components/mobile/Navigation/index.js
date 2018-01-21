import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Item from './item';
import styles from './navigation.scss';

class Navigation extends PureComponent {
	render() {
		const { children, className, ...props } = this.props;

		const createClassName = classNames(
			styles.container,
			className
		);

		return (
			<nav className={createClassName} {...props}>
				<div className={styles.wrapper}>
					<div className={styles.navigation}>
						{children}
					</div>
				</div>
			</nav>
		);
	}
}

Navigation.Item = Item;

export default Navigation;
