import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './article.scss';
// import Carousel from '@/components/mobile';

class Article extends PureComponent {
	render() {
		const {
			className,
			posts
		} = this.props;
		const createClassName = classNames(
			styles.container,
			className
		);
		
		return ( 
			<div className={createClassName}>
				<img src={posts.images.thumbnail} alt='article' />
				<div className={`${styles.category} --disable-flex`}>
					<span>{posts.category}</span>
				</div>
				<a className={styles.title} href={posts.link}>{posts.title}</a>
				<div className={styles.author}>by {posts.author}</div>
			</div>
		);
		
	}
}

export default Article;
