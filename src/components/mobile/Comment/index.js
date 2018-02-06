import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Image from '../Image';
import Level from '../Level';
import styles from './comment.scss';

class Comment extends PureComponent {
	render() {
		const { className, ...props } = this.props;

		const createClassName = classNames(styles.container, className);

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
						Rating
					</Level.Right>
				</Level>
				<div className='padding--normal' style={{ marginLeft: '45px' }}>
					<div>aduuuuh bajunya keren banget siiiiiiiiiiiiiiiiiiiiiiiih enggak nyesel deh beli di toko ini. makasih ya sis</div>
					<div className='margin--small font-small font-color--primary-ext-2'>Post updated: 14 September 2017</div>
				</div>
			</div>
		);
	}
}

export default Comment;
