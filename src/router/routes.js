
import loadable from 'loadable-components';

const Page = loadable(() => import('@/containers/Page'));
// import Page from '@/containers/Page';
const Home = loadable(() => import('@/containers/Discovery'));
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