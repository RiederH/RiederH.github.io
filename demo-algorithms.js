/* Independent browser examples of the concepts in the academic projects. */
(() => {
  const neighbors = (i, n) => [i % n ? i - 1 : -1, i % n < n - 1 ? i + 1 : -1, i >= n ? i - n : -1, i < n * (n - 1) ? i + n : -1].filter(x => x >= 0);
  const goal = Array.from({length:16}, (_, i) => (i + 1) % 16);
  const distance = state => state.reduce((sum, tile, i) => tile ? sum + Math.abs(Math.floor(i / 4) - Math.floor((tile - 1) / 4)) + Math.abs(i % 4 - (tile - 1) % 4) : sum, 0);
  function shufflePuzzle(steps = 18, rng = Math.random) {
    const state = [...goal]; let blank = 15, previous = -1;
    for (let k = 0; k < steps; k++) {
      const choices = neighbors(blank, 4).filter(i => i !== previous);
      const next = choices[Math.floor(rng() * choices.length)];
      [state[blank], state[next]] = [state[next], state[blank]]; previous = blank; blank = next;
    }
    return state;
  }
  function solvePuzzle(start, limit = 30000) {
    const heap = [];
    function push(v) { heap.push(v); let i = heap.length - 1; while (i) { const p = (i - 1) >> 1; if (heap[p].f <= v.f) break; heap[i] = heap[p]; i = p; } heap[i] = v; }
    function pop() { const best = heap[0], tail = heap.pop(); if (heap.length) { let i = 0; while (i * 2 + 1 < heap.length) { let c = i * 2 + 1; if (c + 1 < heap.length && heap[c+1].f < heap[c].f) c++; if (heap[c].f >= tail.f) break; heap[i] = heap[c]; i = c; } heap[i] = tail; } return best; }
    const key = state => state.join(',');
    const first = {state:[...start], g:0, f:distance(start), parent:null};
    const seen = new Map([[key(start),0]]); push(first); let visited = 0;
    while (heap.length && visited < limit) {
      const cur = pop(); if (cur.g !== seen.get(key(cur.state))) continue; visited++;
      if (!distance(cur.state)) { const path = []; for (let v = cur; v; v = v.parent) path.push(v.state); return {path:path.reverse(), visited}; }
      const blank = cur.state.indexOf(0);
      for (const next of neighbors(blank,4)) {
        const state = [...cur.state]; [state[blank],state[next]] = [state[next],state[blank]];
        const k = key(state), g = cur.g+1;
        if (g < (seen.get(k) ?? Infinity)) { seen.set(k,g); push({state,g,f:g+distance(state),parent:cur}); }
      }
    }
    return {path:null,visited};
  }
  function makeMaze(n = 12, rng = Math.random) {
    const cells = Array.from({length:n*n},()=>[]), parent = Array.from({length:n*n},(_,i)=>i), sizes = Array(n*n).fill(1);
    const find = x => { while (x !== parent[x]) {parent[x] = parent[parent[x]]; x = parent[x];} return x; };
    const edges = [];
    for(let i=0;i<n*n;i++){ if(i%n<n-1)edges.push([i,i+1]);if(i<n*(n-1))edges.push([i,i+n]); }
    for(let i=edges.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[edges[i],edges[j]]=[edges[j],edges[i]];}
    for(const [a,b] of edges){let x=find(a),y=find(b);if(x===y)continue;if(sizes[x]<sizes[y])[x,y]=[y,x];parent[y]=x;sizes[x]+=sizes[y];cells[a].push(b);cells[b].push(a);}
    const previous=Array(n*n).fill(-1), depths=Array(n*n).fill(0),queue=[0];previous[0]=0;
    for(let h=0;h<queue.length;h++)for(const v of cells[queue[h]])if(previous[v]<0){previous[v]=queue[h];depths[v]=depths[queue[h]]+1;queue.push(v);}
    let end=n*(n-1);for(let i=end+1;i<n*n;i++)if(depths[i]>depths[end])end=i;
    const path=[];for(let i=end;;i=previous[i]){path.push(i);if(!i)break;}
    return {n,cells,end,path:path.reverse()};
  }
  function kdTree(points, depth=0) {
    if(!points.length)return null;const axis=depth%3,sorted=[...points].sort((a,b)=>a[axis]-b[axis]),mid=sorted.length>>1;
    return {point:sorted[mid],axis,left:kdTree(sorted.slice(0,mid),depth+1),right:kdTree(sorted.slice(mid+1),depth+1)};
  }
  function nearest(tree, query) {
    let best=null, dist=Infinity;
    function visit(node){if(!node)return;const d=node.point.reduce((s,x,i)=>s+(x-query[i])**2,0);if(d<dist){dist=d;best=node.point;}const delta=query[node.axis]-node.point[node.axis];visit(delta<0?node.left:node.right);if(delta*delta<=dist)visit(delta<0?node.right:node.left);}
    visit(tree);return best;
  }
  function traversal(cells, start, n, strategy='BFS') {
    if(cells[start])return [];const frontier=[start],seen=new Set([start]),order=[];let head=0;
    while(strategy==='DFS'?frontier.length:head<frontier.length){const v=strategy==='DFS'?frontier.pop():frontier[head++];order.push(v);for(const next of neighbors(v,n))if(!cells[next]&&!seen.has(next)){seen.add(next);frontier.push(next);}}
    return order;
  }
  function nimLearner(rng = Math.random) {
    const weights = Array.from({length:2},()=>Array.from({length:16},()=>[0,0])); let games=0;
    return {weights,get games(){return games;},train(count){for(let g=0;g<count;g++){let tokens=15,player=0;const path=[];while(tokens){const move=tokens>1&&rng()<.5?2:1;path.push([player,tokens,move]);tokens-=move;player=1-player;}const winner=1-player;for(const [p,t,m]of path)weights[p][t][m-1]+=p===winner?1:-1;games++;}},choose(tokens,player=1){if(tokens===1)return 1;const w=weights[player][tokens];return w[0]===w[1]?(rng()<.5?1:2):w[0]>w[1]?1:2;}};
  }
  const api={neighbors,goal,distance,shufflePuzzle,solvePuzzle,makeMaze,kdTree,nearest,traversal,nimLearner};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else globalThis.ProjectAlgorithms=api;
})();
