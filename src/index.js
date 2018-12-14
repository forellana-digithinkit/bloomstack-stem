import Component from '@bloomstack/panda';
import { Event } from '@bloomstack/panda/es/utils';
import Resources from './resources';
import HTML from './HTML';
import HTMLRouter from './HTMLRouter';
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
        Resources
    ]

    constructor(selector) {
        super();
        this.selector = selector;
    }

    async onInit() {
        this.resources = Resources.of(this);
        this.resourceInitWait = this.resources.require([
            {
                name: 'fontawesome',
                type: 'stylesheet',
                url: 'https://use.fontawesome.com/releases/v5.6.1/css/all.css',
                integrity: 'sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP',
                crossorigin: 'anonymous',
                after: 'jquery'
            }
        ]);

        return null;
    }

    async onStart() {
        let e = new WebAppInitEvent(this, this.resources);
        this.broadcast('onAppInit', e);
    }

    async onLateStart() {

        this.resourceInitWait
            .then(() => {
                $ = this.resources.get('jquery').$;
                $(this.selector).addClass("bloomstack-app");
                this.send("onAppStart", $);
            });
        
    }

    async onRouteChange(router, route) {
        this.togglePage(route);
    }
}


