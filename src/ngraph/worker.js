import * as _ from 'lodash';
const o = {foo: 'foo'};
self.postMessage({
    bake: 'ngraph',
    foo: _.has(o, 'foo'),
});
self.addEventListener('message', e => {
    console.log('worker heard browser', e);
});