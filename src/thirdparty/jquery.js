import Component from '@bloomstack/panda';
import Resources from '../resources';

export default class JQuery extends Component {
    static requiredComponents = [
        Resources
    ]

    async onInit() {
        let base = this;
        let original$ = window.$;
        Resources.of(this).require([
            {
                name: 'jquery',
                type: 'javascript',
                url: 'https://code.jquery.com/jquery-3.1.0.js',
                integrity: 'sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk=',
                crossorigin: 'anonymous',
                onLoad: function(el) {
                    this.$ = (function() {
                        return window.$.noConflict(true);
                    }).bind(window)();
                    // force outof sequence restore of any original jquery version
                    // adding a 0ms timeout lets the restore happen on the next js
                    // runtime cycle outside of this onload callback.
                    setTimeout(() => {
                        window.jQuery = window.$ = original$;
                    }, 0);
                    base.broadcast("onJqueryLoaded", this.$);
                }
            }
        ]);
    }

    get $() {
        return Resources.of(this).get('jquery').$;
    }
}