import React from 'react';
import styles from './header.scss';

const Lovelist = props => {
	return (
		<nav className={`${styles.container} ${props.disableShadow && styles.disableShadow}`}>
			<div className={styles.wrapper}>
				<div className={styles.modal}>
					<div className={styles.left}>{props.left}</div>
					<div className={`${styles.center} font--lato-regular`}>{props.center}</div>
					<div className={styles.right}>{props.right}</div>
				</div>
			</div>
		</nav>
	);
};

export default Lovelist;
