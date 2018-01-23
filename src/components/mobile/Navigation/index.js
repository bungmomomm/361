import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Item from './item';
import styles from './navigation.scss';

class Navigation extends PureComponent {
	render() {
		const { className, ...props } = this.props;

		const createClassName = classNames(
			styles.container,
			className
		);

		return (
			<nav className={createClassName} {...props}>
				<div className={styles.wrapper}>
					<div className={styles.navigation}>
						<Item
							to='/'
							icon='ico_home.svg'
							label='Home'
						/>
						<Item
							to='/'
							icon='ico_categories.svg'
							label='categories'
						/>
						<Item
							to='/'
							icon='ico_cart.svg'
							label='Shopping Bag'
						/>
						<Item
							to='/'
							icon='ico_promo.svg'
							label='Promo'
						/>
						<Item
							to='/'
							icon='ico_user.svg'
							label='Profile'
						/>
					</div>
				</div>
			</nav>
		);
	}
}

Navigation.Item = Item;

export default Navigation;
