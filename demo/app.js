import WebApp from '../src/index';
import Resources from '../src/resources';
import { ChildToggle } from '@bloomstack/panda/es/utils';

import './style.scss';
import appTpl from './templates/app.handlebars';

import { Home, Page1, Page2 } from './pages';
import FontAwesome from '../src/thirdparty/fontawesome';

let $ = null;

export default class DemoApp extends WebApp {

    requiredComponents = [
        ChildToggle,
        FontAwesome
    ]

    template = appTpl

    async onInit() {
        await super.onInit();

        this.addChild([Home, Page1, Page2], {
            enabled: false,
            selector: () => this.$(this.selector).find('.content:first')
        });
    }

    async onJqueryLoaded(jQuery) {
        $ = jQuery;
    }

    async onAppStart() {
        const toggler = ChildToggle.of(this);
        await toggler.toggle('home');
    }

    async onRouteChange(router, route) {
        const toggler = ChildToggle.of(this);
        await toggler.toggle(route);
    }
}