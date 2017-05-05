import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import ForceWorker from 'src/d3-force/worker.js';

class Line extends PIXI.Graphics {
    constructor(stage) {
        super();
        stage.addChild(this);
        this.interactive = true;
        this.buttonMode = true;
    }
    setPosition(x1, y1, x2, y2) {
        this.clear();
        this.lineStyle(2, 0xFFFFFF, 0.8);
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
        // note, we need to define hitArea rectangle
        // https://github.com/pixijs/pixi.js/issues/821
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
            this.beginFill(0x000000, 0.8);
            this.drawCircle(0, 0, 6);
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

const pixi = new PIXI.Application(width, height, {antialias: true});
pixi.renderer.backgroundColor = 0x1b86ff;
document.body.appendChild(pixi.view);

const lines = _.map(links, (link) => new Line(pixi.stage));
const points = _.map(nodes, (node) => new Point(pixi.stage));

const draw = (nodes, links) => {
    for (let i = 0, l = nodes.length; i < l; i++) {
        const node = nodes[i];
        const point = points[i];
        point.setPosition(
            node.x + halfWidth,
            node.y + halfHeight
        );
    }
    for (let i = 0, l = links.length; i < l; i++) {
        const link = links[i];
        const line = lines[i];
        line.setPosition(
            link.source.x + halfWidth,
            link.source.y + halfHeight,
            link.target.x + halfWidth,
            link.target.y + halfHeight
        );
    }
};

var stats = new PIXI.Text('');
stats.x = 10;
stats.y = 10;

const worker = new ForceWorker();

worker.addEventListener('message', (e) => {
    switch (e.data.type) {
        case 'tick': {
            window.requestAnimationFrame(() => {
                draw(e.data.nodes, e.data.links);
                stats.text = (
                    `tick: ${e.data.tick}\n` +
                    `secs: ${e.data.time / 1000}`
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
});