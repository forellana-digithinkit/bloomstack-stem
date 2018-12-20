import Component, { Container, safe } from '@bloomstack/panda';
import Resources from './resources';
import JQuery from './thirdparty/jquery';

let $ = null;

/**
 * Base page class for bloomstack applications
 */
export default class HTML extends Component {

    props = {};
    selector = null;
    template = () => { return ""; }

    async onInit() {
        this.selector = (this.baseComponent || this).selector;
        this.template = (this.baseComponent || this).template;
    }

    async onJqueryLoaded(jQuery) {
        $ = jQuery;
    }

    async onUpdate() {
        await this.broadcast('onPrepareRender', this, (this.baseComponent || this).props);
        if ( this.template ) {
            this.html = this.template((this.baseComponent || this).props);
        }
    }

    async onAfterUpdate() {
        if ( !$ ) {
            return;
        }

        let selector = safe(this.selector);
        
        if ( selector ) {
            this.$el = $(selector);

            await this.send('onBeforeRender', this);
            this.$el.empty();
            await this.send('onRender', this);
            this.$el.append(this.html);
            await this.send('onAfterRender', this);
        }
    }
}

