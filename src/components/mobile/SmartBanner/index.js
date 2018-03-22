import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import style from './smartbanner.scss';


const isMobile = () => {
	const UA = navigator.userAgent;
	if (UA.match(/Android/i) || UA.match(/webOS/i)
		|| UA.match(/iPhone|iPod/i) || UA.match(/iPad/)
		// || UA.match(/BlackBerry/i) || UA.match(/Windows Phone/i) // disabled for another ios & android
	) {
		return true;
	}
	return false;
};

class SmartB extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			button: 'BUKA',
			link: '',
			price: 'FREE',
			atStore: 'In Google Play',
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

	componentWillMount() {
		const { googlePlay, appStore } = this.props;
		const UA = navigator.userAgent;
		const isAndroid = UA.match(/Android/i) || UA.match(/webOS/i);
		const isIOS = UA.match(/iPhone|iPod/i) || UA.match(/iPad/);
		const link = isAndroid ? `http://play.google.com/store/apps/details?id=${googlePlay}` : (isIOS ? `https://itunes.apple.com/us/app/id${appStore}` : '');
		const atStore = isAndroid ? 'In Google Play' : (isIOS ? 'On the App Store' : '');

		this.setState({
			link,
			atStore
		});
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll, true);
		this.docBody = document.body;
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll, true);
	}

	onCloseBanner = () => {
		this.props.onCloseBanner();
	};

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
		const { title, iconSrc, author, isShow } = this.props;
		const { scroll } = this.state;

		if ((scroll.top < scroll.docHeight && scroll.top > 80) || (scroll.top === scroll.docHeight && scroll.top > 80)) {
			return null;
		}

		// prevent mobile user
		if (!isMobile() || !isShow) {
			return null;
		}

		const style1 = {
			position: 'static',
			top: '0px'
		};
		const logo = require(`@/assets/images/${iconSrc}`);
		const style2 = {
			backgroundImage: `url(${logo})`
		};
		return (
			<div id={style.smartbanner} className={style.android} style={style1} >
				<div className={style['sb-container']}>
					<a href={this.state.link} className={style['sb-button']}>
						<span>{this.state.button}</span>
					</a>
					<button className={style['sb-close']} onClick={() => this.onCloseBanner()}>×</button>
					<span className={style['sb-icon']} style={style2} />
					<div className={style['sb-info']}>
						<strong>{title}</strong>
						<span>{author}</span>
						<span>{this.state.price} - {this.state.atStore}</span>
					</div>
				</div>
			</div>
		);
	}
};

export default SmartB;
