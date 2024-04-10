// src/Graph.js
import React, { useState, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow
} from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';
import CustomNode from './CustomNode';
import './style.css'; // CSS 파일 임포트 확인
import handleNodeDoubleClick from './HandleNodeDoubleClick'; // 모듈 임포트

const Graph = ({ initialNodes, initialEdges, onNodeClick }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedElement, setSelectedElement] = useState(null);
  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    if (selectedElement) {
      onNodeClick(selectedElement);
    }
  }, [selectedElement, onNodeClick]);

  const onElementClick = (event, element) => {
    setSelectedElement(element);
  };

  const onElementDoubleClick = (event, element) => {
    if (element.type === 'customNode') {
      handleNodeDoubleClick(element, nodes, edges, setNodes, setEdges, reactFlowInstance);
    }
  };

  // 미니맵에서 노드의 색상을 결정하는 함수
  const nodeColor = (node) => {
    return '#0077FF'; // 파란색
  };

  const nodeTypes = { customNode: CustomNode };

  return (
    <div className="reactflow-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
        onElementClick={onElementClick}
        onElementDoubleClick={onElementDoubleClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap nodeColor={nodeColor} />
        <Controls />
        <Background />
      </ReactFlow>
      {selectedElement && (
        <div style={{ position: 'absolute', right: 0, top: 0, width: '300px', padding: '10px', background: '#f0f0f0', zIndex: 100 }}>
          <h3>선택된 엘리먼트 정보</h3>
          <p>ID: {selectedElement.id}</p>
          <p>타입: {selectedElement.type}</p>
          {selectedElement.data && (
            <div>
              <h4>데이터 정보:</h4>
              {Object.entries(selectedElement.data).map(([key, value]) => (
                <p key={key}>{`${key}: ${value}`}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Graph;
