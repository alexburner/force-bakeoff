import createGraph from 'ngraph.graph';
import createLayout from 'ngraph.forcelayout';

let graph;
let layout;
const nodeIds = [];
const linkIds = [];

const init = (args) => {
    graph = createGraph();
    for (let i = 0, l = args.nodes.length; i < l; i++) {
        const argNode = args.nodes[i];
        const node = graph.addNode(argNode.id);
        node.position = {x: argNode.x, y: argNode.y};
        nodeIds.push(node.id);
    }
    for (let i = 0, l = args.links.length; i < l; i++) {
        const argLink = args.links[i];
        const link = graph.addLink(argLink.fromId, argLink.toId);
        linkIds.push(link.id);
    }
    layout = createLayout(graph, {
        springLength: 30,
        springCoeff: 0.0008,
        gravity: -1.2,
        theta: 0.8,
        dragCoeff: 0.02,
        timeStep: 20
    });
};

const getNodes = () => {
    const nodes = [];
    for (let i = 0; i < nodeIds.length; i++) {
        nodes.push(layout.getNodePosition(nodeIds[i]));
    }
    return nodes;
};

const getLinks = () => {
    const links = [];
    for (let i = 0; i < linkIds.length; i++) {
        links.push(layout.getLinkPosition(linkIds[i]));
    }
    return links;
};

self.addEventListener('message', (e) => {
    switch (e.data.type) {
        case 'init': {
            // initialize simulation
            init({
                nodes: e.data.nodes,
                links: e.data.links,
            });
            // run simulation
            const batch = 10;
            const limit = e.data.nodes.length;
            const start = Date.now();
            for (let i = 0; i <= limit; i++) {
                layout.step();
                if (i % batch === 0) {
                    const delta = Date.now() - start;
                    const nodes = getNodes();
                    const links = getLinks();
                    self.postMessage({
                        type: 'tick',
                        nodes: nodes,
                        links: links,
                        tick: i,
                        time: delta,
                    });
                }
            }
            break;
        }
    }
});