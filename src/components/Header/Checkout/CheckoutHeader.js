import React from 'react';
import styles from './CheckoutHeader.scss';
import Image from '@/components/Image';
import { Container } from '@/components/Base';

const CheckoutHeader = (props) => {
	return (
		<div className={styles.header}>
			<Container flex> 
				<div className={styles.left}>
					<Image width='47' src='logo-mataharimall.png' alt='MatahariMall.com Logo' />
					<span className={styles.logo}>CHECKOUT</span>
				</div>
				<div className={styles.right}>
					<Image width='49' src='norton-logo.png' alt='Norton Logo' />
					<Image width='51' src='logo-ssl.png' alt='SSL Logo' />
				</div>
			</Container>
		</div>
	);
};

export default CheckoutHeader;