import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './article.scss';

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
				<a href={posts.link} target='_blank'>
					<img src={posts.images.thumbnail} alt='article' />
					<div className={`${styles.category} --disable-flex`}>
						<span>{posts.category}</span>
					</div>
					<div className={styles.title}>
						{posts.title}
					</div>
				</a>
				<div className={styles.author}>by {posts.author}</div>
			</div>
		);
		
	}
}

export default Article;
