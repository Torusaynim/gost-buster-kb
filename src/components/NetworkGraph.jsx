import React, { useEffect, useRef, useState } from 'react';
import Container from '@mui/material/Container';
import * as d3 from 'd3';

function NetworkGraph(props) {

  const backUri = 'http://127.0.0.1:5000';

  const svgRef = useRef(null);
  const [linkedNotes, setLinkedNotes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backUri}/api/get-Note/${props.noteData._id}`);
        const data = await response.json();
        const linkedNoteIds = data.links;

        const linkedNotesData = await Promise.all(
          linkedNoteIds.map(async (id) => {
            const res = await fetch(`${backUri}/api/get-Note/${id}`);
            const result = await res.json();
            return result;
          })
        );

        setLinkedNotes(linkedNotesData);
      } catch (error) {
        console.error('Error fetching linked notes:', error);
      }
    };

    fetchData();
  }, [props.noteData]);

  useEffect(() => {
    if (linkedNotes.length === 0) {
      return; // Skip rendering if there are no linked notes
    }

    const svg = d3.select(svgRef.current);

    const data = {
      nodes: [
        {
          id: props.noteData._id,
          name: props.noteData.name,
          status: props.noteData.status === 'Действующий' ? 'active' : 'inactive',
        },
        ...linkedNotes.map((note) => ({
          id: note._id,
          name: note.name,
          status: note.error ? 'error' : note.status === 'Действующий' ? 'active' : 'inactive',
        })),
      ],
      links: linkedNotes.map((note) => ({
        source: props.noteData._id,
        target: note._id,
      })),
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
      .style('fill', (d) => {
        if (d.status === 'active') return 'green';
        if (d.status === 'inactive') return 'yellow';
        if (d.status === 'error') return 'purple';
        return 'orangered';
      })
      .style('stroke', 'darkgrey')
      .style('stroke-width', 2);

    node
      .append('text') // Append text elements within the container group
      .text((d) => d.name) // Set the text content of the node
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em') // Adjust the vertical alignment of the text
      .style('fill', (d) => {
        if (d.status === 'active') return 'white';
        if (d.status === 'inactive') return 'black';
        if (d.status === 'error') return 'white';
        return 'white'; // Set a default text color
      });

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

    return () => {
      // Clean up the D3 simulation and remove SVG elements
      simulation.stop();
      svg.selectAll('.link').remove();
      svg.selectAll('.node').remove();
    };
  }, [linkedNotes, props.noteData]);

  console.log(linkedNotes);

  return (
    <Container component="span" sx={{ p: 2, border: '1px dashed grey' }}>
        <svg ref={svgRef} width={400} height={400}>
            {/* D3 network graph render */}
        </svg>
        {/* Render the linked notes */}
        {linkedNotes.map((note) => (
          <div key={note._id}>
            <span>{note.name} </span>
            <span>{note.status}</span>
          </div>
        ))}
    </Container>
  );
}

export default NetworkGraph;
