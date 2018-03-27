import React, { PureComponent } from 'react';

const Scroller = (WrappedComponent) => {
	return class InfiniteScroller extends PureComponent {
		constructor(props) {
			super(props);
			this.props = props;
			this.allowNext = false;

			this.touchDown = this.touchDown.bind(this);
			this.startInfScroll = (3 / 4); // start get new data once reach this page percentage
		}

		componentDidMount() {
			window.addEventListener('scroll', this.touchDown, true);
		}

		componentWillReceiveProps(nextProps) {
			this.scroller = nextProps.scroller;
			this.allowNext = (
				this.scroller
				&& typeof this.scroller.loader === 'function'
				&& this.scroller.nextPage
				&& this.scroller.nextData
				&& !this.scroller.loading
			);
		}

		componentWillUnmount() {
			window.removeEventListener('scroll', this.touchDown, true);
		}

		touchDown(e) {
			const body = document.body;
			const html = document.documentElement;

			const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
			const scrollY = window.scrollY;
			const scrHeight = window.screen.height;
			if ((scrollY + scrHeight) >= (this.startInfScroll * docHeight) && this.allowNext) {
				this.props.dispatch(this.scroller.loader(this.scroller.nextData));
			}
		};

		render() {
			return <WrappedComponent {...this.props} />;
		};
	};
};

export default Scroller;
