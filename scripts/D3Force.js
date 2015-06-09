var D3Force = (function (d3Force) {

    'use strict';


    // setup chart options
    d3Force.setup = function () {

        var control = {};
        control.data = d3Force.input;
        control.divName = "chart";

        control.options = {
            stackHeight: 12,
            radius: 8,
            fontSize: 14,
            labelFontSize: 8,
            nodeLabel: 'label',
            markerWidth: 0,
            markerHeight: 0,
            width: Utils.el(control.divName).offsetWidth,
            gap: 1.5,
            nodeResize: 1,
            charge: -120,
            projectCharge: -180,
            styleColumn: null,
            styles: null,
            linkName: 'linkName',
            nodeFocus: true,
            nodeFocusRadius: 25,
            nodeFocusColor: "black",
            labelOffset: "5",
            gravity: 0.4,
            height: Utils.el(control.divName).offsetHeight,
            colors: {
              unknown:'gray',
              dev:'#388E3C',
              prod:'#536DFE',
              project:'#FF5722'
            }
        };

        var options = control.options;
        options.gap = options.gap * options.radius;
        control.width = options.width;
        control.height = options.height;
        options.linkDistance = control.height/2.2;
        control.nodes = d3Force.input.nodes;
        control.links = d3Force.input.links;
        control.clickHack = 200;

        d3Force.organizeData(control);

        control.svg = d3.select('#'+control.divName)
            .append("svg:svg")
            .attr("width", control.width)
            .attr("height", control.height);

        // get list of unique values in stylecolumn - this is for future expansion
        control.linkStyles = [];
        control.linkStyles[0] = "defaultMarker";

        control.force = d3.layout.force()
            .size([control.width, control.height])
            .linkDistance(control.options.linkDistance)
            .charge(function(d) {
              return d.group === "project" ? control.options.projectCharge : control.options.charge;
            })
            .gravity(control.options.gravity);

        return control;

    };

    d3Force.organizeData = function (control) {

        control.nodes.forEach(function(d,i){
            d.unique = i;
            d.isCurrentlyFocused = false;
        });
        
        control.links.forEach(function(d,i){
            d.unique = i;
            d.source = control.nodes[d.source];
            d.target = control.nodes[d.target];
        });

        return control;
    };


    d3Force.massage = function (data) {

        // massage data into links and nodes
        var nodes = [],
            links = [];

        data.forEach(function (d) {

            var node = {
                name: d.title,
                label: d.title,
                linkName: d.title,
                group: 'project'
            };

            var sk = findOrAddNode(node, nodes);
            
            /*
      {
                    "sdc": "d8d42f7881bec99d",
                    "development": false,
                    "library": "cDriverSheet",
                    "known": true,
                    "identifier": "cDriverSheet",
                    "key": "Mrckbr9_w7PCphJtOzhzA_Cz3TLx7pV4j",
                    "version": "5"
                },
                */
            d.dependencies.forEach(function (e) {

                var lib = {
                    name: 'k' + Utils.checksum(e),
                    label: e.library+' v'+e.version +'('+e.key+')',
                    linkName: e.library,
                    shortName: e.library+' v'+e.version,
                    group: e.development ? 'dev' : 'prod'
                };
                var tk = findOrAddNode(lib, nodes);
                links.push({
                    source: sk,
                    target: tk,
                    depth: 1,
                    linkName: nodes[sk].name
                });
            });
        });

        function findOrAddNode(node, nodes) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].name === node.name) {
                    return i;
                }
            }
            // no match
            return nodes.push(node) - 1;
        }
        d3Force.input = {
            nodes: nodes,
            links: links
        };
    };

    d3Force.initialize = function (data) {

        d3Force.massage(data);
        d3Force.control = d3Force.setup();
        return d3Force;
    };

    d3Force.render = function () {

        var control = d3Force.control;
        var svg = control.svg;

        var force = control.force;
        force.nodes(control.nodes)
            .links(control.links)
            .start();

        // Update the links
        var link = svg.selectAll("line.link")
            .data(control.links, function (d) {
            return d.unique;
        });

        // Enter any new links
        link.enter().insert("svg:line", ".node")
            .attr("class", "link")
            .attr("x1", function (d) {
              return d.source.x;
            })
            .attr("y1", function (d) {
              return d.source.y;
            })
            .attr("x2", function (d) {
              return d.target.x;
            })
            .attr("y2", function (d) {
              return d.target.y;
            })
            .append("svg:title")
            .text(function (d) {
              return d.source[control.options.nodeLabel] + ":" + d.target[control.options.nodeLabel];
            });

        // Exit any old links.
        link.exit().remove();

       
        // Update the nodes
        var node = svg.selectAll("g.node")
            .data(control.nodes, function (d) {
              return d.unique;
            });

        node.select("circle")
            .style("fill", function (d) {
              return getColor(d);
            })
            .attr("r", function (d) {
              return getRadius(d);
            });

        // Enter any new nodes.
        var nodeEnter = node.enter()
            .append("svg:g")
            .attr("class", "node")
            .attr("transform", function (d) {
              return "translate(" + d.x + "," + d.y + ")";
            })
            .on("dblclick", function (d) {
              control.nodeClickInProgress = false;
              if (d.url) window.open(d.url);
            })
            .on("click", function (d) {
              // this is a hack so that click doesnt fire on the1st click of a dblclick
              if (!control.nodeClickInProgress) {
                control.nodeClickInProgress = true;
                setTimeout(function () {
                    if (control.nodeClickInProgress) {
                        control.nodeClickInProgress = false;
                        if (control.options.nodeFocus) {
                            d.isCurrentlyFocused = !d.isCurrentlyFocused;
                            makeFilteredData();
                            d3Force.render();
                        }
                    }
                }, control.clickHack);
              }
            })
            .call(force.drag);

        nodeEnter.append("svg:circle")
            .attr("r", function (d) {
              return getRadius(d);
            })
            .style("fill", function (d) {
              return getColor(d);
            })
            .append("svg:title")
            .text(function (d) {
              return d[control.options.nodeLabel];
            });

        if (control.options.nodeLabel) {
          
            // text is done once for shadow as well as for text
            nodeEnter.append("svg:text")
                .attr("x", control.options.labelOffset)
                .attr("dy", ".31em")
                .attr("class", "shadow")
                .style("font-size", control.options.labelFontSize + "px")
                .text(function (d) {
                  return d.shortName ? d.shortName : d.name;
                });
            
            nodeEnter.append("svg:text")
                .attr("x", control.options.labelOffset)
                .attr("dy", ".35em")
                .attr("class", "text")
                .style("font-size", control.options.labelFontSize + "px")
                .text(function (d) {
                  return d.shortName ? d.shortName : d.name;
                });
        }

        // Exit any old nodes.
        node.exit().remove();
        control.link = svg.selectAll("line.link");
        control.node = svg.selectAll("g.node");
        force.on("tick", tick);



        if (control.options.linkName) {
            link.append("title")
              .text(function (d) {
                return d[control.options.linkName];
              });
        }


        function tick() {
            link.attr("x1", function (d) {
                return d.source.x;
              })
              .attr("y1", function (d) {
                return d.source.y;
              })
              .attr("x2", function (d) {
                return d.target.x;
              })
              .attr("y2", function (d) {
                return d.target.y;
              });
            
            node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        }

        function getRadius(d) {
            var r = control.options.radius  * (control.options.nodeResize ? Math.sqrt((d.weight+1)* control.options.nodeResize) / Math.PI : 1);
            return control.options.nodeFocus && d.isCurrentlyFocused ? control.options.nodeFocusRadius : r;
        }

        function getColor(d) {
            return control.options.nodeFocus && d.isCurrentlyFocused ? 
              control.options.nodeFocusColor : (control.options.colors[d.group] || control.options.colors.unknown);
        }

        function makeFilteredData() {
            // we'll keep only the data where filterned nodes are the source or target
            var control = d3Force.control;
            var newNodes = [];
            var newLinks = [];

            for (var i = 0; i < control.data.links.length; i++) {
                var link = control.data.links[i];
                if (link.target.isCurrentlyFocused || link.source.isCurrentlyFocused) {
                    newLinks.push(link);
                    addNodeIfNotThere(link.source, newNodes);
                    addNodeIfNotThere(link.target, newNodes);
                }
            }
            // if none are selected reinstate the whole dataset
            if (newNodes.length > 0) {
                control.links = newLinks;
                control.nodes = newNodes;
            } else {
                control.nodes = control.data.nodes;
                control.links = control.data.links;
            }
            return control;

            function addNodeIfNotThere(node, nodes) {
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].unique == node.unique) return i;
                }
                return nodes.push(node) - 1;
            }
        }

    };
    return d3Force;

})(D3Force || {});
