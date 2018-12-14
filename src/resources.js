import Component from '@bloomstack/panda';
import { Event } from '@bloomstack/panda/es/utils';

function asArray(a) {
    if ( a === undefined ) {
        return [];
    }

    if ( a.constructor === Array ) {
        return a;
    }

    return [a];
}

export class ResourceRequestEvent extends Event {
    constructor(resources, resource) {
        super(true);

        this.resources = resources;
        this.resource = resource;
        this.await = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

export default class Resources extends Component {

    resources = [];
    loadQueue = [];
    started = true;
    resourcePromise = null;

    get(resourceName) {
        let found = Reflect.get(this.resources, resourceName);
        console.dir(this.resources);
        console.log(resourceName, found);
        return found;
    }

    async require(request) {
        let requestList = [];

        if ( request.constructor === Array ) {
            requestList = request;
        } else {
            requestList.push(request);
        }

        this.loadQueue = this.loadQueue.concat(requestList);
        if ( this.resourcePromise === null ) {
            this.resourcePromise = Promise.resolve();
        }

        return this.resourcePromise.then(() => {
            return new Promise((resolve, reject) => {
                this.resolvePromise = resolve;
                this.rejectPromise = reject;
            })
        });
    }

    async onLateStart() {
        this.loadQueue.sort((a, b) => {
            if( b.name in asArray(a.before) ) {
                return -1
            }

            if ( b.name in asArray(a.after) ) {
                return 1;
            }

            return 0;
        });

        Promise.all(this.loadQueue.map(async (resource) => {
            console.log(resource);
            let e = new ResourceRequestEvent(this, resource);
            await this._onLoadResource(e);
            return e.await;
        }))
        .then(() => this.resolvePromise())
        .catch((err) => this.rejectPromise(err));

    }

    async _onLoadResource(e) {
        console.log(e);
        if ( e.resource.type === 'stylesheet' ) {
            e.await.then((e) => this._loadCSS(e));
        } else if ( e.resource.type === 'javascript' ) {
            e.await.then((e) => this._loadJS(e));
        }
    }

    _resourceDomCommon(el, resource, event) {
        el.setAttribute('data-resource', resource.name);
        if ( 'crossorigin' in resource ) {
            el.setAttribute('crossorigin', resource.crossorigin );
        }
        if ( 'integrity' in resource ) {
            el.setAttribute('integrity', resource.integrity);
        }

        let base = this;
        el.onload = function() {
            base.resources[resource.name] = resource;

            if ( 'onload' in resource ) {
                resource.onload.bind(resource)();
            }

            event.resolve();
            base.send('onResourceLoaded', resource);
        }

        document.getElementsByTagName('head')[0].appendChild(el);
    }

    async _loadCSS(e) {
        let el = document.createElement('link');
        el.setAttribute('rel', 'stylesheet');
        el.setAttribute('type', 'text/css');
        el.setAttribute('href', e.resource.url);
        this._resourceDomCommon(el, e.resource);

        return e;
    }

    async _loadJS(e) {
        let el = document.createElement('script');
        el.setAttribute('type', 'text/javascript');
        el.setAttribute('src', e.resource.url);
        this._resourceDomCommon(el, e.resource);

        return e;
    }
}