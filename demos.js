(() => {
  const A=globalThis.ProjectAlgorithms;
  globalThis.mountProjectDemo=(id,root)=>{
    let alive=true;const timers=new Set();
    const later=(fn,ms)=>{const t=setTimeout(()=>{timers.delete(t);if(alive)fn();},ms);timers.add(t);};
    const cancel=()=>{for(const t of timers)clearTimeout(t);timers.clear();};
    const q=s=>root.querySelector(s),on=(s,event,fn)=>q(s).addEventListener(event,fn);
    const status=message=>q('.demo-status').textContent=message;
    const button=(action,label)=>`<button type="button" data-action="${action}">${label}</button>`;
    const controls=items=>`<div class="demo-controls">${items}</div>`;
    root.innerHTML='<h3 class="demo-heading">Try it yourself</h3><p class="demo-intro"></p><div class="demo-body"></div><p class="demo-status" role="status" aria-live="polite"></p><p class="demo-disclosure">Interactive JavaScript recreation of the project concepts. This demo runs locally in your browser; it does not run or publish the original C++ coursework.</p>';
    const body=q('.demo-body'),intro=q('.demo-intro');
    if(id==='puzzle'){
      intro.textContent='Slide a tile next to the empty space, or watch A* find a route to the solved board.';
      body.innerHTML='<div class="puzzle-board" role="group" aria-label="Sliding puzzle"></div>'+controls(button('shuffle','Shuffle')+button('solve','Solve with A*'));
      let state=A.shufflePuzzle(),moves=0,busy=false;
      function draw(){const legal=A.neighbors(state.indexOf(0),4);q('.puzzle-board').innerHTML=state.map((v,i)=>v?`<button class="puzzle-tile" data-tile="${i}" aria-label="Move tile ${v}" ${busy||!legal.includes(i)?'disabled':''}>${v}</button>`:'<span class="puzzle-blank" aria-label="Empty space"></span>').join('');status(A.distance(state)?`${moves} moves · Manhattan distance: ${A.distance(state)}`:`Solved in ${moves} moves.`);}
      on('.puzzle-board','click',e=>{const b=e.target.closest('[data-tile]');if(!b||busy)return;const i=Number(b.dataset.tile),z=state.indexOf(0);if(!A.neighbors(z,4).includes(i))return;[state[i],state[z]]=[state[z],state[i]];moves++;draw();});
      on('[data-action=shuffle]','click',()=>{cancel();busy=false;state=A.shufflePuzzle();moves=0;q('[data-action=solve]').disabled=false;draw();});
      on('[data-action=solve]','click',()=>{if(busy)return;const result=A.solvePuzzle(state);if(!result.path){status('This board needs a larger search. Shuffle for a fresh example, then try again.');return;}busy=true;q('[data-action=solve]').disabled=true;let step=1;const tick=()=>{if(step<result.path.length){state=result.path[step++];moves++;draw();later(tick,180);}else{busy=false;q('[data-action=solve]').disabled=false;draw();status(`Solved · ${result.path.length-1} solution moves · ${result.visited} states explored by A*.`);}};tick();});draw();
    }
    if(id==='maze'){
      intro.textContent='Generate a maze with disjoint sets. Find the exit using the arrow buttons or keyboard, or reveal the BFS solution.';
      body.innerHTML='<div class="maze-stage" tabindex="0" role="group" aria-label="Maze. Use arrow keys to move from the blue start to the orange exit."></div>'+controls(button('new','New maze')+button('path','Show solution'))+'<div class="maze-directions" role="group" aria-label="Move through maze">'+button('up','↑')+button('left','←')+button('down','↓')+button('right','→')+'</div>';
      let maze=A.makeMaze(),player=0,show=false,steps=0;
      function draw(){const {n,cells,end,path}=maze;const center=i=>`${(i%n)*20+10},${Math.floor(i/n)*20+10}`;let walls='';for(let i=0;i<n*n;i++){const x=i%n*20,y=Math.floor(i/n)*20;if(i%n===0)walls+=`M${x},${y}v20`;if(i<n&&i!==0)walls+=`M${x},${y}h20`;if(i%n===n-1||!cells[i].includes(i+1))walls+=`M${x+20},${y}v20`;if(i!==end&&(i>=n*(n-1)||!cells[i].includes(i+n)))walls+=`M${x},${y+20}h20`;}
        q('.maze-stage').innerHTML=`<svg viewBox="-3 -3 ${n*20+6} ${n*20+6}" role="img" aria-label="Maze with ${n} rows and columns. Player at row ${Math.floor(player/n)+1}, column ${player%n+1}."><rect width="${n*20}" height="${n*20}" fill="#fffdf7"/><path d="${walls}" fill="none" stroke="#435e40" stroke-width="1.8"/>${show?`<polyline points="${path.map(center).join(' ')}" fill="none" stroke="#de754d" stroke-width="4" opacity=".65"/>`:''}<circle cx="${end%n*20+10}" cy="${Math.floor(end/n)*20+10}" r="5" fill="#de754d"/><circle cx="${player%n*20+10}" cy="${Math.floor(player/n)*20+10}" r="5" fill="#386d9d"/></svg>`;
        status(player===end?`Exit reached in ${steps} moves!`:`${steps} moves · Orange dot: exit${show?` · BFS solution: ${path.length-1} moves`:''}`);q('[data-action=path]').textContent=show?'Hide solution':'Show solution';}
      function move(direction){const {n,cells}=maze;const next=player+({left:-1,right:1,up:-n,down:n}[direction]);if(cells[player].includes(next)){player=next;steps++;draw();}else status('There is a wall in that direction. Try another route.');}
      on('[data-action=new]','click',()=>{maze=A.makeMaze();player=0;steps=0;show=false;draw();});on('[data-action=path]','click',()=>{show=!show;draw();});
      for(const dir of ['left','right','up','down'])on(`[data-action=${dir}]`,'click',()=>move(dir));on('.maze-stage','keydown',e=>{const dir={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'}[e.key];if(dir){e.preventDefault();move(dir);}});draw();
    }
    if(id==='mosaic'){
      intro.textContent='Change the scene, tile size, and palette. A KD-tree matches each source region to its nearest color tile.';
      body.innerHTML=controls('<label>Scene <select data-scene><option value="mountain">Mountains</option><option value="sunset">Sunset</option><option value="waves">Waves</option></select></label><label>Palette <select data-palette><option value="mixed">Mixed</option><option value="forest">Forest</option><option value="warm">Warm</option></select></label><label>Tile size <input data-size type="range" min="6" max="24" step="2" value="12"></label>')+'<div class="mosaic-pair"><figure><figcaption>Source scene</figcaption><canvas data-source width="288" height="192" aria-label="Generated source scene"></canvas></figure><figure><figcaption>KD-tree color mosaic</figcaption><canvas data-output width="288" height="192" aria-label="Mosaic of nearest-color tiles"></canvas></figure></div><p class="demo-detail">This simplified example uses colored tiles and RGB distance. The C++ project matches image tiles in LUV color space.</p>';
      const source=q('[data-source]'),ctx=source.getContext('2d'),output=q('[data-output]').getContext('2d');
      function draw(){const scene=q('[data-scene]').value,palette=q('[data-palette]').value,size=Number(q('[data-size]').value);const image=ctx.createImageData(288,192);
        for(let y=0;y<192;y++)for(let x=0;x<288;x++){let rgb;if(scene==='mountain'){const ridge=115+35*Math.sin(x/53)-17*Math.cos(x/23);rgb=y>ridge?[52+y*.28,90+y*.22,64+y*.12]:[125+y*.4,170+y*.23,206-y*.15];}else if(scene==='sunset'){const sun=Math.hypot(x-190,y-65)<30;rgb=sun?[255,225,155]:y>130?[49+y*.12,66+y*.12,106+y*.12]:[242-y*.25,112+y*.5,89+y*.42];}else{const wave=Math.sin(x/24+y/14);rgb=[40+wave*27+y*.35,125+wave*33,172+wave*28];}const i=(y*288+x)*4;image.data.set([...rgb.map(v=>Math.max(0,Math.min(255,Math.round(v)))),255],i);}
        ctx.putImageData(image,0,0);const colors=[];for(let i=0;i<48;i++){if(palette==='mixed')colors.push([(i%4)*75+15,(Math.floor(i/4)%4)*75+15,Math.floor(i/16)*110+15]);else if(palette==='forest')colors.push([25+(i%8)*16,48+Math.floor(i/8)*31,25+(i%6)*21]);else colors.push([110+(i%8)*20,42+Math.floor(i/8)*32,30+(i%6)*23]);}const tree=A.kdTree(colors);let tiles=0;
        for(let y=0;y<192;y+=size)for(let x=0;x<288;x+=size){let sum=[0,0,0],count=0;for(let yy=y;yy<Math.min(y+size,192);yy++)for(let xx=x;xx<Math.min(x+size,288);xx++){const i=(yy*288+xx)*4;for(let c=0;c<3;c++)sum[c]+=image.data[i+c];count++;}const color=A.nearest(tree,sum.map(v=>v/count));output.fillStyle=`rgb(${color.join(',')})`;output.fillRect(x,y,size,size);output.strokeStyle='#ffffff30';output.strokeRect(x+.5,y+.5,size-1,size-1);tiles++;}status(`${tiles} regions matched against ${colors.length} palette tiles using a 3D KD-tree.`);}
      for(const s of ['[data-scene]','[data-palette]','[data-size]'])on(s,'input',draw);draw();
    }
    if(id==='nim'){
      intro.textContent='Take one or two tokens. The player taking the last token wins. Train the learner through random self-play, then play against its weighted moves.';
      body.innerHTML=controls(button('train','Train 5,000 games')+button('reset-learning','Reset learning')+button('new-game','New game'))+'<div class="nim-tokens" aria-label="Remaining tokens"></div>'+controls(button('one','Take 1')+button('two','Take 2'))+'<div class="nim-weights"></div>';
      let learner=A.nimLearner(),tokens=15,busy=false,over=false,last='Your turn.';
      function draw(){q('.nim-tokens').innerHTML=Array.from({length:tokens},()=>'<span aria-hidden="true">●</span>').join('')||'<span>No tokens left</span>';q('.nim-tokens').setAttribute('aria-label',`${tokens} tokens remaining`);q('[data-action=one]').disabled=busy||over;q('[data-action=two]').disabled=busy||over||tokens<2;status(`${last} ${tokens} tokens remaining · ${learner.games.toLocaleString()} training games.`);const w=learner.weights[1][tokens];q('.nim-weights').textContent=tokens?`Learner’s move weights at ${tokens} tokens: take 1 = ${w[0]}, take 2 = ${tokens>1?w[1]:'unavailable'}. Higher scores are preferred; training is not a guarantee of perfect play.`:'';}
      function reset(){cancel();tokens=15;busy=false;over=false;last='Your turn.';draw();}
      function take(n){if(busy||over||tokens<n)return;tokens-=n;if(!tokens){over=true;last='You win!';draw();return;}busy=true;last='Learner is choosing…';draw();later(()=>{const move=learner.choose(tokens);tokens-=move;busy=false;if(!tokens){over=true;last=`Learner took ${move} and wins.`;}else last=`Learner took ${move}. Your turn.`;draw();},450);}
      on('[data-action=one]','click',()=>take(1));on('[data-action=two]','click',()=>take(2));on('[data-action=new-game]','click',reset);on('[data-action=train]','click',()=>{learner.train(5000);draw();});on('[data-action=reset-learning]','click',()=>{learner=A.nimLearner();reset();});draw();
    }
    if(id==='flood'){
      intro.textContent='Pick a starting square, then compare breadth-first and depth-first traversal. Dark squares are walls; the fill stays inside the connected region.';
      body.innerHTML=controls('<label>Traversal <select data-strategy><option>BFS</option><option>DFS</option></select></label>'+button('step','Step')+button('play','Animate')+button('reset','Reset fill'))+'<div class="flood-board" role="group" aria-label="Flood fill grid. Choose a starting square."></div><p class="demo-detail">BFS spreads outward in layers. DFS explores deeper paths first. Both visit the same reachable region.</p>';
      const n=12,cells=Array.from({length:n*n},(_,i)=>{const x=i%n,y=Math.floor(i/n);return Number((x===5&&y!==3)||(y===8&&x>=5)||(x===9&&y>8));});let start=14,order=[],filled=0,playing=false;
      q('.flood-board').innerHTML=cells.map((wall,i)=>`<button class="flood-cell ${wall?'wall':''}" data-cell="${i}" ${wall?'disabled':''} aria-label="Start at row ${Math.floor(i/n)+1}, column ${i%n+1}"></button>`).join('');
      function draw(){q('.flood-board').querySelectorAll('[data-cell]').forEach(b=>{b.style.backgroundColor='';b.classList.toggle('start',Number(b.dataset.cell)===start);});for(let i=0;i<filled;i++){const b=q(`[data-cell="${order[i]}"]`);b.style.backgroundColor=`hsl(${25+i*1.8} 55% 56%)`;}q('[data-action=play]').textContent=playing?'Pause':'Animate';status(`${q('[data-strategy]').value} · ${filled} / ${order.length} reachable squares filled${filled===order.length?' · Complete!':''}`);}
      function reset(){cancel();playing=false;filled=0;order=A.traversal(cells,start,n,q('[data-strategy]').value);draw();}
      function step(){if(filled<order.length)filled++;draw();}
      function tick(){if(!playing)return;if(filled<order.length){step();later(tick,55);}else{playing=false;draw();}}
      on('.flood-board','click',e=>{const b=e.target.closest('[data-cell]');if(b&&!cells[Number(b.dataset.cell)]){start=Number(b.dataset.cell);reset();}});on('[data-strategy]','change',reset);on('[data-action=reset]','click',reset);on('[data-action=step]','click',()=>{cancel();playing=false;step();});on('[data-action=play]','click',()=>{if(playing){cancel();playing=false;draw();}else{if(filled===order.length)filled=0;playing=true;tick();}});reset();
    }
    return ()=>{alive=false;cancel();};
  };
})();
