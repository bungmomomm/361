import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Item from './item';
import styles from './navigation.scss';

class Navigation extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			show: true
		};
		this.currentScrollPos = 0;
	}
	render() {
		const { className, active, scroll, ...props } = this.props;

		const isSticky = (oldPos = this.currentScrollPos) => {
			if (!scroll) {
				return false;
			}
			this.currentScrollPos = scroll.top;
			return scroll.top > oldPos && scroll.top < scroll.docHeight;
		};

		const createClassName = classNames(
			styles.container,
			isSticky() ? styles.hide : '',
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
							to={'/category'}
							icon='ico_categories.svg'
							label='Categories'
							active={active === 'Categories'}
							// badge={5}
						/>
						<Item
							to='/cart'
							icon='ico_cart.svg'
							label='Shopping Bag'
							active={active === 'Shopping Bag'}
						/>
						<Item
							to='/promo'
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
