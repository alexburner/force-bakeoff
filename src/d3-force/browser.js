import 'tiny-fps';

import * as MyWorker from 'd3-force/worker.js';
const worker = new MyWorker();
worker.postMessage({bake: 'd3-force'});
worker.addEventListener('message', e => {
    console.log('browser heard worker message', e);
});