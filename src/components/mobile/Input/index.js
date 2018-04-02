import React, { PureComponent } from 'react';
import Textarea from 'react-textarea-autosize';
import classNames from 'classnames';
import styles from './input.scss';


class Input extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			isFocused: false,
			showLabel: false,
		};
		this.textInput = null;
		this.onChangeHandler = this.onChangeHandler.bind(this);
	}

	onChangeHandler(event) {
		this.props.onChange(event);
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
			onClickInputAction,
			textCounter,
			inputRef,
			maxLength,
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

		const renderTextCounter = () => {
			if (!textCounter) {
				return null;
			}
			return <div className={styles.textCounter}>{textCounter}</div>;
		};

		const valueData = () => {
			if (value || value === '') {
				return { value };
			}
			return null;
		};

		const setMaxLength = () => {
			if (maxLength) {
				return { maxLength };
			}
			return null;
		};

		let onClickAction;
		if (onClickInputAction) {
			onClickAction = onClickInputAction;
		} else {
			onClickAction = () => {
				this.showLabel();
			};
		}

		const propsList = {
			...props,
			className: CreateinputClassName,
			ref: (element) => {
				if (inputRef) inputRef(element);
				this.textInput = element;
			},
			...valueData(),
			onClick: onClickAction,
			onTouchStart: onClickAction,
			onChange: this.onChangeHandler,
			...setMaxLength()
		};

		const TagName = as === 'textarea' ? (
			<Textarea
				{...propsList}
				minRows={1}
				maxRows={5}
			/>
		) : <input {...propsList} />;

		return (
			<div className={className}>
				{this.renderLabel()}
				<div className={styles.wrapper}>
					{renderIconLeft()}
					{renderIconRight()}
					{renderTextCounter()}
					{TagName}
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
