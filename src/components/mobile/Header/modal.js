import React from 'react';
import styles from './header.scss';
import classNames from 'classnames';

const Modal = props => {
	const renderRow = props.rows && props.rows.length > 0;
	const containerClass = classNames(
		styles.container,
		props.className,
		props.disableShadow ? styles.disableShadow : null,
		props.transparent ? styles.transparent : null
	);
	const modalClass = classNames(
		styles.modal,
		renderRow ? styles.rows : null,
		props.transparent ? styles.transparent : null
	);
	const subHeader = () => {
		let CompHeader = null;

		if (!Array.isArray(props.rows)) { // backward Array compability
			CompHeader = props.rows;
		} else {
			CompHeader = props.rows.map((row, i) => (
				<div key={i} className={styles.row}>
					<div className={styles.left}>{row.left}</div>
					<div className={`${styles.center} font--lato-regular`}>{row.center}</div>
					<div className={styles.right}>{row.right}</div>
				</div>
			));
		}

		if (!CompHeader) return null;

		return (
			<div className={styles.subHeaderWrapper}>
				<div className={styles.subHeader}>
					{CompHeader}
				</div>
			</div>
		);
	};

	return (
		<nav className={containerClass}>
			<div className={styles.wrapper}>
				<div style={props.style} className={modalClass}>
					<div className='flex-row flex-spaceBetween flex-middle'>
						<div className={styles.left}>{props.left}</div>
						<div className={`${styles.center} font--lato-regular font-15`}>{props.center}</div>
						<div className={styles.right}>{props.right}</div>
					</div>
				</div>
			</div>
			{subHeader()}
		</nav>
	);
};

export default Modal;
