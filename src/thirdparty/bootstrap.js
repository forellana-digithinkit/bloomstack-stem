import Component from '@bloomstack/panda';
import Resources from '../resources';

export default class Bootstrap extends Component {
    static requiredComponents = [
        Resources
    ]

    async onInit() {
        let base = this;
        Resources.of(this).require([
            {
                name: 'bootstrap',
                type: 'stylesheet',
                url: 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
                integrity: 'sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO',
                crossorigin: 'anonymous',
                async: true,
                before: 'jquery'
            }
        ]);
    }
}