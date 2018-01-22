import React from 'react';
import styles from './header.scss';
import Svg from '../Svg';
import { Link } from 'react-router-dom';

const Lovelist = props => {
	return (
		<nav className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.modal}>
					<div className={styles.left}><Svg src='ico_grid.svg' /></div>
					<div className={`${styles.center} font--lato-regular`}>Lovelist</div>
					<div className={styles.right}>
						<Link className={styles.cancelButton} to='/'><Svg src='ico_arrow-back.svg' /></Link>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Lovelist;
