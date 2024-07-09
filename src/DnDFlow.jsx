import React, { useRef, useCallback, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar.jsx';

import './index.css';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'input node' },
    position: { x: 250, y: 5 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  //Background
  const [varient, setVariant] = useState('lines')

  //edit hooks
   const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(nodes.data)
  const [id, setId] = useState()

  // function for edit
  const onNodeClick = (e, val) => {
    setEditValue(val.data.label);
    setId(val.id);
     setIsEditing(true);
  }

  //handle change function
  const handleChange = (e) => {
    e.preventDefault();
    setEditValue(e.target.value);
  }

  const handleEdit = () => {
    const res = nodes.map((item) => {
      if (item.id === id) {
        item.data = {
          ...item.data,
          label: editValue
        }
      }
      return item
    })
    setNodes(res);
    setEditValue('')
    setIsEditing(false)
  }
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition],
  );
const  handCancel =()=>{
  setIsEditing(false);
  setEditValue('')
}
  return (
    <div className="dndflow">
    { isEditing &&(
      <div className='update_node_controls'>
          <label>label : </label>
          <br />
          <input type='text' value={editValue} onChange={handleChange} /><br />
          <button className='btn' onClick={handleEdit}>
            Update
          </button><br />
          <button className='btn' onClick={handCancel}>
           Cancel
          </button>
        </div>
    )} 


      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={(e, val) => onNodeClick(e, val)}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Background color='#99b3ec' variant={varient} />
          <Controls />
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <DnDFlow />
  </ReactFlowProvider>
);
