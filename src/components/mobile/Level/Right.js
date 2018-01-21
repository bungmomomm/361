import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './level.scss';

class Right extends PureComponent {
	render() {
		const { children, className, ...props } = this.props;

		const createClassName = classNames(
			styles.right,
			className
		);

		return (
			<div className={createClassName} {...props}>
				{children}
			</div>
		);
	}
}

export default Right;
