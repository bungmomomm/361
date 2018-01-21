import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Svg from '../Svg';
import Button from '../Button';
import Level from '../Level';
import styles from './card.scss';


class Card extends PureComponent {
	render() {
		const { className, ...props } = this.props;

		const createClassName = classNames(
			styles.container,
			className,
		);

		return (
			<div className={createClassName} {...props}>
				<Image local src='temp/product-1.jpg' alt='product' />
				<Level style={{ borderBottom: '1px solid #D8D8D8' }}>
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
					Immaculate Brands of the Year by Yannis Philippakis - <span>Olivia Von Halle pink print</span>
				</div>
				<Level style={{ borderBottom: '1px solid #D8D8D8' }}>
					<Level.Left>
						<div>
							<div>
								<div>Rp1.199.000</div>
								<div>Rp900.900</div>
							</div>
							<div>
								<div>20%</div>
							</div>
						</div>
					</Level.Left>
					<Level.Right>
						<Button color='secondary' size='medium' outline rounded>Beli aja</Button>
					</Level.Right>
				</Level>
			</div>
		);
	}
}

export default Card;
