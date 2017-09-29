import React, { Component } from 'react';
import styles from './StoreBoxBody.scss';
import { Button, Figure, Stepper } from '@/components';

import { currency } from '@/utils';


export default class StoreBoxBody extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		const { data, onUpdateQty } = this.props;

		return (
			<div className={styles.list}>
				<div className={styles.body}>
					<div className={styles.bodyLeft}>
						<Figure 
							src={data.image}
							width={50}
							height={50}
							alt={data.name}
						/>
					</div>
					<div className={styles.bodyRight}>
						<div className={styles.title}>{data.name}</div>
						<div className={styles.option}>
							<div className={styles.price}>{currency(data.price)}</div>
							<div className={styles.qty}>
								{
									data.qty && <Stepper 
										size='small' 
										value={data.qty} 
										maxValue={data.maxQty} 
										onChange={onUpdateQty} 
									/>
								}
							</div>
						</div>
					</div>
				</div>
				<div className={styles.body}>
					<div className={styles.bodyLeft}>
						{
							(data.maxQty >= 1) ? (
								<Button 
									size='small' 
									icon='trash-o' 
									iconPosition='left' 
									content='Hapus' 
									onClick={this.props.deleteProduct} 
								/>
							) : <Button />
						}
					</div>
					<div className={styles.bodyRight}>
						{
							data.attribute.map((list, iList) => (
								<div key={iList}><em>{list}</em></div>
							))
						}
					</div>
				</div>
				{
					this.props.restrictO2o && (
						<div className={styles.body}>
							<p className='font-red'>Penjual tidak menyediakan layanan o2o</p>
						</div>
					)
				}
			</div>
		);
	}
};