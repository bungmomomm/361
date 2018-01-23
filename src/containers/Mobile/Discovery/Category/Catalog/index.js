import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Header, Page, Card, Svg, Tabs, Button, Level, Image, Input } from '@/components/mobile';
import { Link } from 'react-router-dom';
import styles from './catalog.scss';
import * as data from '@/data/example/Lovelist';

class Catalog extends Component {
	constructor(props) {
		super(props);
		this.listType = [{
			type: 'list',
			icon: 'ico_grid.svg'
		}, {
			type: 'grid',
			icon: 'ico_three-line.svg'
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
		if (e === 'view') {
			this.currentListState = this.currentListState === 2 ? 0 : this.currentListState + 1;
			this.setState({ listTypeState: this.listType[this.currentListState] });
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
			right: null
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
				<Tabs
					className={styles.fixed}
					type='segment'
					variants={[
						{
							id: 'urutkan',
							title: 'Urutkan'
						},
						{
							id: 'filter',
							title: 'filter'
						},
						{
							id: 'view',
							title: <Svg src={listTypeState.icon} />
						}
					]}
					onPick={e => this.handlePick(e)}
				/>
			</div>
		);
	}
}

Catalog.defaultProps = {
	Catalog: data.Lovelist
};


export default withCookies(Catalog);
