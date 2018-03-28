import { config, references } from './config';
import LucidCart from './cart';
import Fusion from './core';
import PageTracker from './page-tracker';
import Utils from './utils';
import Uuid from './uuid';
import { EventPayload as Payload } from './event-payload';

export default {
	Fusion,
	LucidCart,
	Payload,
	PageTracker,
	Utils,
	Uuid,
	config,
	...references
};