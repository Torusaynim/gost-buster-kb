import React, { useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import * as d3 from 'd3';

function NetworkGraph(props) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const data = {
      nodes: [
        { id: 'Node 1' },
        { id: 'Node 2' },
        { id: 'Node 3' },
        { id: 'Node 4' },
      ],
      links: [
        { source: 'Node 1', target: 'Node 2' },
        { source: 'Node 2', target: 'Node 3' },
        { source: 'Node 3', target: 'Node 4' },
        { source: 'Node 4', target: 'Node 1' },
      ],
    };

    const simulation = d3
      .forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id((d) => d.id))
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('center', d3.forceCenter(200, 200).strength(0.05))
      .on('tick', () => {
        link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);

        node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
      });

    const drag = d3
      .drag()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const link = svg
      .selectAll('.link')
      .data(data.links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .style('stroke', 'gray')
      .style('stroke-width', 2);

    const node = svg
      .selectAll('.node')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', 10)
      .style('fill', 'steelblue')
      .style('stroke', 'white')
      .style('stroke-width', 2)
      .call(drag);

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <Container component="span" sx={{ p: 2, border: '1px dashed grey' }}>
        <svg ref={svgRef} width={400} height={400}>
            {/* D3 network graph render */}
        </svg>
        <div>{props.noteId}</div>
    </Container>
  );
}

export default NetworkGraph;
