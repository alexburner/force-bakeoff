import 'tiny-fps';
import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import ForceWorker from 'src/d3-force/worker.js';

class Line extends PIXI.Graphics {
    constructor() {
        super();
        this.interactive = true;
        this.buttonMode = true;
    }
    setPosition(x1, y1, x2, y2, pointB) {
        this.clear();
        this.lineStyle(1, 0x222222);
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
    }
}

class Point extends PIXI.Graphics {
    constructor() {
        super();
        this.interactive = true;
        this.buttonMode = true;
        this.beenDrawn = false;
    }
    setPosition(x, y) {
        if (!this.beenDrawn) {
            this.beenDrawn = true;
            this.lineStyle(0);
            this.beginFill(0x222222);
            this.drawCircle(0, 0, 10);
            this.endFill();
        }
        this.x = x;
        this.y = y;
    }
}

const width = window.innerWidth;
const height = window.innerHeight;
const hash = window.location.hash.length ?
    Number(window.location.hash.slice(1)) :
    NaN
;
const count = isNaN(hash) ? 2000 : hash;
const nodes = _.times(count, (i) => ({
    index: i,
    x: Math.random() * width,
    y: Math.random() * height,
}));
const links = _.times(count - 1, (i) => ({
    source: Math.floor(Math.sqrt(i)),
    target: i + 1,
}));

const points = _.map(nodeData, (node) => new Point(node.id));
const lines = _.map(linkData, (link) => new Line(link.id));

const pixi = new PIXI.Application(width, height);
pixi.renderer.backgroundColor = 0xFFFFFF;
document.body.appendChild(pixi.view);

const draw = (nodes, links) => {
    for (let i = 0, l = nodes.length; i < l; i++) {
        const node = nodes[i];
        const point = points[i];
        point.setPosition(node.x, node.y);
    }
    for (let i = 0, l = links.length; i < l; i++) {
        const link = links[i];
        const line = lines[i];
        const node1 = nodes[link.source];
        const node2 = nodes[link.target];
        line.setPosition(node1.x, node1.y, node2.x, node2.y);
    }
};

const worker = new ForceWorker();

worker.addEventListener('message', (e) => {
    switch (e.data.type) {
        case 'init': {
            worker.postMessage({type: 'tick'});
            break;
        }
        case 'tick': {
            window.requestAnimationFrame(() => {
                worker.postMessage({type: 'tick'});
                draw(e.data.nodes, e.data.links);
            });
            break;
        }
    }
});

worker.postMessage({
    type: 'init',
    nodes: nodes,
    links: links,
});