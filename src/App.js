
// src/App.js
import React, { useState, useEffect } from 'react';
// reactflow 대신 react-flow-renderer로 변경
import { ReactFlowProvider } from 'react-flow-renderer'; // 9.0.3 버전에 맞게 수정
import Graph from './Graph';

const App = () => {
  const [fileNumber, setFileNumber] = useState('');
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [connectedNodes, setConnectedNodes] = useState([]); // 연결된 노드들의 정보를 저장할 상태

  useEffect(() => {
    if (fileNumber) {
      const url = `https://Doyeon0628.github.io/suzerain-react-flow/Json/ConversationID-${fileNumber}_react_flow_data.json`;

      fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`서버에서 파일을 찾을 수 없습니다: 상태 코드 ${res.status}`);
          }
          return res.json();
        })
        .then(({ nodes, edges }) => {
          setNodes(nodes);
          setEdges(edges);
        })
        .catch((error) => {
          console.error("데이터를 불러오는 중 오류가 발생했습니다:", error.message);
        });
    }
  }, [fileNumber]);

  // 노드 클릭 이벤트 처리 함수
  const handleNodeClick = (node) => {
    setSelectedNode(node);

    // 연결된 노드 찾기
    const connectedEdges = edges.filter(edge => edge.source === node.id);
    const connectedNodeIds = connectedEdges.map(edge => edge.target);
    const nextNodes = nodes.filter(node => connectedNodeIds.includes(node.id));

    setConnectedNodes(nextNodes);
  };

  // 입력창 스타일
  const inputStyle = {
    padding: '10px',
    fontSize: '16px',
    border: '2px solid #ccc',
    borderRadius: '5px',
    margin: '10px 0',
    width: 'calc(100% - 24px)',
    boxSizing: 'border-box',
  };

  return (
    <ReactFlowProvider> {/* ReactFlowProvider를 추가하여 React Flow 관련 컴포넌트를 감싸줍니다. */}
      <div>
        <input
          type="number"
          value={fileNumber}
          onChange={(e) => setFileNumber(e.target.value)}
          placeholder="Type ConversationID"
          style={inputStyle}
        />
        <Graph nodes={nodes} edges={edges} onNodeClick={handleNodeClick} />
        {selectedNode && (
          <div style={{ marginTop: '10px' }}>
            <h3>선택된 노드 정보:</h3>
            <p>ID: {selectedNode.id}</p>
            <p>타입: {selectedNode.type}</p>
            {selectedNode.data && (
              <div>
                <h4>데이터:</h4>
                {Object.entries(selectedNode.data).map(([key, value]) => (
                  <p key={key}>{`${key}: ${value}`}</p>
                ))}
              </div>
            )}
            {connectedNodes.length > 0 && (
              <div>
                <h3>연결된 노드 정보:</h3>
                {connectedNodes.map(node => (
                  <div key={node.id}>
                    <p>ID: {node.id}</p>
                    <p>타입: {node.type}</p>
                    {node.data && (
                      <div>
                        <h4>데이터:</h4>
                        {Object.entries(node.data).map(([key, value]) => (
                          <p key={key}>{`${key}: ${value}`}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ReactFlowProvider>
  );
};

export default App;
