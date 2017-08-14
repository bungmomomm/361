import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CheckoutProduct.scss';
import Figure from '@/components/Figure';
import { Button } from '@/components/Base';
import Stepper from '@/components/Stepper';

import { currency } from '@/utils';


export default class CheckoutProduct extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.onDeleteCart = this.onDeleteCart.bind(this);
	}
	onDeleteCart() {
		this.props.onDeleteCart(this.props);
	}
	render() {
		return (
			<div className={styles.list}>
				<div className={styles.body}>
					<div className={styles.bodyLeft}>
						<Figure 
							src={this.props.data.image}
							width={50}
							height={50}
							alt={this.props.data.name}
						/>
					</div>
					<div className={styles.bodyRight}>
						<div className={styles.title}>{this.props.data.name}</div>
						<div className={styles.option}>
							<div className={styles.price}>{currency(this.props.data.price)}</div>
							<div className={styles.qty}>
								<Stepper value={this.props.data.qty} maxValue={this.props.data.maxQty} />
							</div>
						</div>
					</div>
				</div>
				<div className={styles.body}>
					<div className={styles.bodyLeft}>
						<Button clean size='small' icon='trash-o' iconPosition='left' content='Hapus' onClick={this.onDeleteCart} />
					</div>
					<div className={styles.bodyRight}>
						<div><strong>Keterangan:</strong></div>
						{
							this.props.data.attribute.map((list, i) => (
								<div key={i}><em>{list}</em></div>
							))
						}
					</div>
				</div>
			</div>
		);
	}
};

CheckoutProduct.propTypes = {
	data: PropTypes.object.isRequired
};