import amiap from 'amiap';
import lodash from 'lodash';

function getLines(text) {
    return text.split('\n').map(s => s.trim())
}
function getLongestLine(lines) {
    lines.sort((a, b) => b.length - a.length)
    return lines[0]
}

const ns = amiap.amiap();
const text = lodash.VERSION();

function setNode(graph, label, id, opts) {
    const metrics = getTextMetrics(label)
    metrics.width += opts.margin * 2
    metrics.height += opts.margin * 2
    metrics.url = opts.urls[id]
    graph.setNode(id, { label, ...metrics })
}
function setCluster(graph, cluster, id, opts) {
    const metrics = getTextMetrics(cluster.opts.label)
    graph.setNode(id, { ...cluster.opts, isCluster: true, ...metrics })
    Object.keys(cluster.nodes).forEach(node => setNode(graph, cluster.nodes[node], node, opts))
    Object.keys(cluster.nodes).forEach(node => graph.setParent(node, id))
}

function renderLayout(layout, svg, opts) {
    layout.nodes().forEach((node) => {
        //layout.node(node) == {"label":"Kevin Spacey","width":144,"height":100,"x":80,"y":50}
        createTextRect(layout.node(node), svg, opts)
    })
    layout.edges().forEach((edge) => {
        //layout.edge(edge) {"points":[{"x":80,"y":100},{"x":80,"y":125},{"x":80,"y":150}]}
        const edgeInfo = layout.edge(edge)
        if (edgeInfo.label) {
            createEdgeLabel(layout.edge(edgeInfo.from, edgeInfo.to), edgeInfo.label, svg)
        }
        createEdge(layout.edge(edge), svg, opts)
    })
}

export function ope(node, svg, opts) {
    function getRectAttrs() {
        if (node.isCluster) {
            return `fill="transparent" stroke=${opts.edgeColor}`
        }
        else {
            return `fill=${opts.nodeColor}
        ${opts.nodeBorder ? `stroke=${opts.nodeBorder}` : ''}`
        }
    }
}