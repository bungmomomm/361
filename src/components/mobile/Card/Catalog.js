import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Svg from '../Svg';
import Carousel from '../Carousel';
import Button from '../Button';
import Level from '../Level';
import Badge from '../Badge';
import styles from './card.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Catalog extends PureComponent {
	render() {
		const {
			className,
			type,
			images,
			productTitle,
			brandName,
			pricing,
			url,
			commentUrl,
			commentTotal,
			linkToPdp,
			...props
		} = this.props;

		const createClassName = classNames(styles.container, styles[type], className);

		const comment = (commentTotal) ? (<span>{commentTotal} Comments</span>)
			: (<span>Comment</span>);

		return (
			<div className={createClassName} {...props}>
				<Link to={linkToPdp}>
					<Carousel>
						{
							images.map((image, index) => (
								<Image key={index} src={image.thumbnail} alt='product' />
							))
						}
					</Carousel>
				</Link>
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
						<Link to={(commentUrl) || '/'}>
							<Button>
								<Svg src='ico_comment.svg' />
								{comment}
							</Button>
						</Link>
					</Level.Item>
				</Level>
				<Link to={(linkToPdp) || '/'}>
					<div className={styles.title}>
						{brandName} - <span>{productTitle}</span>
					</div>
					<Level className={styles.footer}>
						<Level.Item>
							<div className={styles.blockPrice}>
								<div>
									<div className={styles.price}>{pricing.formatted.effective_price}</div>
									<div className={styles.discount}>{pricing.formatted.base_price}</div>
								</div>
								<div style={{ marginLeft: '1.5rem' }}>
									<Badge rounded color='red'>
										<span className='font--lato-bold'>{pricing.discount}</span>
									</Badge>
								</div>
							</div>
						</Level.Item>
						<Level.Right>&nbsp;</Level.Right>
					</Level>
				</Link>
			</div>
		);
	}
}

Catalog.defaultProps = {
	linkToPdp: '/'
};

Catalog.propTypes = {
	brandName: PropTypes.string,
	linkToPdp: PropTypes.string.isRequired
};

export default Catalog;
