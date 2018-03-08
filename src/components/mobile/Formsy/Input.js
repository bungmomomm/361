import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './input.scss';
import { withFormsy } from 'formsy-react';


class Input extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isFocused: false,
			showLabel: false,
		};

		this.onChange = this.onChange.bind(this);
	}

	onChange(event) {
		if (typeof this.props.setValue === 'function') {
			this.props.setValue(event.currentTarget.value);
		}
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
		const exc = [
			'getErrorMessage', 'getErrorMessages', 'getValue', 'hasValue',
			'isFormDisabled', 'isValid', 'isPristine', 'isFormSubmitted',
			'isRequired', 'isValidValue', 'resetValue', 'setValidations',
			'setValue', 'showRequired', 'showError', 'validations',
			'validationError', 'innerRef', 'validationErrors', 'as',
			'status', 'status', 'size', 'value', 'inputClassName',
			'color', 'flat', 'iconLeft', 'hint', 'error', 'iconRight',
			'partitioned'
		];

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
			getErrorMessage
		} = this.props;

		const rest = Object.keys(this.props)
			.filter(k => !exc.includes(k))
			.reduce((obj, key) => {
				obj[key] = this.props[key];
				return obj;
			}, {});

		const className = classNames(
			styles.container,
			status ? styles[status] : null,
			value ? styles.filled : null,
			flat ? styles.flat : null,
			error || (this.props.showError && this.props.showError()) ? styles.error : null,
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
			if (value || value === '') {
				return { value };
			}
			return null;
		};

		const errorMessage = typeof getErrorMessage === 'function' ? getErrorMessage() : '';

		return (
			<div className={className}>
				{this.renderLabel()}
				<div className={styles.wrapper}>
					{renderIconLeft()}
					{renderIconRight()}
					<TagName
						{...rest}
						className={CreateinputClassName}
						onChange={this.onChange}
						{...valueData()}
						onClick={() => this.showLabel()}
					/>
				</div>
				{errorMessage ? <p className={styles.hint}>{errorMessage}</p> : renderHint()}
			</div>
		);
	}
}

Input.defaultProps = {
	type: 'text',
	status: 'normal',
	size: 'normal'
};

export default withFormsy(Input);
