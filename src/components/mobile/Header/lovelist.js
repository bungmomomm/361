import React from 'react';
import styles from './header.scss';
import Button from '../Button';
import Svg from '../Svg';
import { Link } from 'react-router-dom';

const Lovelist = props => {
	return (
		<nav className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.modal}>
					<div className={styles.left}><Button onClick={() => props.toggleGrid()}><Svg src={!props.listTypeGrid ? 'ico_grid.svg' : 'ico_list.svg'} /></Button></div>
					<div className={`${styles.center} font--lato-regular`}>Lovelist</div>
					<div className={styles.right}><Link className={styles.cancelButton} to='/'><Svg src='ico_arrow-back.svg' /></Link></div>
				</div>
			</div>
		</nav>
	);
};

export default Lovelist;
