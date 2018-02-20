import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Level from '../Level';
import styles from './comment.scss';

class Comment extends PureComponent {
	render() {
		const { className, data, pcpComment, ...props } = this.props;
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
							{data.review.rating}
						</Level.Right>
					</Level>
					<div className='padding--normal' style={{ marginLeft: '45px' }}>
						<div>{data.review.review}</div>
						<div className='margin--small font-small font-color--primary-ext-2'>Post updated: {data.review.created_time}</div>
					</div>
				</div>
			);
		};

		if (pcpComment) {
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
				}
			</div>
		);
	}
}

export default Comment;
