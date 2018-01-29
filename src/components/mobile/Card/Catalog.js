import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Svg from '../Svg';
import Carousel from '../Carousel';
import Button from '../Button';
import Level from '../Level';
import Badge from '../Badge';
import styles from './card.scss';

class Catalog extends PureComponent {
	render() {
		const {
			className,
			type,
			productTitle,
			brandName,
			basePrice,
			effectivePrice,
			...props
		} = this.props;

		const createClassName = classNames(styles.container, styles[type], className);
		
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
							<span>Lovelist</span>
						</Button>
					</Level.Item>
					<Level.Item>
						<Button>
							<Svg src='ico_comment.svg' />
							<span>Comment</span>
						</Button>
					</Level.Item>
				</Level>
				<div className={styles.title}>
					{productTitle} -{' '}
					<span>{brandName}</span>
				</div>
				<Level className={styles.footer}>
					<Level.Item>
						<div className={styles.blockPrice}>
							<div>
								<div className={styles.price}>{basePrice}</div>
								<div className={styles.discount}>{effectivePrice}</div>
							</div>
							<div style={{ marginLeft: '1.5rem' }}>
								<Badge rounded color='red'>
									<span className='font--lato-bold'>20%</span>
								</Badge>
							</div>
						</div>
					</Level.Item>
					<Level.Right>&nbsp;</Level.Right>
				</Level>
			</div>
		);
	}
}

export default Catalog;
