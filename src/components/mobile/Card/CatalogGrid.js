import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Svg from '../Svg';
import Button from '../Button';
import Level from '../Level';
import Badge from '../Badge';
import styles from './card.scss';
import { Link } from 'react-router-dom';

class CatalogGrid extends PureComponent {
	render() {
		const {
			className,
			images,
			productTitle,
			brandName,
			pricing,
			linkToPdp,
			...props
		} = this.props;

		const createClassName = classNames(styles.container, styles.grid, className);

		return (
			<div className={createClassName} {...props}>
				<Link to={linkToPdp}>
					<Image src={images[0].thumbnail} alt='product' />
				</Link>
				<Level className={styles.action}>
					<Level.Item>
						<Link to={(linkToPdp) || '/'}>
							<div className={styles.title}>
								{brandName}
								<span>{productTitle}</span>
							</div>
						</Link>
					</Level.Item>
					<Level.Right>
						<Button>
							<Svg src='ico_love-filled.svg' />
						</Button>
					</Level.Right>
				</Level>
				<Link to={(linkToPdp) || '/'}>
					<Level className={styles.footer}>
						<Level.Item>
							<div className={styles.blockPrice}>
								<div className={styles.price}>{pricing.formatted.effective_price}</div>
								<div className={styles.discount}>{pricing.formatted.base_price}</div>
							</div>
						</Level.Item>
						<Level.Right>
							<Badge rounded color='red'>
								<span className='font--lato-bold'>{pricing.discount}</span>
							</Badge>
						</Level.Right>
					</Level>
				</Link>
			</div>
		);
	}
}

export default CatalogGrid;
