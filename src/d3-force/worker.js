import * as _ from 'lodash';
const o = {foo: 'foo'};
self.postMessage({
    bake: 'd3-force',
    foo: _.has(o, 'foo'),
});
self.addEventListener('message', e => {
    console.log('worker heard browser', e);
});