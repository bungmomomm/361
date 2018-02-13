import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './badge.scss';

class Badge extends PureComponent {
	render() {
		const {
			children,
			color,
			size,
			circle,
			rounded,
			className,
			attached,
			colorCode,
			...props
		} = this.props;

		const createClassName = classNames(
			styles.container,
			styles[size],
			styles[color],
			className, 
			{
				[styles.rounded]: rounded,
				[styles.circle]: circle,
				[styles.attached]: attached
			}
		);

		const badgeStyle = {
			backgroundColor: colorCode
		};

		return (
			<span
				className={createClassName}
				style={badgeStyle}
				{...props}
			>
				{children}
			</span>
		);
	}
}

export default Badge;
