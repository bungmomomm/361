import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Spinner from '../Spinner';
import styles from './button.scss';

class Button extends PureComponent {
	renderLoading() {
		const { loading, size } = this.props;

		if (!loading) {
			return null;
		}

		return <Spinner type='round' className={styles.spinner} size={size} />;
	}

	render() {
		const {
			id,
			type,
			disabled,
			transparent,
			color,
			wide,
			inline,
			rounded,
			children,
			loading,
			outline,
			size,
			className,
			...props,
		} = this.props;


		const createClassName = classNames(
			styles.container,
			styles[size],
			styles[color],
			{
				[styles.styled]: color || size,
				[styles.wide]: wide,
				[styles.inline]: inline,
				[styles.outline]: outline,
				[styles.transparent]: transparent,
				[styles.rounded]: rounded,
				[styles.loading]: loading
			},
			className
		);

		return (
			<button
				id={id}
				className={createClassName}
				type={type}
				disabled={disabled || loading}
				onClick={this.props.onClick}
				{...props}
			>
				{loading ? this.renderLoading() : children}
			</button>
		);
	}
}

Button.defaultProps = {
	type: 'button',
	size: '',
	color: '',
	wide: false,
	inline: false,
	rounded: true,
	loading: false,
	disabled: false
};


export default Button;
