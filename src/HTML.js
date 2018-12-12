import Component, { Container, safe } from '@bloomstack/panda';
import $ from 'jquery';

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

    async onUpdate() {
        if ( this.template ) {
            this.html = this.template((this.baseComponent || this).props);
        }
    }

    async onAfterUpdate() {
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

