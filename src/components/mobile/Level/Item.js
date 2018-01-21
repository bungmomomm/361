import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './level.scss';

class Item extends PureComponent {
	render() {
		const { children, className, ...props } = this.props;

		const createClassName = classNames(
			styles.item,
			className
		);

		return (
			<div className={createClassName} {...props}>
				{children}
			</div>
		);
	}
}

export default Item;
