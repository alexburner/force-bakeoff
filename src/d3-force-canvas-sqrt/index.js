import * as _ from 'lodash';
import ForceWorker from 'src/workers/d3-force.worker.js';

const scale = 1/3;
const width = window.innerWidth;
const height = window.innerHeight;
const halfWidth = width / 2;
const halfHeight = height / 2;
const hash = window.location.hash.length
    ? Number(window.location.hash.slice(1))
    : NaN
;
const count = isNaN(hash) ? 2000 : hash;
const nodes = _.times(count, (i) => ({
    index: i,
    x: Math.random() * width - halfWidth,
    y: Math.random() * height - halfHeight,
}));
const links = _.times(count - 1, (i) => ({
    source: Math.floor(Math.sqrt(i)),
    target: i + 1,
}));

const canvasEl = document.createElement('canvas');
const context = canvasEl.getContext('2d');
canvasEl.width = width;
canvasEl.height = height;
canvasEl.style.display = 'block';
document.body.appendChild(canvasEl);
document.body.style.margin = 0;
document.body.style.padding = 0;

const statsEl = document.createElement('div');
statsEl.style.backgroundColor = 'white';
statsEl.style.whiteSpace = 'pre-wrap';
statsEl.style.fontFamily = 'sans-serif';
statsEl.style.fontSize = '12px';
statsEl.style.padding = '5px 10px';
statsEl.style.position = 'fixed';
statsEl.style.top = '10px';
statsEl.style.left = '10px';
statsEl.style.width = 'auto';
statsEl.style.height = 'auto';
document.body.appendChild(statsEl);

const drawPoint = (x, y) => {
    context.moveTo(x + 4, y);
    context.arc(x, y, 2, 0, 2 * Math.PI);
};

const drawLine = (x1, y1, x2, y2) => {
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
};

const draw = (nodes, links) => {
    context.fillStyle = '#1b86ff';
    context.fillRect(0, 0, width, height);
    context.beginPath();
    for (let i = 0, l = links.length; i < l; i++) {
        const link = links[i];
        drawLine(
            scale * link.source.x + halfWidth,
            scale * link.source.y + halfHeight,
            scale * link.target.x + halfWidth,
            scale * link.target.y + halfHeight
        );
    }
    context.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    context.stroke();
    context.beginPath();
    for (let i = 0, l = nodes.length; i < l; i++) {
        const node = nodes[i];
        drawPoint(
            scale * node.x + halfWidth,
            scale * node.y + halfHeight
        );
    }
    context.fillStyle = 'rgba(0, 0, 0, 0.9)';
    context.fill();
};

const worker = new ForceWorker();

worker.addEventListener('message', (e) => {
    switch (e.data.type) {
        case 'tick': {
            window.requestAnimationFrame(() => {
                draw(e.data.nodes, e.data.links);
                statsEl.textContent = (
                    `ticks = ${e.data.tick}\n` +
                    `time = ${(e.data.time / 1000).toFixed(2)}s`
                );
            });
            break;
        }
    }
});

worker.postMessage({
    type: 'init',
    nodes: nodes,
    links: links,
    limit: 500,
});