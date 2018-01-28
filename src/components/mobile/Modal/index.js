import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './modal.scss';

const Action = (props) => {
	return (
		<div className={`${props.className || ''} ${styles.action}`}>
			{props.closeButton}
			{props.confirmButton}
		</div>
	);
};

const Content = (props) => {
	if (!props.show) {
		return null;
	}
	return (
		<div className={`${props.className || ''} ${styles.content}`}>
			<div className={styles.wrapper}>
				{props.children}
			</div>
		</div>
	);
};


class Modal extends PureComponent {
	render() {
		const { className, ...props } = this.props;

		const createClassName = classNames(
			styles.container,
			className
		);

		return (
			<div className={createClassName} {...props}>
				{Content}
			</div>
		);
	}
}

Modal.Action = Action;
Modal.Content = Content;


export default Modal;
