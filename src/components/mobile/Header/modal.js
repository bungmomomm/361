import React from 'react';
import styles from './header.scss';
import classNames from 'classnames';

const Lovelist = props => {
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
				</div>
			</div>
		</nav>
	);
};

export default Lovelist;
