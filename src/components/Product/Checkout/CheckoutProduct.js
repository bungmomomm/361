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
						src='https://mm-imgs.s3.amazonaws.com/tx200/2017/06/16/14/power-bank_anker-astro-e3-10000mah-portable-charge-hitam_3990882_1_99898.jpeg' 
						width={50}
						height={50}
						alt='samsung'
					/>
				</div>
				<div className={styles.bodyRight}>
					<div className={styles.title}>Adidas Tubular Red Edition - Running Adidas Tubular Red Edition - Running</div>
					<div className={styles.option}>
						<div className={styles.price}>Rp 2.000.000</div>
						<div className={styles.qty}>
							<Stepper maxValue={10} />
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
					<div><em>Size : 44</em></div>
				</div>
			</div>
		</div>
	);
};