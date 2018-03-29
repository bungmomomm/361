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

	componentDidMount() {
		if (this.props.botNav) this.props.botNav(this.botNav);
	}

	componentWillUnmount() {
		if (this.props.botNav) this.props.botNav(false);
	}

	render() {
		const { className, active, scroll, totalCartItems, isLogin } = this.props;

		// const isSticky = (oldPos = this.currentScrollPos) => {
		// 	if (!scroll) {
		// 		return false;
		// 	}
		// 	this.currentScrollPos = scroll.top;
		// 	return scroll.top > oldPos && scroll.top < scroll.docHeight;
		// };

		const createClassName = classNames(
			styles.container,
			scroll && scroll.isNavSticky ? styles.hide : '',
			className
		);
		const profileUrl = isLogin ? '/profile' : '/login?redirect_uri=/profile';


		const homeAttribute = {
			to: '/',
			icon: 'ico_home-new.svg',
			label: 'Home',
		};

		if (active !== 'Home') {
			homeAttribute.icon = 'ico_home.svg';
		} else if (active === 'Home') {
			homeAttribute.active = 'Home';
		}


		return (
			<nav className={createClassName} >
				<div className={styles.wrapper}>
					<div className={styles.navigation} ref={(r) => { this.botNav = r; }}>
						<Item {...homeAttribute} />
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
							badge={(totalCartItems > 0) ? totalCartItems : null}
						/>
						<Item
							to='/promo'
							icon='ico_promo.svg'
							label='Promo'
							active={active === 'Promo'}
						/>
						<Item
							to={profileUrl}
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
