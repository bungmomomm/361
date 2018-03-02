import React from 'react';
import styles from './header.scss';
import classNames from 'classnames';

const Lovelist = props => {
	const className = classNames(
		styles.modal,
		props.rows ? styles.rows : null
	);
	return (
		<nav className={`${styles.container} ${props.className || ''} ${props.disableShadow ? styles.disableShadow : ''}`}>
			<div className={styles.wrapper}>
				<div style={props.style} className={className}>
					<div className={styles.left}>{props.left}</div>
					<div className={`${styles.center} font--lato-regular`}>{props.center}</div>
					<div className={styles.right}>{props.right}</div>
					{ props.rows && props.rows.length > 0 ?
						props.rows.map((row, i) => (
							<div className={styles.row}>
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

export default Lovelist;
