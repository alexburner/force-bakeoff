import 'tiny-fps';

import * as MyWorker from 'd3-force/worker.js';
const worker = new MyWorker();
worker.postMessage({bake: 'ngraph'});
worker.addEventListener('message', e => {
    console.log('browser heard worker message', e);
});