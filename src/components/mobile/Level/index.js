import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './level.scss';

import Item from './Item';
import Left from './Left';
import Right from './Right';

class Level extends PureComponent {
	render() {
		const { children, className, ...props } = this.props;

		const createClassName = classNames(
			styles.container,
			className
		);

		return (
			<div className={createClassName} {...props}>
				{children}
			</div>
		);
	}
}

Level.Item = Item;
Level.Left = Left;
Level.Right = Right;

export default Level;
