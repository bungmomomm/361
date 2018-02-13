import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Item from './item';
import styles from './navigation.scss';
import CONST from '@/constants';

class Navigation extends PureComponent {
	render() {
		const { className, active, ...props } = this.props;

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
							active={active === 'Home'}
						/>
						<Item
							to={`/category/${CONST.SEGMENT_DEFAULT_SELECTED.key}`}
							icon='ico_categories.svg'
							label='Categories'
							active={active === 'Categories'}
						/>
						<Item
							to='/'
							icon='ico_cart.svg'
							label='Shopping Bag'
							active={active === 'Shopping Bag'}
						/>
						<Item
							to='/'
							icon='ico_promo.svg'
							label='Promo'
							active={active === 'Promo'}
						/>
						<Item
							to='/profile'
							icon='ico_user.svg'
							label='Profile'
							active={active === 'Profile'}
						/>
					</div>
				</div>
			</nav>
		);
	}
}

Navigation.Item = Item;

export default Navigation;
