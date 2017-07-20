import Home from '@/containers/Home';
import About from '@/containers/About';
import Checkout from '@/containers/Checkout';
import NotFound from '@/containers/NotFound';

export default [

	{
		path: '/',
		component: Home,
		exact: true,
		loadData: Home.fetchImages
	},
	{
		path: '/about',
		component: About
	},
	{
		path: '/checkout',
		component: Checkout
	},
	{
		component: NotFound
	}

];