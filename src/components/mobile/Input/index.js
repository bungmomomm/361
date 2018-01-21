import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './input.scss';


class Input extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			isFocused: false
		};
	}

	handleChange(event) {
		this.props.onChange(event.target.value, event);
	}

	renderLabel() {
		const { id, label } = this.props;
		if (!label) {
			return null;
		}

		return (
			<label
				className={styles.label}
				htmlFor={id}
			>
				{label}
			</label>
		);
	}

	renderHint() {
		const { hint } = this.props;

		if (!hint) {
			return null;
		}

		return <p className={styles.hint}>{hint}</p>;
	}

	render() {
		const {
			type,
			status,
			size,
			value,
			inputClassName,
			iconLeft,
			iconRight,
			...props,
		} = this.props;
		
		const className = classNames(
			styles.container,
			status ? styles[status] : null,
			value ? styles.filled : null,
			styles[size],
			this.props.className
		);

		const CreateinputClassName = classNames(styles.input, inputClassName);

		const TagName = type === 'textarea' ? 'textarea' : 'input';

		const renderIconLeft = () => {
			if (!iconLeft) {
				return null;
			}
			return <div className={styles.iconLeft}>{iconLeft}</div>;
		};

		const renderIconRight = () => {
			if (!iconRight) {
				return null;
			}
			return <div className={styles.iconRight}>{iconRight}</div>;
		};


		return (
			<div className={className}>
				{this.renderLabel()}
				<div className={styles.wrapper}>
					{renderIconLeft()}
					{renderIconRight()}
					<TagName
						{...props}
						className={CreateinputClassName}
						ref={this.setInput}
					/>
				</div>
				{this.renderHint()}
			</div>
		);
	}
}

Input.defaultProps = {
	type: 'text',
	status: 'normal',
	size: 'normal'
};


export default Input;
