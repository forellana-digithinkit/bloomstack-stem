import Component from '@bloomstack/panda';
//import $ from 'jquery';
import HTML from './HTML';

export default class HTMLRouter extends Component {
    static requiredComponents = [
        HTML
    ];

    setRoute(route) {
        this.route = route;
        this.send("onRouteChange", this, route);
    }

    async onJqueryLoaded(jQuery) {
        $ = jQuery;
    }

    async onBeforeRender(web) {
        web.$el
            .find('[route]')
            .off('click');
    }

    async onAfterRender(web) {
        web.$el
            .find('[route]')
            .click((e) => {
                let route = $(e.currentTarget).attr('route');
                this.setRoute(route);
            });
    }
}