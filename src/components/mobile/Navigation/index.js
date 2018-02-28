import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Item from './item';
import styles from './navigation.scss';

class Navigation extends PureComponent {
	constructor(props) {
		super(props);
		this.handleScroll = this.handleScroll.bind(this);
		this.state = {
			show: true
		};
		this.stateScroll = 0;
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll, true);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll, true);
	}

	handleScroll(e) {
		const { show } = this.state;
		if (e.target.scrollTop > this.stateScroll && show) {
			this.setState({ show: false });
		}
		if (e.target.scrollTop < this.stateScroll && !show) {
			this.setState({ show: true });
		}
		this.stateScroll = e.target.scrollTop;
	}

	render() {
		const { className, active, ...props } = this.props;

		const createClassName = classNames(
			styles.container,
			!this.state.show ? styles.hide : '',
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
