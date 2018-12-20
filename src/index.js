import Component from '@bloomstack/panda';
import { Event } from '@bloomstack/panda/es/utils';
import Resources from './resources';
import HTML from './HTML';
import HTMLRouter from './HTMLRouter';

import JQuery from './thirdparty/jquery';
import Bootstrap from './thirdparty/bootstrap';
//import $ from 'jquery';

let $;

export { HTML, HTMLRouter, WebApp };

export class WebAppInitEvent extends Event {
    constructor(app, resources) {
        super(false);

        this.app = app;
        this.resources = resources;
    }
}

/**
 * Bloomstack apps base application class
 */
export default class WebApp extends Component {
    static requiredComponents = [
        HTML,
        HTMLRouter,
        Resources,
        JQuery,
        Bootstrap
    ]

    constructor(selector) {
        super();
        this.selector = selector;
        this.name = 'WebApp';
    }

    get $() {
        return JQuery.of(this).$;
    }

    async onInit() {
        this.resources = Resources.of(this);
        this.canUpdate = false;

        return null;
    }

    async onStart() {
        let e = new WebAppInitEvent(this, this.resources);
        return await this.broadcast('onAppInit', e);
    }

    async onJqueryLoaded(jQuery) {
        $ = jQuery;
    }

    async onAfterAllResourcesLoaded(resources) {
        this.canUpdate = true;
        return await this.update().then(() => this.broadcast('onAppStart'));
    }
}


