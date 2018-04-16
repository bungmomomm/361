import React, { PureComponent } from 'react';
import handler from '@/containers/Mobile/Shared/handler';
import { actions } from '@/state/v4/Scroller';
import _ from 'lodash';

const Scroller = (WrappedComponent) => {

	@handler
	class InfiniteScroller extends PureComponent {
		constructor(props) {
			super(props);
			this.props = props;
			this.allowNext = false;

			this.touchDown = _.throttle(this.touchDown).bind(this);
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
			this.props.dispatch(actions.onScroll({
				loading: false,
				nextPage: false,
				nextData: {},
				loader: false
			}));
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

	return InfiniteScroller;
};

export default Scroller;
