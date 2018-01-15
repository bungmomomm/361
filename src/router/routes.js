
import loadable from 'loadable-components';
import { isMobile } from '@/utils';

const Page = loadable(() => import('@/containers/Page'));
const Home = isMobile() ? 
			loadable(() => import('@/containers/Discovery/Home/Mobile')) 
			: loadable(() => import('@/containers/Discovery/Home/Desktop'));
// const Test = loadable(() => import('@/containers/Discovery/Desktop'));

export default [

	{
		path: '/',
		component: Page,
		exact: true
	},
	{
		path: '/home',
		component: Home,
	}
	
];