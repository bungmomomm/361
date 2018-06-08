import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Spinner from '../Spinner';
import Love from './Love';
import styles from './button.scss';

class Button extends PureComponent {
	renderLoading() {
		const { loading } = this.props;

		if (!loading) {
			return null;
		}

		return <Spinner type='round' className={styles.spinner} size='large' />;
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
			circle,
			children,
			loading,
			outline,
			align,
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
				[styles.circle]: circle,
				[styles.left]: align === 'left',
				[styles.center]: align === 'center',
				[styles.right]: align === 'right'
			},
			className
		);

		const renderButton = () => (
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

		if (this.props.to) {
			return (
				<Link to={this.props.to}>
					{renderButton()}
				</Link>
			);
		}

		return renderButton();
	}
}

Button.defaultProps = {
	type: 'button',
	size: '',
	color: '',
	wide: false,
	inline: false,
	rounded: false,
	circle: false,
	loading: false,
	disabled: false
};

Button.Love = Love;

export default Button;
