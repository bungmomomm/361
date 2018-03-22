import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Item from './item';
import styles from './navigation.scss';

class Navigation extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			show: true,
			scroll: {
				top: 0,
				docHeight: 0,
				isNavSticky: false
			},
		};
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll, true);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll, true);
	}

	handleScroll = () => {
		this.setState({
			scroll: {
				top: window.props.scroll.top,
				docHeight: window.props.scroll.docHeight,
				isNavSticky: window.props.scroll.isNavSticky
			}
		});
	};

	render() {
		const { className, active, totalCartItems } = this.props;
		const { scroll } = this.state;

		const createClassName = classNames(
			styles.container,
			scroll && scroll.isNavSticky ? styles.hide : '',
			className
		);

		return (
			<nav className={createClassName} >
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
							badge={(totalCartItems > 0) ? totalCartItems : null}
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
