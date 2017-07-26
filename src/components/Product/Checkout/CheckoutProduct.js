import React from 'react';
import styles from './CheckoutProduct.scss';
import Figure from '@/components/Figure';
import { Button } from '@/components/Base';
import Stepper from '@/components/Stepper';

export default (props) => {
	return (
		<div className={styles.list}>
			<div className={styles.body}>
				<div className={styles.bodyLeft}>
					<Figure 
						src={props.data.image}
						width={50}
						height={50}
						alt={props.data.name}
					/>
				</div>
				<div className={styles.bodyRight}>
					<div className={styles.title}>{props.data.name}</div>
					<div className={styles.option}>
						<div className={styles.price}>{props.data.price}</div>
						<div className={styles.qty}>
							<Stepper value={props.data.qty} maxValue={props.data.maxQty} />
						</div>
					</div>
				</div>
			</div>
			<div className={styles.body}>
				<div className={styles.bodyLeft}>
					<Button clean icon='trash-o' font='lightGrey' text='Hapus' />
				</div>
				<div className={styles.bodyRight}>
					<div><strong>Keterangan:</strong></div>
					{
						props.data.attribute.map((list, i) => (
							<div key={i}><em>{list}</em></div>
						))
					}
				</div>
			</div>
		</div>
	);
};