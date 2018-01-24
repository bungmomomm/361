import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './article.scss';
// import Carousel from '@/components/mobile';

class Article extends PureComponent {
	render() {
		const {
			className,
			mozaic
		} = this.props;
		const createClassName = classNames(
			styles.container,
			className
		);

		let container = null;
		if (mozaic.posts.length > 0) {
			container = mozaic.posts.map(({ author, category, images, link, title }, i) => {
				return (
					<div className={createClassName} key={i}>
						<img src={images.mobile} alt='article' />
						<div className={`${styles.category} --disable-flex`}>
							<span>{category}</span>
						</div>
						<a className={styles.title} href={link}>{title}</a>
						<div className={styles.author}>by {author}</div>
					</div>
				);
			});
		}
		
		return ( 
			<div>
				{container}
			</div>
		);
		
	}
}

export default Article;
