import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import ForceWorker from 'src/ngraph/worker.js';

class Line extends PIXI.Graphics {
    constructor(id, stage) {
        super();
        this.id = id;
        this.interactive = true;
        this.buttonMode = true;
        stage.addChild(this);
    }
    setPosition(x1, y1, x2, y2) {
        this.clear();
        this.lineStyle(1, 0xFFFFFF, 0.8);
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
        // note, we need to define hitArea rectangle
        // https://github.com/pixijs/pixi.js/issues/821
    }
}

class Point extends PIXI.Graphics {
    constructor(id, stage) {
        super();
        this.id = id;
        this.interactive = true;
        this.buttonMode = true;
        this.beenDrawn = false;
        this.on('pointerdown', () => alert(`Node ${this.id} clicked`));
        stage.addChild(this);
    }
    setPosition(x, y) {
        if (!this.beenDrawn) {
            this.beenDrawn = true;
            this.lineStyle(0);
            this.beginFill(0x000000, 0.8);
            this.drawCircle(0, 0, 2);
            this.endFill();
        }
        this.x = x;
        this.y = y;
    }
}

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
    id: i,
    x: Math.random() * width - halfWidth,
    y: Math.random() * height - halfHeight,
}));
const links = _.times(count - 1, (i) => ({
    fromId: Math.floor(Math.sqrt(i)),
    toId: i + 1,
}));

const pixi = new PIXI.Application(width, height, {antialias: true});
pixi.renderer.backgroundColor = 0x1b86ff;
pixi.view.style.display = 'block';
document.body.appendChild(pixi.view);
document.body.style.margin = 0;
document.body.style.padding = 0;

const lines = _.map(links, (link, i) => new Line(i, pixi.stage));
const points = _.map(nodes, (node, i) => new Point(i, pixi.stage));

const draw = (nodes, links) => {
    for (let i = 0, l = nodes.length; i < l; i++) {
        const node = nodes[i];
        const point = points[i];
        point.setPosition(
            scale * node.x + halfWidth,
            scale * node.y + halfHeight
        );
    }
    for (let i = 0, l = links.length; i < l; i++) {
        const link = links[i];
        const line = lines[i];
        line.setPosition(
            scale * link.from.x + halfWidth,
            scale * link.from.y + halfHeight,
            scale * link.to.x + halfWidth,
            scale * link.to.y + halfHeight
        );
    }
};

const statText = new PIXI.Text('', {
    fontSize: 12,
});
{
    statText.x = 20;
    statText.y = 15;
    const statRect = new PIXI.Graphics();
    statRect.beginFill(0xFFFFFF);
    statRect.drawRect(10, 10, 90, 40);
    pixi.stage.addChild(statRect);
    pixi.stage.addChild(statText);
}

const worker = new ForceWorker();

worker.addEventListener('message', (e) => {
    switch (e.data.type) {
        case 'step': {
            window.requestAnimationFrame(() => {
                draw(e.data.nodes, e.data.links);
                statText.text = (
                    `steps = ${e.data.step}\n` +
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
});