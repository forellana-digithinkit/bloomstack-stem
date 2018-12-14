import Component from '@bloomstack/panda';
import Resources from './resources';

export default class JQuery extends Component {
    static requiredComponents = [
        Resources
    ]

    async onInit() {
        Resources.of(this).require({
            {
                name: 'jquery',
                type: 'javascript',
                url: 'https://code.jquery.com/jquery-3.1.0.js',
                integrity: 'sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk=',
                crossorigin: 'anonymous',
                onLoad: function() {
                    this.$ = window.$.noConflict(true);
                }
            }
        })
    }

    get $() {
        return Resources.of(this).get('jquery').$;
    }
}