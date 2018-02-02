import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './grid.scss';


class Grid extends PureComponent {
	render() {
		const { children, split, bordered, className, ...props } = this.props;

		const createClassName = classNames(
			styles.container,
			className,
			styles[`split--${split}`],
			bordered ? styles.bordered : '',
		);

		return (
			<div className={createClassName} {...props}>
				{children}
			</div>
		);
	}
}

export default Grid;
