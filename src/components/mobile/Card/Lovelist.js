import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Svg from '../Svg';
import Carousel from '../Carousel';
import Button from '../Button';
import Level from '../Level';
import Badge from '../Badge';
import styles from './card.scss';

class Lovelist extends PureComponent {
	render() {
		const { className, type, data, ...props } = this.props;
		const createClassName = classNames(styles.container, styles[type], className);
		
		return (
			<div className={createClassName} {...props}>
				<Carousel>
					{
						data.images.map((image, idx) => (
							<Image key={idx} src={image.mobile} alt='product' />
						))
					}
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
					{data.product_title}
					<span>{data.brand}</span>
				</div>
				<Level className={styles.footer}>
					<Level.Item>
						<div className={styles.blockPrice}>
							<div>
								<div className={styles.price}>{data.pricing.formatted.effective_price}</div>
								<div className={styles.discount}>{data.pricing.formatted.base_price}</div>
							</div>
							<div style={{ marginLeft: '1.5rem' }}>
								<Badge rounded color='red'>
									<span className='font--lato-bold'>{data.pricing.discount}</span>
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

export default Lovelist;
