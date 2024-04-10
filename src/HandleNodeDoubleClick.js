// src/HandleNodeDoubleClick.js
const handleNodeDoubleClick = (node, nodes, edges, reactFlowInstance) => {
    // 현재 노드에서 출발하는 엣지를 찾습니다.
    const connectedEdges = edges.filter(edge => edge.source === node.id);
    
    if (connectedEdges.length > 0) {
      // 첫 번째 연결된 엣지의 대상 노드 ID를 찾습니다.
      const targetNodeId = connectedEdges[0].target;
  
      // 대상 노드를 찾습니다.
      const targetNode = nodes.find(n => n.id === targetNodeId);
  
      if (targetNode) {
        // React Flow 인스턴스를 사용하여 대상 노드로 화면을 이동시킵니다.
        reactFlowInstance.fitView({
          nodes: [targetNode],
          padding: 0.5
        });
      }
    }
  };
  
  export default handleNodeDoubleClick;
  