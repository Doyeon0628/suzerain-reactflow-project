import React, { useState } from 'react';
import { Handle, useNodesState, useEdgesState, useReactFlow } from 'reactflow';

const CustomNode = ({ id, data }) => {
  const [nodes] = useNodesState();
  const [edges] = useEdgesState();
  const { project, setCenter } = useReactFlow(); // useZoomPanHelper 대신 useReactFlow 사용
  const [showConnectedNodes, setShowConnectedNodes] = useState(false);
  const [connectedNodes, setConnectedNodes] = useState([]);

  const label = data.label.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  const handleDoubleClickOnHandle = (event) => {
    event.stopPropagation(); // 이벤트 버블링 방지
    console.log('핸들이 더블 클릭되었습니다.', data);

    // 연결된 엣지들을 찾음
    const connectedEdges = edges.filter(edge => edge.source === id || edge.target === id);

    // 해당 엣지들을 통해 연결된 노드들의 ID를 찾음
    const connectedNodeIds = connectedEdges.map(edge => {
      return edge.source === id ? edge.target : edge.source;
    });

    // 연결된 노드들의 정보를 찾음
    const connected = nodes.filter(node => connectedNodeIds.includes(node.id));

    setConnectedNodes(connected);
    setShowConnectedNodes(true);
  };

  const handleNodeClick = (node) => {
    setShowConnectedNodes(false); // 목록을 닫음
    // 해당 노드의 위치로 화면을 이동
    setCenter(node.position.x, node.position.y);
  };

  return (
    <div
      style={{
        padding: 10,
        border: '1px solid #ddd',
        borderRadius: 4,
        backgroundColor: '#fff',
        maxWidth: '200px',
        maxHeight: '150px',
        minWidth: '200px',
        overflow: 'auto',
        position: 'relative', // 연결된 노드 목록을 올바르게 표시하기 위해
      }}
    >
      <Handle
        type="target"
        position="top"
        style={{ borderRadius: 0 }}
        onDoubleClick={handleDoubleClickOnHandle}
      />
      {label}
      <Handle
        type="source"
        position="bottom"
        style={{ borderRadius: 0 }}
        onDoubleClick={handleDoubleClickOnHandle}
      />
      {showConnectedNodes && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '10px',
            zIndex: 100,
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {connectedNodes.map((node) => (
              <li
                key={node.id}
                style={{ cursor: 'pointer', marginBottom: '5px' }}
                onClick={() => handleNodeClick(node)}
              >
                {node.data.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomNode;
