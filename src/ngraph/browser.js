import 'tiny-fps';

import MyWorker from 'd3-force/worker.js';
const worker = new MyWorker();
worker.postMessage({bake: 'ngraph'});
worker.addEventListener('message', e => {
    console.log('browser heard worker', e);
});