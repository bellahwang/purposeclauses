var margin = {top: 10, right: 15, bottom: 20, left: 30},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var data = {
    "wID": "0",
    "id": "ROOT",
    "children": [
        {
            "wID": "10",
            "form": ".",
            "lemma": ".",
            "postag": "u--------",
            "head": "0",
            "relation": "AuxK",
            "cite": "urn:cts:greekLit:tlg0012.tlg001:1.32",
            "id": "._10"
        },
        {
            "wID": "11",
            "form": "[0]",
            "head": "0",
            "relation": "COORD",
            "id": "[0]_11",
            "children": [
                {
                    "wID": "2",
                    "form": "ἴθι",
                    "lemma": "εἶμι",
                    "postag": "v2spma---",
                    "head": "11",
                    "relation": "PRED_CO",
                    "cite": "urn:cts:greekLit:tlg0012.tlg001:1.32",
                    "id": "ἴθι_2",
                    "children": [
                        {
                            "wID": "1",
                            "form": "ἀλλ'",
                            "lemma": "ἀλλά",
                            "postag": "d--------",
                            "head": "2",
                            "relation": "AuxY",
                            "cite": "urn:cts:greekLit:tlg0012.tlg001:1.32",
                            "id": "ἀλλ'_1"
                        }
                    ]
                },
                {
                    "wID": "5",
                    "form": "ἐρέθιζε",
                    "lemma": "ἐρεθίζω",
                    "postag": "v2spma---",
                    "head": "11",
                    "relation": "PRED_CO",
                    "cite": "urn:cts:greekLit:tlg0012.tlg001:1.32",
                    "id": "ἐρέθιζε_5",
                    "children": [
                        {
                            "wID": "3",
                            "form": "μή",
                            "lemma": "μή",
                            "postag": "d--------",
                            "head": "5",
                            "relation": "AuxZ",
                            "cite": "urn:cts:greekLit:tlg0012.tlg001:1.32",
                            "id": "μή_3"
                        },
                        {
                            "wID": "4",
                            "form": "μ'",
                            "lemma": "ἐγώ",
                            "postag": "p-s---ma-",
                            "head": "5",
                            "relation": "OBJ",
                            "cite": "urn:cts:greekLit:tlg0012.tlg001:1.32",
                            "id": "μ'_4"
                        }
                    ]
                },
                {
                    "wID": "7",
                    "form": "ὥς",
                    "lemma": "ὡς",
                    "postag": "c--------",
                    "head": "11",
                    "relation": "AuxC",
                    "cite": "urn:cts:greekLit:tlg0012.tlg001:1.32",
                    "id": "ὥς_7",
                    "children": [
                        {
                            "wID": "9",
                            "form": "νέηαι",
                            "lemma": "νέομαι",
                            "postag": "v2spse---",
                            "head": "7",
                            "relation": "ADV",
                            "cite": "urn:cts:greekLit:tlg0012.tlg001:1.32",
                            "id": "νέηαι_9",
                            "children": [
                                {
                                    "wID": "6",
                                    "form": "σαώτερος",
                                    "lemma": "σῶς",
                                    "postag": "a-s---mnc",
                                    "head": "9",
                                    "relation": "AtvV",
                                    "cite": "urn:cts:greekLit:tlg0012.tlg001:1.32",
                                    "id": "σαώτερος_6"
                                },
                                {
                                    "wID": "8",
                                    "form": "κε",
                                    "lemma": "ἄν",
                                    "postag": "g--------",
                                    "head": "9",
                                    "relation": "AuxZ",
                                    "cite": "urn:cts:greekLit:tlg0012.tlg001:1.32",
                                    "id": "κε_8"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

var diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

var root = d3.hierarchy(data);
    root.dx = 30;
    root.dy = width / (root.height + 1);

root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth && d.data.form.length !== 7)
        d.children = null;
});
  
var svg = d3.select("#tidytree")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)

var gLink = svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5);

var gNode = svg.append("g")
    .attr("cursor", "pointer")
    .attr("pointer-events", "all");

var tooltip = d3.select("body").append("div")	
    .style("opacity", 0)
    .attr("class", "tooltip")

var mouseover = function(event, d) {
    tooltip.transition()
        .duration(200)
        .style("opacity", .9)

    tooltip.html("form: " + d.data.form + "\n" + 
        "lemma: " + d.data.lemma + "\n" + 
        "postag: " + d.data.postag + "\n" +
        "cite: " + d.data.cite)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px")
}

var mouseleave = function(d) {
    tooltip.transition()
        .duration(500)
        .style("opacity", 0)
}

function update(source) {
    var duration = d3.event && d3.event.altKey ? 2500 : 250;
    var nodes = root.descendants().reverse();
    var links = root.links();

    // Compute the new tree layout.
    var tree = d3.tree().nodeSize([root.dx, root.dy])(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
    });

    var height = right.x - left.x + margin.top + margin.bottom;

    var transition = svg.transition()
        .duration(duration)
        .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // Update the nodes…
    var node = gNode.selectAll("g")
    .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d) => {
            d.children = d.children ? null : d._children;
            update(d);
        });

    nodeEnter.append("circle")
        .attr("r", 2.5)
        .attr("fill", d => d._children ? "#555" : "#999")
        .attr("stroke-width", 10)
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)

    nodeEnter.append("text")
        .attr("class", "nodeText")
            .attr("dy", "0.31em")
            .attr("x", d => d._children ? -6 : 6)
            .attr("text-anchor", d => d._children ? "end" : "start")
            .text(d => d.data.form)
        .clone(true).lower()
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .attr("stroke", "white");

    // Transition nodes to their new position.
    var nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    // Update the links…
    var link = gLink.selectAll("path")
    .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert("path")
        .attr("class", "newLink")
        .attr("id", function(d) { 
            return "newLink_" + d.target.data.wID;
        })
        .attr("d", d => {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
        });

    // text
    var linkText = link.enter().append("text")
        .attr("class", "newLinkText")
        .append("textPath")
        .attr("startOffset","50%")
        .attr("xlink:href", function(d) {
            return "#newLink_"+ d.target.data.wID
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("x", function(d) { return (d.source.y+d.target.y)/2; })
        .attr("y", function(d) { return (d.source.x+d.target.x)/2; })
        .attr("text-anchor", "middle")
        .text(d => d.target.data.relation)
        .clone(true).lower()
            .attr("stroke", "white")

    // Transition links to their new position.
    link.merge(linkEnter, linkText).transition(transition)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
        .attr("d", d => {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
        })
    
    link.selectAll("newLinkText").remove()
    
    // Stash the old positions for transition.
    root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

update(root);