import React, { PureComponent } from 'react';
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
import { actions as categoryActions } from '@/state/v4/Category';
import Shared from '@/containers/Mobile/Shared';

class Category extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			activeSegment: {
				id: 1,
				key: 'wanita',
				title: 'Wanita'
			},
			notification: {
				show: true
			}
		};
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.categoryLvl1 = props.match.params.categoryLvl1;
		this.source = this.props.cookies.get('user.source');
	}

	componentWillMount() {
		if (!['wanita', 'pria', 'anak'].includes(this.categoryLvl1)) {
			this.props.history.push('/category/wanita');
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.category.activeSegment !== this.props.category.activeSegment) {
			this.setState({ activeSegment: nextProps.category.activeSegment });
		}
	}

	getCategory(selectedSegment) {
		const { dispatch } = this.props;
		dispatch(new categoryActions.getCategoryMenuAction(this.userCookies, selectedSegment.id, selectedSegment));
		this.setState({ activeSegment: selectedSegment });
	}

	handlePick(selectedSegmentId) {
		const selectedSegment = this.props.home.segmen.find(e => e.id === selectedSegmentId);
		if (selectedSegment !== this.state.activeSegment) {
			this.setState({ activeSegment: selectedSegment });
			this.getCategory(selectedSegment);
			this.props.history.push(`/category/${selectedSegment.key}`);
		}
	}

	render() {
		const { category } = this.props;

		const loading = (<div />);

		const categories = category.categories.map((cat, key) => {
			let url = cat.link;
			switch (cat.type) {
			case 'brand':
				url = '/brands';
				break;
			case 'newarrival':
				url = '/newArrival';
				break;
			case 'category':
				url = `/category/${this.state.activeSegment.key}/${cat.id}`;
				break;
			default:
				url = `/category/${this.state.activeSegment.key}`;
				break;
			}

			return (cat.type === 'digital') ?
				(
					<a key={key} href='https://digital.mataharimall.com/' className={styles.list}>
						<Image src={cat.image_url} />
						<div className={styles.label}>{cat.title}</div>
					</a>)
				: (
					<Link to={url} key={key} className={styles.list}>
						<Image src={cat.image_url} />
						<div className={styles.label}>{cat.title}</div>
					</Link>
				);
		});

		return (
			<div style={this.props.style}>
				<Page>
					<Tabs
						current={(this.props.home.segmen.length < 2) ? '' : this.state.activeSegment.key}
						variants={this.props.home.segmen}
						onPick={(e) => this.handlePick(e)}
					/>
					<div>
						{ category.loading ? loading : categories }
					</div>
				</Page>
				<Header lovelist={this.props.shared.totalLovelist} value={this.props.search.keyword} />
				<Navigation active='Categories' />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		category: state.category,
		home: state.home,
		shared: state.shared,
		search: state.search
	};
};

const doAfterAnonymous = (props) => {
	const { category, home, match, dispatch, cookies } = props;
	if (category.categories.length < 1) {
		const selectedSegment = home.segmen.find(e => e.key === match.params.categoryLvl1);
		dispatch(new categoryActions.getCategoryMenuAction(cookies.get('user.token'), selectedSegment.id, selectedSegment));
	}
};

export default withCookies(connect(mapStateToProps)(Shared(Category, doAfterAnonymous)));
