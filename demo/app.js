import WebApp from '../src/index';
import { ChildToggle } from '@bloomstack/panda/es/utils';
//import $ from 'jquery';

import './style.scss';
import appTpl from './templates/app.handlebars';

import { Home, Page1, Page2 } from './pages';

let $ = null;

export default class DemoApp extends WebApp {

    requiredComponents = [
        ChildToggle
    ]

    template = appTpl

    async onInit() {
        await super.onInit();

        this.addChild([Home, Page1, Page2], {
            enabled: false,
            selector: () => $(this.selector).find('.content:first')
        });
    }

    async onResourceLoaded(resource) {
        if ( resource.name === 'jquery' ) {
            $ = resource.$;
        }
    }

    async onAppStart() {
        this.togglePage('home');
    }

    async togglePage(pageName) {
        console.log(this._components);
        const toggler = ChildToggle.of(this);
        if ( toggler ) {
            console.log(toggler);
            await toggler.toggle(pageName);
        }
    }

}