import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import {
	Header,
	Tabs,
	Page,
	Image,
	Navigation
} from '@/components/mobile';
import styles from './category.scss';
import { actions as homeActions } from '@/state/v4/Home';
import { actions as categoryActions } from '@/state/v4/Category';

class Category extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			current: 1,
			notification: {
				show: true
			}
		};
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
	}

	componentWillMount() {
		const { dispatch } = this.props;
		dispatch(new homeActions.initAction({ token: this.userCookies }));		
		dispatch(new categoryActions.getCategoryMenuAction(this.userCookies, dispatch));
	}

	handlePick(current) {
		this.setState({ current });
	}

	render() {
		const { category } = this.props;
		return (
			<div style={this.props.style}>
				<Page>
					<Tabs
						current={this.state.current}
						variants={this.props.home.segmen}
						onPick={(e) => this.handlePick(e)}
					/>
					{
						category.data.map((cat, key) => {
							return (
								<Link to={cat.link} key={key} className={styles.list}>
									<Image src={cat.image_url} />
									<div className={styles.label}>{cat.title}</div>
								</Link>);
						})
					}
				</Page>
				<Header />
				<Navigation active='Categories' />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		category: state.category,
		home: state.home
	};
};

export default withCookies(connect(mapStateToProps)(Category));