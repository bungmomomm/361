import React from 'react';
import { Svg, Level, Image, Badge } from '@/components/mobile';
import { Link } from 'react-router-dom';

const sellerStatus = (status) => {
	switch (status) {
	case 'gold':
		return 'ico_premium-seller.svg';
	case 'bronze':
		return 'ico_badgebronze.svg';
	case 'silver':
		return 'ico_badgesilver.svg';
	default:
		return '';
	}
};

const SellerProfile = ({
	image,
	status,
	isNewStore,
	successOrder,
	rating,
	totalProduct,
	name,
	location,
	description,
	storeAddress
}) => {
	return (
		<div className='margin--medium'>
			<div className='padding--small flex-row flex-spaceBetween'>
				<div className='padding--small'>
					<div className='avatar'>
						<Link to={storeAddress} >
							<Image avatar width={60} height={60} src={image} />
							<Badge attached position='bottom-right'><Svg src={sellerStatus(status)} /></Badge>
						</Link>
					</div>
				</div>
				<Level divider>
					{
						isNewStore && (
							<Level.Item className='text-center'>
								<div className='font-large flex-row flex-center'>
									<Svg src='ico_newstore.svg' />
								</div>
								<div className='font-small font-color--primary-ext-2'>New Store</div>
							</Level.Item>
						)
					}
					<Level.Item className='text-center'>
						<div className='font-large flex-row flex-center flex-middle'>
							<Svg src='ico_successorder.svg' />
							<span className='padding--small padding--none-right'>{successOrder}%</span>
						</div>
						<div className='font-small font-color--primary-ext-2'>Order Sukses</div>
					</Level.Item>
					<Level.Item className='text-center'>
						<div className='font-large flex-row flex-middle'>
							<Svg src='ico_reviews_solid_selected_small.svg' />
							<span className='padding--small padding--none-right'>{rating}</span>
						</div>
						<div className='font-small font-color--primary-ext-2'>Rating</div>
					</Level.Item>
					<Level.Item className='text-center'>
						<div className='font-large'>{totalProduct}</div>
						<div className='font-small font-color--primary-ext-2'>Produk</div>
					</Level.Item>
				</Level>
			</div>
			<div className='padding--medium margin--small'>
				<div className='font-medium'>{name}</div>
				<div className='font-small flex-row flex-middle'><Svg src='ico_pinlocation-black.svg' /> <span>{location}</span></div>
				{
					description && <div className='font-small'>{description}</div>
				}

			</div>
		</div>
	);
};

export default SellerProfile;
