import * as d3 from 'd3-force';

let charge;
let link;
let x;
let y;
let simulation;
let nodes;
let links;
let subject;

const init = (args) => {
    nodes = args.nodes;
    links = args.links;
    simulation = d3.forceSimulation();
    simulation.nodes(nodes);
    simulation.stop();
    charge = d3.forceManyBody();
    link = d3.forceLink(links);
    link.distance(30);
    link.strength(1);
    x = d3.forceX();
    y = d3.forceY();
    simulation.force('charge', charge);
    simulation.force('link', link);
    simulation.force('x', x);
    simulation.force('y', y);
};

self.addEventListener('message', (e) => {
    switch (e.data.type) {
        case 'init': {
            init(e.data.args);
            self.postMessage({
                type: 'init',
            });
            break;
        }
        case 'tick': {
            simulation.tick();
            self.postMessage({
                type: 'tick',
                nodes: nodes,
                links: links,
            });
            break;
        }
    }
});