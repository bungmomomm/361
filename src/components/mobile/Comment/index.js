import React, { Component } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Level from '../Level';
import Rating from '../Rating';
import styles from './comment.scss';

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
			data.map(({ comment, customer }, i) => (
				<div key={i} className={createClassName}>
					<Level style={{ paddingBottom: '5px' }} className='flex-center'>
						<Level.Left>
							<Image height={30} width={30} avatar src={customer.customer_avatar} />
						</Level.Left>
						<Level.Item>
							<div className='padding--medium'>{customer.customer_name}</div>
						</Level.Item>
						<Level.Right>
							<div className='margin--small font-small font-color--primary-ext-2'>{comment.created_time}</div>
						</Level.Right>
					</Level>
					<div className='padding--normal' style={{ marginLeft: '45px' }}>
						<div>{comment.comment}</div>
					</div>
				</div>
			))
		);
	}

	render() {
		
		const { className, data, ...props } = this.props;
		const createClassName = classNames(styles.container, className);

		if (this.props.type === 'review') {
			return (
				<div className={createClassName} {...props}>
					<Level style={{ paddingBottom: '5px' }} className='flex-center'>
						<Level.Left>
							<Image height={30} width={30} avatar src={data.customer.customer_avatar} />
						</Level.Left>
						<Level.Item>
							<div className='padding--medium'>{data.customer.customer_name}</div>
						</Level.Item>
						<Level.Right>
							<Rating active={data.review.rating} total={5} />
						</Level.Right>
					</Level>
					<div className='padding--normal' style={{ marginLeft: '45px' }}>
						<div>{data.review.review}</div>
						<div className='margin--small font-small font-color--primary-ext-2'>Post updated: {data.review.created_time}</div>
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
										<div className='padding--medium' style={{ marginLeft: '-15px' }}>
											<b>{customer.customer_name}</b>
										</div>
									</Level.Item>
								</Level>
								{/* <div className='padding--normal'>
									<b>{customer.customer_name}</b>
								</div> */}
								<div className='padding--normal'>
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
