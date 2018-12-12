import Component from '@bloomstack/panda';
import HTML from './HTML';
import HTMLRouter from './HTMLRouter';
import $ from 'jquery';

export { HTML, HTMLRouter, WebApp };

/**
 * Bloomstack apps base application class
 */
export default class WebApp extends Component {
    static requiredComponents = [
        HTML,
        HTMLRouter
    ]

    constructor(selector) {
        super();
        this.selector = selector;
    }

    async onInit() {
        $(this.selector).addClass("bloomstack-app");
    }

    async onLateStart() {
        this.send("onAppStart");
    }

    async onRouteChange(router, route) {
        this.togglePage(route);
    }
}


