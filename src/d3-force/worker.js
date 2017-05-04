import * as d3_force from 'd3-force';

let TICK_LIMIT = 1000;
let TICK_BATCH = 10;

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
    simulation = d3_force.forceSimulation();
    simulation.nodes(nodes);
    simulation.stop();
    charge = d3_force.forceManyBody();
    link = d3_force.forceLink(links);
    link.distance(30);
    link.strength(1);
    x = d3_force.forceX();
    y = d3_force.forceY();
    simulation.force('charge', charge);
    simulation.force('link', link);
    simulation.force('x', x);
    simulation.force('y', y);
};

self.addEventListener('message', (e) => {
    switch (e.data.type) {
        case 'init': {
            init({
                nodes: e.data.nodes,
                links: e.data.links,
            });
            for (let i = 0; i < e.data.nodes.length; i++) {
                simulation.tick();
                if (i % TICK_BATCH === 0) {
                    self.postMessage({
                        type: 'tick',
                        nodes: nodes,
                        links: links,
                    });
                }
            }
            break;
        }
    }
});