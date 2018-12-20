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

        allResources = resources;
        this.resource = resource;
        this.await = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    get name() {
        return this.resource.name;
    }

    get before() {
        return this.resource.before;
    }

    get after() {
        return this.resource.after;
    }
}

let allResources = {};
let loadQueue = [];

export default class Resources extends Component {

    started = true;
    resourcePromise = null;

    get(resourceName) {
        return Reflect.get(allResources, resourceName);
    }

    require(request) {
        let requestList = [];

        if ( request.constructor === Array ) {
            requestList = request;
        } else {
            requestList.push(request);
        }

        let requestEvents = requestList.reduce((cur, r) => {
            if ( loadQueue.findIndex((q) => q.name === r.name) === -1 ) {
                cur.push(new ResourceRequestEvent(this, r));
            }
            return cur;
        }, []);
        loadQueue = loadQueue.concat(requestEvents);

    }

    async onStart() {
        loadQueue.sort((a, b) => {
            if( asArray(a.before).indexOf(b.name) > -1 ) {
                return -1
            }

            if ( asArray(a.after).indexOf(b.name) > -1 ) {
                return 1;
            }
            
            return 0;
        });

        return this.resourceWait = Promise
            .all(loadQueue.map(async (e) => {
                let result = this._onLoadResource(e);
                Reflect.set(allResources, e.name, e.resource);
                return result;
            }))
            .then(() => {
                return this.broadcast("onAllResourcesLoaded", this);
            })
            
    }

    async onLateStart() {
        return this.resourceWait
            .then(() => {
                return this.broadcast("onAfterAllResourcesLoaded", this);
            });
    }

    async _onLoadResource(e) {
        if ( e.resource.type === 'stylesheet' ) {
            return this._loadCSS(e);
        } else if ( e.resource.type === 'javascript' ) {
            return this._loadJS(e);
        }

        return Promise.reject();
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
            allResources[resource.name] = resource;
            if ( resource.type === 'stylesheet' && 'async' in resource && resource.async ) {
                el.setAttribute('media', 'screen');
            }

            if ( 'onLoad' in resource ) {
                resource.onLoad.bind(resource)(el);
            }

            event.resolve();
            base.send('onResourceLoaded', resource, el);
        }

        document.getElementsByTagName('head')[0].appendChild(el);
    }

    async _loadCSS(e) {
        let el = document.createElement('link');
        el.setAttribute('rel', 'stylesheet');
        el.setAttribute('type', 'text/css');
        el.setAttribute('href', e.resource.url);
        if ( 'async' in e.resource && e.resource.async ) {
            el.setAttribute('media', 'async-media');
        }

        this._resourceDomCommon(el, e.resource, e);

        return e.await;
    }

    async _loadJS(e) {
        let el = document.createElement('script');
        el.setAttribute('type', 'text/javascript');
        el.setAttribute('src', e.resource.url);
        this._resourceDomCommon(el, e.resource, e);

        return e.await;
    }
}