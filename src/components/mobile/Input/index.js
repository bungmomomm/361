import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './input.scss';


class Input extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			isFocused: false,
			showLabel: false,
		};
	}

	handleChange(event) {
		this.props.onChange(event.target.value, event);
	}

	showLabel() {
		this.setState({ showLabel: true });
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

	render() {
		const {
			as,
			status,
			size,
			value,
			inputClassName,
			color,
			flat,
			iconLeft,
			hint,
			error,
			iconRight,
			partitioned,
			...props,
		} = this.props;

		const className = classNames(
			styles.container,
			status ? styles[status] : null,
			value ? styles.filled : null,
			flat ? styles.flat : null,
			error ? styles.error : null,
			partitioned ? styles.partitioned : null,
			styles[size],
			this.state.showLabel ? styles.showLabel : null,
			styles[color],
			this.props.className
		);

		const CreateinputClassName = classNames(styles.input, inputClassName);

		const TagName = as === 'textarea' ? 'textarea' : 'input';

		const renderHint = () => {
			if (!hint) {
				return null;
			}

			return <p className={styles.hint}>{hint}</p>;
		};

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

		const valueData = () => {
			if (value) {
				return { value };
			}
			return { value: '' };
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
						{...valueData()}
						onClick={() => this.showLabel()}
					/>
				</div>
				{renderHint()}
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
