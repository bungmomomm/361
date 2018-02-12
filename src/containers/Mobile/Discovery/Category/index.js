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
import CONST from '@/constants';

class Category extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.defaultSegment = CONST.SEGMENT_DEFAULT_SELECTED;
		this.state = {
			activeSegment: undefined
		};
		this.userCookies = this.props.cookies.get(CONST.COOKIE_USER_TOKEN);
		this.userRFCookies = this.props.cookies.get(CONST.COOKIE_USER_RF_TOKEN);
		this.categoryLvl1 = props.match.params.categoryLvl1;
		this.source = this.props.cookies.get('user.source');
	}

	componentWillMount() {
		if (!CONST.SEGMENT_INIT.find(e => e.key === this.categoryLvl1)) {
			this.props.history.push(`/category/${this.defaultSegment.key}`);
		}

		const isActiveSegmentNotSet = this.props.home.segmen.length > 1 && this.state.activeSegment === undefined;
		if (isActiveSegmentNotSet) {
			this.setActiveState(this.props);
		}
	}

	componentWillReceiveProps(nextProps) {
		const isActiveSegmentSetFromProps = nextProps.home.segmen.length > 1
			&& nextProps.category.activeSegment !== this.props.category.activeSegment;
		if (isActiveSegmentSetFromProps) {
			this.setActiveState(nextProps);
		}
	}

	setActiveState(props) {
		const selectedSegment = props.home.segmen.find(e => e.key === props.match.params.categoryLvl1);
		this.setState({ activeSegment: selectedSegment });
	}

	getCategory(selectedSegment) {
		const { dispatch } = this.props;
		dispatch(new categoryActions.getCategoryMenuAction(this.userCookies, selectedSegment));
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

		const categories = this.state.activeSegment && category.categories.map((cat, key) => {
			let url = cat.link;
			switch (cat.type) {
			case CONST.CATEGORY_TYPE.brand:
				url = '/brands';
				break;
			case CONST.CATEGORY_TYPE.newarrival:
				url = '/new_arrival';
				break;
			case CONST.CATEGORY_TYPE.category:
				url = `/category/${this.state.activeSegment.key}/${cat.id}`;
				break;
			default:
				url = `/category/${this.state.activeSegment.key}`;
				break;
			}

			return (cat.type === CONST.CATEGORY_TYPE.digital) ?
				(
					<a key={key} href={CONST.DIGITAL_URL} className={styles.list}>
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
						current={(this.state.activeSegment === undefined || (category.categories.length < 2 && category.loading)) ? '' : this.state.activeSegment.key}
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
		dispatch(new categoryActions.getCategoryMenuAction(cookies.get(CONST.COOKIE_USER_TOKEN), selectedSegment));
	}
};

export default withCookies(connect(mapStateToProps)(Shared(Category, doAfterAnonymous)));
