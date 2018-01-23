import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Carousel from '../Carousel';
import Svg from '../Svg';
import Button from '../Button';
import Level from '../Level';
import Badge from '../Badge';
import styles from './card.scss';


class Card extends PureComponent {
	render() {
		const { className, type, ...props } = this.props;

		const createClassName = classNames(
			styles.container,
			styles[type],
			className
		);

		if (type === 'grid') {
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
					<Button color='secondary' size='medium' outline rounded>
						Beli aja
					</Button>
				</div>
			);
		}

		return (
			<div className={createClassName} {...props}>
				<Carousel>
					<Image local src='temp/product-1.jpg' alt='product' />
					<Image local src='temp/product-1.jpg' alt='product' />
					<Image local src='temp/product-1.jpg' alt='product' />
				</Carousel>
				<Level
					className={styles.action}
					style={{ borderBottom: '1px solid #D8D8D8' }}
				>
					<Level.Item>
						<Button>
							<Svg src='ico_love-filled.svg' />
							<span>1320</span>
						</Button>
					</Level.Item>
					<Level.Item>
						<Button>
							<Svg src='ico_comment.svg' />
							<span>38</span>
						</Button>
					</Level.Item>
				</Level>
				<div className={styles.title}>
					Immaculate Brands of the Year by Yannis Philippakis -{' '}
					<span>Olivia Von Halle pink print</span>
				</div>
				<Level className={styles.footer}>
					<Level.Item>
						<div className={styles.blockPrice}>
							<div>
								<div className={styles.price}>Rp1.199.000</div>
								<div className={styles.discount}>Rp900.900</div>
							</div>
							<div style={{ marginLeft: '1.5rem' }}>
								<Badge rounded color='red'>
									<span className='font--lato-bold'>20%</span>
								</Badge>
							</div>
						</div>
					</Level.Item>
					<Level.Right>
						<Button color='secondary' size='medium' outline rounded>
							Beli aja
						</Button>
					</Level.Right>
				</Level>
			</div>
		);
	}
}

export default Card;
