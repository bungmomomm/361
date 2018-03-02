import React, { PureComponent } from 'react';

const Scroller = (WrappedComponent) => {
	return class InfiniteScroller extends PureComponent {
		constructor(props) {
			super(props);
			this.props = props;
			this.allowNext = false;
			this.scroller = false;

			this.touchDown = this.touchDown.bind(this);
		}

		componentDidMount() {
			window.addEventListener('scroll', this.touchDown, true);
		}

		componentWillReceiveProps(nextProps) {
			if (this.props.scroller !== nextProps.scroller) {
				this.scroller = nextProps.scroller;
				this.allowNext = (
					this.scroller
					&& typeof this.scroller.loader === 'function'
					&& this.scroller.nextPage
					&& this.scroller.nextData
					&& !this.scroller.loading
				);
			}
		}

		componentWillUnmount() {
			window.removeEventListener('scroll', this.touchDown, true);
		}

		touchDown(e) {
			const body = document.body;
			const html = document.documentElement;

			const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
			const scrollY = e.srcElement.scrollTop;
			const scrHeight = window.screen.height;
			if ((scrollY + scrHeight) >= docHeight && this.scroller && this.allowNext) {
				this.props.dispatch(this.scroller.loader(this.scroller.nextData));
			}
		};

		render() {
			return <WrappedComponent {...this.props} />;
		};
	};
};

export default Scroller;
