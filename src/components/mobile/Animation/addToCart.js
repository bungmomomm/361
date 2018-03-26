import React from 'react';
import styles from './animation.scss';

export default (props) => {
	return (
		<div style={props.style} className={styles.addToCart}>
			<img src={props.image} alt='product' />
		</div>
	);
};
