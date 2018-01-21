import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './badge.scss';

class Badge extends PureComponent {
	render() {
		const {
			children,
			color,
			size,
			className,
			...props
		} = this.props;

		const createClassName = classNames(
			styles.container,
			styles[size],
			styles[color],
			className
		);

		return (
			<span
				className={createClassName}
				{...props}
			>
				{children}
			</span>
		);
	}
}

export default Badge;
