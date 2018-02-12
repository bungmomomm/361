import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import {
	Page,
	Navigation,
	Card,
	Svg,
	Header,
	Button,
	Image,
	Tabs,
} from '@/components/mobile';
import styles from './brands.scss';
// import { actions } from '@/state/v4/Brand';

const DUMMY_PRODUCT_GRID = {
	images: [
		{ thumbnail: 'https://www.wowkeren.com/images/events/ori/2015/03/26/minah-album-i-am-a-woman-too-01.jpg' },
		{ thumbnail: 'https://www.wowkeren.com/images/events/ori/2015/03/26/minah-album-i-am-a-woman-too-02.jpg' }
	],
	productTitle: 'Immaculate Brands of the Year by Yannis Philippakis',
	brandName: 'Olivia Von Halle pink print',
	pricing: {
		formatted: {
			effective_price: 'Rp.1000.000',
			base_price: 'Rp.900.000'
		},
		discount: '20%'
	}
};


class Detail extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.listType = [{
			type: 'grid',
			icon: 'ico_grid.svg'
		}, {
			type: 'small',
			icon: 'ico_three-line.svg'
		}];

		this.currentListState = 0;
		this.handleScroll = this.handleScroll.bind(this);
		this.state = {
			listTypeState: this.listType[this.currentListState],
			styleHeader: true
		};
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll, true);
	}
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll, true);
	}

	handleScroll(e) {
		const { styleHeader } = this.state;
		if (e.target.scrollTop > 300 && styleHeader) {
			this.setState({ styleHeader: false });
		}
		if (e.target.scrollTop < 300 && !styleHeader) {
			this.setState({ styleHeader: true });
		}
	}

	renderList() {
		switch (this.state.listTypeState.type) {
		case 'grid':
			return <Card.CatalogGrid {...DUMMY_PRODUCT_GRID} />;
		case 'small':
			return <Card.CatalogSmall {...DUMMY_PRODUCT_GRID} />;
		default:
			return null;
		}
	}

	render() {
		const { styleHeader } = this.state;
		const HeaderPage = {
			left: (
				<Link to='/category'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Brands',
			right: <Button><Svg src='ico_share.svg' /></Button>
		};
		return (
			<div style={this.props.style}>
				<Page>
					<div style={{ marginTop: '-60px', marginBottom: '30px' }}>
						<div className={`${styles.backgroundCover} flex-center`} style={{ backgroundImage: 'url(http://coverlayout.com/facebook/covers/spring-easter-bunny-eggs/spring-easter-bunny-eggs.jpg)' }}>
							<div>
								<div className='margin--small'><Image width={60} height={60} src='http://images4.wikia.nocookie.net/__cb20121104001423/logopedia/images/e/ee/Burger_King_Logo.svg.png' /></div>
								<div className='text-uppercase font--lato-bold font-medium'>Nevada</div>
								<div>450 Produk</div>
							</div>
						</div>
						<Tabs
							className='margin--medium'
							current=''
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
									title: <Svg src={this.state.listTypeState.icon} />
								}
							]}
							onPick={e => this.handlePick(e)}
						/>
						<div className='flex-row flex-wrap'>
							{this.renderList()}
							{this.renderList()}
							{this.renderList()}
							{this.renderList()}
							{this.renderList()}
							{this.renderList()}
						</div>
						<div className='flex-center margin--large'>
							<Button color='secondary' outline size='large'> LOAD MORE </Button>
						</div>
					</div>
				</Page>
				<Header.Modal className={styleHeader ? styles.headerClear : ''} {...HeaderPage} />
				<Navigation active='Categories' />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		category: state.category,
		brands: state.brands
	};
};

export default withCookies(connect(mapStateToProps)(Detail));