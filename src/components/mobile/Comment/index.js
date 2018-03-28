import React, { Component } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Level from '../Level';
import Rating from '../Rating';
import Badge from '../Badge';
import styles from './comment.scss';
import { trimString } from '@/utils';

class Comment extends Component {

	constructor(props) {
		super(props);
		this.props = props;
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.loading !== this.props.loading) {
			return true;
		}

		return false;
	}

	renderData() {
		const { className, data } = this.props;
		const createClassName = classNames(styles.container, className);

		return (
			data.map(({ comment, customer }, i) => {
				const borderStyle = i !== (data.length - 1) ? '1px solid #D8D8D8' : 'none';
				return (
					<div key={i} className={createClassName}>
						<Level style={{ paddingBottom: '5px' }} className='flex-center'>
							<Level.Left>
								<Image height={30} width={30} avatar src={customer.customer_avatar} />
							</Level.Left>
							<Level.Item>
								<div
									className='padding--medium-h font--lato-bold'
									style={{ paddingTop: '5px' }}
								>
									{trimString(customer.customer_name, 20)}
								</div>
							</Level.Item>
							<Level.Right>
								<div
									className='margin--small-v font-small font-color--primary-ext-2'
									style={{ fontStyle: 'italic' }}
								>
									{comment.created_time}
								</div>
							</Level.Right>
						</Level>
						<div
							className='padding--normal-h'
							style={{ marginLeft: '45px' }}
						>
							<div
								style={{ borderBottom: borderStyle, paddingBottom: '15px' }}
							>
								{comment.comment}
							</div>
						</div>
					</div>
				);
			})
		);
	}

	render() {

		const { className, data, ...props } = this.props;
		const createClassName = classNames(styles.container, className);

		if (this.props.type === 'review-reply') {
			try {
				
				const { sellerData, replyData } = this.props;
				return (
					<div className={createClassName} >
						<Level style={{ paddingBottom: '5px' }} className='flex-center'>
							<Level.Left>
								<Image avatar width={30} height={30} src={sellerData.seller_logo} />
								<Badge attached position='bottom-right'><Image src={sellerData.seller_badge_image} width={12} /></Badge>
							</Level.Left>
							<Level.Item>
								<div className='padding--medium-h font--lato-bold flex-row'>{sellerData.seller}<span className={styles.sellerBadge}>Penjual</span></div>
							</Level.Item>
						</Level>
						<div className='padding--normal-h border-bottom padding--small-b' style={{ marginLeft: '45px' }}>
							<div>{replyData.reply}</div>
							<div className='margin--small-v font-small font-color--primary-ext-2'>Post updated: {replyData.created_time}</div>
						</div>
					</div>
				);
			} catch (error) {
				console.log('error: ', error);
			}
		}

		if (this.props.type === 'review') {
			return (
				<div className={createClassName} {...props}>
					<Level style={{ paddingBottom: '5px' }} className='flex-center'>
						<Level.Left>
							<Image height={30} width={30} avatar src={data.customer.customer_avatar} />
						</Level.Left>
						<Level.Item>
							<div className='padding--medium-h font--lato-bold'>{data.customer.customer_name}</div>
						</Level.Item>
						<Level.Right>
							<Rating active={data.review.rating} total={5} />
						</Level.Right>
					</Level>
					<div className='padding--normal-h padding--small-b' style={{ marginLeft: '45px' }}>
						<div>{data.review.review}</div>
						<div className='margin--small-v font-small font-color--primary-ext-2'>Post updated: {data.review.created_time}</div>
					</div>
				</div>
			);
		}

		if (this.props.type === 'lite-review') {
			return (
				<div>
					{
						data.map(({ comment, customer }, i) => (
							<div key={i} className={createClassName}>
								<Level style={{ paddingBottom: '5px' }} className='flex-center'>
									<Level.Item>
										<div className='padding--medium-h font--lato-bold' style={{ marginLeft: '-15px' }}>
											<b>{customer.customer_name}</b>
										</div>
									</Level.Item>
								</Level>
								<div className='padding--normal-h'>
									<div>{comment.comment}</div>
								</div>
							</div>
						))
					}
				</div>
			);
		}

		return (
			<div>
				{
					this.renderData()
				}
			</div>
		);
	}
}

export default Comment;
