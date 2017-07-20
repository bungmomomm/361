import React from 'react';
import Helmet from 'react-helmet';
import { Checkout } from '@/components/Header';
import styles from './Checkout.scss';
import { Container, Row, Col, Card } from '@/components/Base';

export default (props) => {
	return (
		<div className={styles.checkout}>
			<Helmet title='Checkout' />
			<Checkout />
			<Container>
				<Row>
					<Col>
						<Card>
							<h2>Checkout</h2>
						</Card>
					</Col>
					<Col>
						<Card>
							<h2>Checkout</h2>
						</Card>
					</Col>
					<Col>
						<Card>
							<h2>Checkout</h2>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};