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
				isNavSticky: false,
				isNavExists: false
			},
		};
		this.docBody = null;
		this.currentScrollPos = 0;
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll, true);
		this.docBody = document.body;
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll, true);
	}

	handleScroll = (e) => {
		if (e.target.tagName === 'BODY') {
			const docHeight = this.docBody ? this.docBody.scrollHeight - window.innerHeight : 0;
			this.setState({
				scroll: {
					top: e.target.scrollTop,
					docHeight,
					isNavSticky: ((oldPos = this.currentScrollPos) => {
						if (!scroll) {
							return false;
						}
						this.currentScrollPos = this.state.scroll.top;
						return this.state.scroll.top > oldPos && this.state.scroll.top < this.state.scroll.docHeight;
					})()
				}
			});
		}
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
