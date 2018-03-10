import React from 'react';
import styles from './modal.scss';

const Action = (props) => {
	return (
		<div className={`${props.className || ''} ${styles.action}`}>
			{props.closeButton}
			{props.confirmButton}
		</div>
	);
};

const Modal = (props) => {
	if (!props.show) {
		return null;
	};

	const position = () => {
		if (props.position) {
			return styles[props.position];
		}
		return '';
	};

	return (
		<div className={`${props.className || ''} ${position()} ${styles.content}`}>
			<div className={styles.wrapper}>
				{props.children}
			</div>
		</div>
	);
};

Modal.Action = Action;


export default Modal;
