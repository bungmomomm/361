
import loadable from 'loadable-components';
import { isMobile } from '@/utils';

// const Page = loadable(() => import('@/containers/Page'));

/**
 * cannot using like this 
 * const type = isMobile() ? 'Mobile' : 'Desktop';
 * const Home = loadable(() => import(`@/containers/${type}/Home`));
 * since genereated js file will mix dekstop & mobile
 */

const Home = isMobile ? loadable(() => import('@/containers/Mobile/Home')) 
	: loadable(() => import('@/containers/Desktop/Home'));

export default [

	{
		path: '/',
		component: Home,
		exact: true
	}

];