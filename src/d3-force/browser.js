import 'tiny-fps';
import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import ForceWorker from 'src/d3-force/worker.js';

class Line extends PIXI.Graphics {
    constructor(stage) {
        super();
        stage.addChild(this);
    }
    setPosition(x1, y1, x2, y2, pointB) {
        this.clear();
        this.lineStyle(2, 0x000000, 0.5);
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
        this.interactive = true;
        this.buttonMode = true;
    }
}

class Point extends PIXI.Graphics {
    constructor(stage) {
        super();
        this.interactive = true;
        this.buttonMode = true;
        this.beenDrawn = false;
        stage.addChild(this);
    }
    setPosition(x, y) {
        if (!this.beenDrawn) {
            this.beenDrawn = true;
            this.lineStyle(0);
            this.beginFill(0x000000, 0.5);
            this.drawCircle(0, 0, 10);
            this.endFill();
        }
        this.x = x;
        this.y = y;
    }
}

const width = window.innerWidth;
const height = window.innerHeight;
const halfWidth = width / 2;
const halfHeight = height / 2;
const hash = window.location.hash.length ?
    Number(window.location.hash.slice(1)) :
    NaN
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

const pixi = new PIXI.Application(width, height, {antialias: true});
pixi.renderer.backgroundColor = 0xFFFFFF;
document.body.appendChild(pixi.view);

const points = _.map(nodes, (node) => new Point(pixi.stage));
const lines = _.map(links, (link) => new Line(pixi.stage));

const draw = (nodes, links) => {
    for (let i = 0, l = nodes.length; i < l; i++) {
        const node = nodes[i];
        const point = points[i];
        point.setPosition(
            node.x + halfWidth,
            node.y + halfHeight,
        );
    }
    for (let i = 0, l = links.length; i < l; i++) {
        const link = links[i];
        const line = lines[i];
        line.setPosition(
            link.source.x + halfWidth,
            link.source.y + halfHeight,
            link.target.x + halfWidth,
            link.target.y + halfHeight,
        );
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