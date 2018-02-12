import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Level from '../Level';
import styles from './comment.scss';

class Comment extends PureComponent {
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

		return (
			<div className={createClassName} {...props}>
				<Level style={{ paddingBottom: '5px' }} className='flex-center'>
					<Level.Left>
						<Image height={30} width={30} avatar src='https://itechway.net/wp-content/uploads/2017/08/awesome-girl-dp-1.jpg' />
					</Level.Left>
					<Level.Item>
						<div className='padding--medium'>Vinensius Wibowo</div>
					</Level.Item>
					<Level.Right>
						<div className='margin--small font-small font-color--primary-ext-2'>14 September 2017</div>
					</Level.Right>
				</Level>
				<div className='padding--normal' style={{ marginLeft: '45px' }}>
					<div>aduuuuh bajunya keren banget siiiiiiiiiiiiiiiiiiiiiiiih enggak nyesel deh beli di toko ini. makasih ya sis</div>
				</div>
			</div>
		);
	}
}

export default Comment;
