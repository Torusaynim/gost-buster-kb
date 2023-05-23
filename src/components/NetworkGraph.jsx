import React, { useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import * as d3 from 'd3';

function NetworkGraph(props) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const data = {
      nodes: [
        { id: 'Образец записи' },
        { id: 'Пример связи 1' },
        { id: 'Пример связи 2' },
      ],
      links: [
        { source: 'Образец записи', target: 'Пример связи 1' },
        { source: 'Образец записи', target: 'Пример связи 2' },
      ],
    };

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
    .append('g') // Append a container group for each node
    .attr('class', 'node')
    .call(drag);
    
    node
      .append('circle') // Append circle elements within the container group
      .attr('r', (d, i) => (i === 0 ? 30 : 15))
      .style('fill', 'orange')
      .style('stroke', 'white')
      .style('stroke-width', 2);
    
    node
      .append('text') // Append text elements within the container group
      .text((d) => d.id) // Set the text content of the node
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em'); // Adjust the vertical alignment of the text
    
    const simulation = d3
      .forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id((d) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('center', d3.forceCenter(200, 200).strength(0.05))
      .on('tick', () => {
        link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);
    
        node.attr('transform', (d) => `translate(${d.x}, ${d.y})`);
      });
    
    // Rest of the code...
    
    

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <Container component="span" sx={{ p: 2, border: '1px dashed grey' }}>
        <svg ref={svgRef} width={400} height={400}>
            {/* D3 network graph render */}
        </svg>
        {/* <div>{props.noteId}</div> */}
    </Container>
  );
}

export default NetworkGraph;
