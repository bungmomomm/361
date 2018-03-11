import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Header, Page, Card, Svg, Tabs, Button, Level, Image, Input, List } from '@/components/mobile';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Shared from '@/containers/Mobile/Shared';
import styles from './catalog.scss';

class Catalog extends Component {
	constructor(props) {
		super(props);
		this.listType = [{
			type: 'list',
			icon: 'ico_grid.svg'
		}, {
			type: 'grid',
			icon: 'ico_grid-3x3.svg'
		}, {
			type: 'small',
			icon: 'ico_list.svg'
		}];

		this.currentListState = 0;
		this.state = {
			listTypeState: this.listType[this.currentListState]
		};
	}

	handlePick(e) {
		switch (e) {
		case 'view':
			this.currentListState = this.currentListState === 2 ? 0 : this.currentListState + 1;
			this.setState({ listTypeState: this.listType[this.currentListState] });
			break;
		case 'filter':
			this.props.history.push('/filterCategory');
			break;
			// Router.history.push('/filterCategory');
		default:
			break;
		}
	}

	renderList() {
		const renderBlockComment = (
			<div className={styles.commentBlock}>
				<Button>View 38 comments</Button>
				<Level>
					<Level.Left><div style={{ marginRight: '10px' }}><Image avatar width={25} height={25} local src='temp/pp.jpg' /></div></Level.Left>
					<Level.Item>
						<Input color='white' placeholder='Write comment' />
					</Level.Item>
				</Level>
			</div>
		);
		switch (this.state.listTypeState.type) {
		case 'list':
			return (
				<div className={styles.cardCatalog}>
					<Card.Catalog />
					{renderBlockComment}
				</div>
			);
		case 'grid':
			return <Card.CatalogGrid />;
		case 'small':
			return <Card.CatalogSmall />;
		default:
			return null;
		}
	}

	render() {
		const { listTypeState } = this.state;

		const HeaderPage = {
			left: (
				<Link to='/brandcategory'>
					<Svg src={'ico_arrow-back-left.svg'} />
				</Link>
			),
			center: 'Jaket & Coat',
			right: null,
			rows: (
				<Tabs
					type='segment'
					variants={[
						{
							id: 'urutkan',
							Title: 'Urutkan'
						},
						{
							id: 'filter',
							Title: 'filter'
						},
						{
							id: 'view',
							Title: <Svg src={listTypeState.icon} />
						}
					]}
					onPick={e => this.handlePick(e)}
				/>
			)
		};

		return (
			<div style={this.props.style}>
				<Page>
					<div className={styles.cardContainer}>
						{this.renderList()}
						{this.renderList()}
						{this.renderList()}
						{this.renderList()}
						{this.renderList()}
						{this.renderList()}
					</div>
					<div className={styles.loadmore}>
						<Button color='secondary' outline size='large'> LOAD MORE </Button>
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
				<div className={styles.filterNavigation}>
					<List>
						<List.Content>
							Populer
							<Svg src='ico_check.svg' />
						</List.Content>
					</List>
					<List>
						<List.Content>
							Terbaru
							<Svg src='ico_empty.svg' />
						</List.Content>
					</List>
					<List>
						<List.Content>
							Harga Terendah
							<Svg src='ico_empty.svg' />
						</List.Content>
					</List>
					<List>
						<List.Content>
							Harga Tertinggi
							<Svg src='ico_empty.svg' />
						</List.Content>
					</List>
					<List>
						<List.Content>
							Diskon Terendah
							<Svg src='ico_empty.svg' />
						</List.Content>
					</List>
					<List>
						<List.Content>
							Diskon Tertinggi
							<Svg src='ico_empty.svg' />
						</List.Content>
					</List>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		...state,
		shared: state.shared,
		productCategory: state.productCategory,
		isLoading: state.productCategory.isLoading,
		scroller: state.scroller
	};
};
export default withCookies(connect(mapStateToProps)(Shared(Catalog)));
