import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './level.scss';

import Item from './Item';
import Left from './Left';
import Right from './Right';

class Level extends PureComponent {
	render() {
		const { children, className, divider, innerRef, ...props } = this.props;

		const createClassName = classNames(
			styles.container,
			divider ? styles.divider : '',
			className
		);

		return (
			<div className={createClassName} ref={innerRef} {...props}>
				{children}
			</div>
		);
	}
}

Level.Item = Item;
Level.Left = Left;
Level.Right = Right;

export default Level;
