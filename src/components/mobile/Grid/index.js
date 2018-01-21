import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './grid.scss';


class Grid extends PureComponent {
	render() {
		const { children, split, className, ...props } = this.props;

		const createClassName = classNames(
			styles.container,
			className,
			styles[`split--${split}`],
		);

		return (
			<div className={createClassName} {...props}>
				{children}
			</div>
		);
	}
}

export default Grid;
