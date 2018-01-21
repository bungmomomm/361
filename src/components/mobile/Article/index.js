import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './article.scss';

class Article extends PureComponent {
	render() {
		const {
			className,
		} = this.props;

		const createClassName = classNames(
			styles.container,
			className
		);

		return (
			<div className={createClassName} >
				<img src='https://www.hyov.com/wp-content/uploads/edd/2015/09/HYOV-APT-132-Fashion-Banners_Thumbnail.png' alt='article' />
				<div className={`${styles.category} --disable-flex`}>
					<span>lifestyle</span>
				</div>
				<a className={styles.title} href='/'>Aliqua dolor cupidatat non eu anim quis commodo tempor.</a>
				<div className={styles.author}>by Vinensius Wibowo</div>
			</div>
		);
	}
}

export default Article;
