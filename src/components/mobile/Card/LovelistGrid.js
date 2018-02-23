import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Svg from '../Svg';
import Button from '../Button';
import Level from '../Level';
import Badge from '../Badge';
import styles from './card.scss';
import { Link } from 'react-router-dom';
import { hyperlink } from '@/utils';

class LovelistGrid extends PureComponent {
	render() {
		const { className, data, isLoved } = this.props;
		const loveIcon = (isLoved) ? 'ico_love-filled.svg' : 'ico_lovelist.svg';
		const createClassName = classNames(styles.container, styles.grid, className);
		
		const linkToPdpCreator = hyperlink('', ['product', data.id], null);
  
		return (
			<div className={createClassName}>
				<Link to={linkToPdpCreator}>
					<Image src={data.images[0].thumbnail} alt={data.product_title} />
				</Link>
				<Level className={styles.action}>
					<Level.Item>
						<div className={styles.title}>
							{data.product_title}
						</div>
					</Level.Item>
					<Level.Right>
						<Button onClick={this.props.onBtnLovelistClick} data-id={data.id} >
							<Svg src={loveIcon} />
						</Button>
					</Level.Right>
				</Level>
				<Level className={styles.footer}>
					<Level.Item>
						<div className={styles.blockPrice}>
							<div className={styles.price}>{data.pricing.formatted.effective_price}</div>
							<div className={styles.discount}>{data.pricing.formatted.base_price}</div>
						</div>
					</Level.Item>
					<Level.Right>
						<Badge rounded color='red'>
							<span className='font--lato-bold'>{data.pricing.discount}</span>
						</Badge>
					</Level.Right>
				</Level>
				<Button color='secondary' size='medium' outline rounded>
					Beli aja
				</Button>
			</div>
		);
	}
}

export default LovelistGrid;
