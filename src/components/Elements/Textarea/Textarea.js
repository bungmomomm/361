import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { injectProps } from '@/decorators';
import { newId, renderIf } from '@/utils';
import Icon from '../Icon/Icon';
import Sprites from '../Sprites/Sprites';

import styles from './Textarea.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default class Textarea extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	@injectProps
	render({
		horizontal,
		color,
		size,
		label,
		name,
		placeholder,
		value,
		onClick,
		onChange,
		message,
		icon,
		readOnly,
		sprites
	}) {
		const TextareaWrapper = cx({
			TextareaWrapper: true,
			horizontal: !!horizontal
		});

		const TextareaBodyClass = cx({
			textareaBody: true,
			horizontal: !!horizontal,
		});

		const TextareaClass = cx({
			Textarea: true,
			[`Textarea__${color}`]: !!color,
			[`Textarea__${size}`]: !!size
		});
		
		const idFor = newId();

		const LabelElement = (
			renderIf(label)(
				<label htmlFor={idFor}>
					{label}
				</label> 
			)
		);

		const SpritesElement = (
			renderIf(sprites)(
				<span className={styles.sprites}>
					<Sprites name={sprites} />
				</span>
			)
		);

		const IconElement = (
			renderIf(icon)(
				<span className={styles.icon}>
					<Icon name={icon} />
				</span>
			)
		);

		const MessageElement = (
			renderIf(message)(
				<div className={styles.message}>{message}</div>
			)
		);

		const TextAreaElement = (
			<textarea 
				id={idFor}
				className={TextareaClass} 
				name={name}
				readOnly={readOnly}
				placeholder={placeholder}
				defaultValue={value}
				onClick={onClick}
				onChange={onChange}
			/>
		);
		
		return (
			<div className={TextareaWrapper}>
				{LabelElement}
				<div className={TextareaBodyClass}>
					{TextAreaElement}
					{SpritesElement}
					{IconElement}
					{MessageElement}
				</div>
			</div>
		);
	}
};

Textarea.propTypes = {
	/** make horinzontal layout. */
	horizontal: PropTypes.bool,
	color: PropTypes.oneOf(['red', 'yellow', 'orange', 'green']),
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	/** label content. */
	label: PropTypes.string,
	/** Textarea Attribute Name. */
	name: PropTypes.string,
	/** Textarea Attribute Placeholder. */
	placeholder: PropTypes.string,
	/** Textarea Attribute value. */
	value: PropTypes.string,
	/** Textarea info or message. */
	message: PropTypes.string,
	/** Input Attribute Read Only. */
	readOnly: PropTypes.bool,
	/** Add image Sprites. */
	sprites: PropTypes.string,
	/** Add Icon. */
	icon: PropTypes.string
};