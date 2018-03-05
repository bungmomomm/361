import React from 'react';
import styles from './header.scss';
import classNames from 'classnames';

const Modal = props => {
	const containerClass = classNames(
		styles.container,
		props.className,
		props.disableShadow ? styles.disableShadow : null,
		props.transparent ? styles.transparent : null
	);
	const modalClass = classNames(
		styles.modal,
		props.transparent ? styles.transparent : null
	);
	return (
		<nav className={containerClass}>
			<div className={styles.wrapper}>
				<div style={props.style} className={modalClass}>
					<div className={styles.left}>{props.left}</div>
					<div className={`${styles.center} font--lato-regular`}>{props.center}</div>
					<div className={styles.right}>{props.right}</div>
					{ props.rows && props.rows.length > 0 ?
						props.rows.map((row, i) => (
							<div key={i} className={styles.row}>
								<div className={styles.left}>{row.left}</div>
								<div className={`${styles.center} font--lato-regular`}>{row.center}</div>
								<div className={styles.right}>{row.right}</div>
							</div>
						))
						: null
					}
				</div>
			</div>
		</nav>
	);
};

export default Modal;
