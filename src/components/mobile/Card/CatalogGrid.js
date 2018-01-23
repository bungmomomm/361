import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Svg from '../Svg';
import Button from '../Button';
import Level from '../Level';
import Badge from '../Badge';
import styles from './card.scss';


class CatalogGrid extends PureComponent {
	render() {
		const { className, ...props } = this.props;

		const createClassName = classNames(styles.container, styles.grid, className);

		return (
			<div className={createClassName} {...props}>
				<Image local src='temp/product-1.jpg' alt='product' />
				<Level className={styles.action}>
					<Level.Item>
						<div className={styles.title}>
							Immaculate Brands of the Year by Yannis Philippakis
						</div>
					</Level.Item>
					<Level.Right>
						<Button>
							<Svg src='ico_love-filled.svg' />
						</Button>
					</Level.Right>
				</Level>
				<Level className={styles.footer}>
					<Level.Item>
						<div className={styles.blockPrice}>
							<div className={styles.price}>Rp1.199.000</div>
							<div className={styles.discount}>Rp900.900</div>
						</div>
					</Level.Item>
					<Level.Right>
						<Badge rounded color='red'>
							<span className='font--lato-bold'>20%</span>
						</Badge>
					</Level.Right>
				</Level>
			</div>
		);
	}
}

export default CatalogGrid;
