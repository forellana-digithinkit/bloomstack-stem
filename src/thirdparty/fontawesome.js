import Component from '@bloomstack/panda';
import Resources from '../resources';

export default class FontAwesome extends Component {
    static requiredComponents = [
        Resources
    ]

    async onInit() {
        let base = this;
        Resources.of(this).require([
            {
                name: 'fontawesome',
                type: 'stylesheet',
                url: 'https://use.fontawesome.com/releases/v5.6.1/css/all.css',
                integrity: 'sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP',
                crossorigin: 'anonymous',
                async: true,
                after: 'bootstrap',
                before: 'jquery'
            }
        ]);
    }
}