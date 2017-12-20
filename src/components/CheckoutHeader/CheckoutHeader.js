import React from 'react';
import styles from './CheckoutHeader.scss';
import { Container, Col, Row } from 'mm-ui';
import Image from '../Image/Image';

const CheckoutHeader = (props) => {
	return (
		<div className={styles.header}>
			<Container>
				<Row>
					<Col>
						<a className={styles.left}>
							<Image width={47} src='logo-mataharimall.png' alt='MatahariMall.com Logo' />
							<span className={styles.logo}>CHECKOUT</span>
						</a>
					</Col>
					<Col className='text-right'>
						<div className={styles.right}>
							<Image width={49} src='norton-logo.png' alt='Norton Logo' />
							<Image width={51} src='logo-ssl.png' alt='SSL Logo' />
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default CheckoutHeader;