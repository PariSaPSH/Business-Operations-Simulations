let state = {
    acts: [],
    sim: { active: false, day: 0, timer: null, accruedCost: 0, accruedPenalty: 0, committedCost: 0 },
    drag: { target: null, offsetX: 0, offsetY: 0 }
};

document.getElementById('width-slider').oninput = (e) => {
    document.documentElement.style.setProperty('--config-width', e.target.value + 'px');
};

function getID(n) {
    return String.fromCharCode(65 + (n - 1));
}

function initProject() {
    const n = document.getElementById('setup-n').value;
    const body = document.getElementById('act-body');
    body.innerHTML = '';
    state.acts = [];

    for (let i = 1; i <= n; i++) {
        addRow(getID(i), 5, "", 2, 1200, 300);
    }

    document.getElementById('setup-overlay').style.display = 'none';
    generateNetwork();
}

function addRow(id, d, p, m, n, c) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><strong>${id}</strong></td>
        <td><input type="number" class="table-in in-dur" data-id="${id}" value="${d}"></td>
        <td><input type="text" class="table-in in-pred" data-id="${id}" value="${p}"></td>
        <td><input type="number" class="table-in in-min" data-id="${id}" value="${m}"></td>
        <td><input type="number" class="table-in in-norm" data-id="${id}" value="${n}"></td>
        <td><input type="number" class="table-in in-crash" data-id="${id}" value="${c}"></td>
        <td><button class="crash-btn" id="cb-${id}" onclick="crashAction('${id}')">⚡<span id="cr-${id}">0</span></button></td>`;

    document.getElementById('act-body').appendChild(tr);
    state.acts.push({ id, status: 'idle', progress: 0, crashUnits: 0, x: 0, y: 0 });
}

function loadDemo() {
    document.getElementById('act-body').innerHTML = '';
    state.acts = [];

    const d = [
        { i: 'A', d: 5, p: '',   m: 2, n: 1500, c: 500 },
        { i: 'B', d: 8, p: 'A',  m: 3, n: 1200, c: 300 },
        { i: 'C', d: 4, p: 'A',  m: 2, n: 2000, c: 600 },
        { i: 'D', d: 6, p: 'B',  m: 3, n: 1000, c: 400 },
        { i: 'E', d: 10, p: 'C', m: 5, n: 2500, c: 200 },
        { i: 'F', d: 5, p: 'B,C', m: 3, n: 1100, c: 300 },
        { i: 'G', d: 4, p: 'D,F', m: 2, n: 900,  c: 800 },
        { i: 'H', d: 3, p: 'E,G', m: 1, n: 1400, c: 500 },
        { i: 'I', d: 3, p: 'H',   m: 1, n: 1000, c: 400 }
    ];

    d.forEach(x => addRow(x.i, x.d, x.p, x.m, x.n, x.c));
    document.getElementById('setup-overlay').style.display = 'none';
    generateNetwork();
}

function generateNetwork() {
    sync();
    calculateCPM();
    optimizeLayout();
    renderMatrix();
    renderSVG();
    updateHUD();
}

function sync() {
    let total = 0;

    state.acts.forEach(a => {
        const row = document.querySelector(`.in-dur[data-id="${a.id}"]`).closest('tr');
        a.duration = parseInt(row.querySelector('.in-dur').value) || 1;
        a.minDur = parseInt(row.querySelector('.in-min').value) || 1;
        a.normCost = parseInt(row.querySelector('.in-norm').value) || 0;
        a.crashRate = parseInt(row.querySelector('.in-crash').value) || 0;
        a.preds = row.querySelector('.in-pred').value
            .split(',')
            .map(s => s.trim())
            .filter(s => s && s !== a.id);

        total += a.normCost + (a.crashUnits * a.crashRate);
        document.getElementById(`cr-${a.id}`).innerText = a.duration - a.minDur;
        document.getElementById(`cb-${a.id}`).disabled = (a.duration <= a.minDur);
    });

    state.sim.committedCost = total;
}

function calculateCPM() {
    let visited = new Set();
    let order = [];

    const visit = (id) => {
        if (visited.has(id)) return;
        const a = state.acts.find(x => x.id === id);
        if (!a) return;
        a.preds.forEach(p => visit(p));
        visited.add(id);
        order.push(id);
    };

    state.acts.forEach(a => visit(a.id));

    state.acts.forEach(a => {
        a.es = a.preds.length === 0 ? 0 : Math.max(...a.preds.map(p => state.acts.find(x => x.id === p).ef));
        a.ef = a.es + a.duration;
    });

    const projEnd = Math.max(...state.acts.map(a => a.ef), 0);

    order.reverse().forEach(id => {
        const a = state.acts.find(x => x.id === id);
        const succs = state.acts.filter(x => x.preds.includes(id));
        a.lf = succs.length === 0 ? projEnd : Math.min(...succs.map(s => s.ls));
        a.ls = a.lf - a.duration;
        a.slack = a.ls - a.es;
        a.isCritical = a.slack <= 0;
    });
}

function optimizeLayout() {
    const lvls = {};

    state.acts.forEach(a => {
        lvls[a.id] = a.preds.length === 0 ? 0 : Math.max(...a.preds.map(p => lvls[p])) + 1;
    });

    const groups = {};
    state.acts.forEach(a => {
        if (!groups[lvls[a.id]]) groups[lvls[a.id]] = [];
        groups[lvls[a.id]].push(a);
    });

    const COL_W = 300;
    const MIN_Y_GAP = 140;

    Object.keys(groups).sort().forEach(l => {
        groups[l].forEach((a, i) => {
            a.x = 100 + l * COL_W;
            a.y = 400 + (i * MIN_Y_GAP);
        });
    });

    for (let iter = 0; iter < 5; iter++) {
        Object.keys(groups).sort().forEach(l => {
            groups[l].forEach(a => {
                if (a.preds.length > 0) {
                    const sumY = a.preds.reduce((acc, pId) => acc + state.acts.find(x => x.id === pId).y, 0);
                    a.y = sumY / a.preds.length;
                }
            });

            groups[l].sort((a, b) => a.y - b.y).forEach((a, i, arr) => {
                if (i > 0 && a.y < arr[i - 1].y + MIN_Y_GAP) {
                    a.y = arr[i - 1].y + MIN_Y_GAP;
                }
            });
        });
    }
}

function renderMatrix() {
    const root = document.getElementById('matrix-root');
    let h = `<table class="matrix-table"><tr><th></th>`;

    state.acts.forEach(a => h += `<th style="color:#60a5fa">${a.id}</th>`);
    h += `</tr>`;

    state.acts.forEach(row => {
        h += `<tr><td><strong>${row.id}</strong></td>`;
        state.acts.forEach(col => {
            const isEdge = col.preds.includes(row.id);
            h += `<td class="${isEdge ? 'matrix-val' : ''}">${isEdge ? row.duration : '0'}</td>`;
        });
        h += `</tr>`;
    });

    h += `</table>`;
    root.innerHTML = h;
}

function renderSVG() {
    const eL = document.getElementById('edges-layer');
    const nL = document.getElementById('nodes-layer');
    eL.innerHTML = '';
    nL.innerHTML = '';

    state.acts.forEach(a => {
        a.preds.forEach(pId => {
            const p = state.acts.find(x => x.id === pId);
            const path = document.createElementNS("http://www.w3.org/2000/svg", "line");
            path.setAttribute("x1", p.x + 130);
            path.setAttribute("y1", p.y + 40);
            path.setAttribute("x2", a.x);
            path.setAttribute("y2", a.y + 40);
            path.setAttribute("id", `edge-${p.id}-${a.id}`);

            const crit = (a.isCritical && p.isCritical);
            path.setAttribute("class", `edge-path ${crit ? 'cpm' : 'non-cpm'}`);
            path.setAttribute("marker-end", crit ? "url(#arr-crit)" : "url(#arr-blue)");
            eL.appendChild(path);
        });
    });

    state.acts.forEach(a => {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "node-group");
        g.setAttribute("id", `group-${a.id}`);
        g.setAttribute("transform", `translate(${a.x}, ${a.y})`);
        g.onmousedown = (e) => startDrag(e, a);

        g.innerHTML = `<rect width="130" height="80" rx="10" class="node-rect ${a.isCritical ? 'critical' : ''} ${a.status}" id="node-${a.id}"></rect>
            <rect y="75" width="${(a.progress / 100) * 130}" height="5" fill="var(--active)" id="prog-${a.id}"></rect>
            <text x="65" y="45" text-anchor="middle" font-weight="900" style="font-size:14px">${a.id} (${a.duration})</text>
            <circle cx="0" cy="0" class="timing-circle"></circle><text x="0" y="0" class="timing-text t-es">${a.es}</text>
            <circle cx="130" cy="0" class="timing-circle"></circle><text x="130" y="0" class="timing-text t-ef">${a.ef}</text>
            <circle cx="0" cy="80" class="timing-circle"></circle><text x="0" y="80" class="timing-text t-ls">${a.ls}</text>
            <circle cx="130" cy="80" class="timing-circle"></circle><text x="130" y="80" class="timing-text t-lf">${a.lf}</text>`;

        nL.appendChild(g);
    });
}

function startDrag(e, act) {
    state.drag.target = act;
    const svg = document.getElementById('network-svg');
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());
    state.drag.offsetX = svgPt.x - act.x;
    state.drag.offsetY = svgPt.y - act.y;
}

function onDrag(e) {
    if (!state.drag.target) return;

    const act = state.drag.target;
    const svg = document.getElementById('network-svg');
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());

    act.x = svgPt.x - state.drag.offsetX;
    act.y = svgPt.y - state.drag.offsetY;

    document.getElementById(`group-${act.id}`).setAttribute("transform", `translate(${act.x}, ${act.y})`);

    state.acts.forEach(other => {
        if (other.preds.includes(act.id)) {
            const edge = document.getElementById(`edge-${act.id}-${other.id}`);
            edge.setAttribute("x1", act.x + 130);
            edge.setAttribute("y1", act.y + 40);
        }
        if (act.preds.includes(other.id)) {
            const edge = document.getElementById(`edge-${other.id}-${act.id}`);
            edge.setAttribute("x2", act.x);
            edge.setAttribute("y2", act.y + 40);
        }
    });
}

function endDrag() {
    state.drag.target = null;
}

function toggleSim() {
    state.sim.active = !state.sim.active;
    const btn = document.getElementById('btn-play');

    if (state.sim.active) {
        btn.innerText = "Pause";
        btn.style.background = "var(--critical)";
        state.sim.timer = setInterval(step, 800);
    } else {
        btn.innerText = "Start";
        btn.style.background = "var(--active)";
        clearInterval(state.sim.timer);
    }
}

function resetSim() {
    if (state.sim.active) toggleSim();

    state.sim.day = 0;
    state.sim.accruedCost = 0;
    state.sim.accruedPenalty = 0;

    state.acts.forEach(a => {
        a.status = 'idle';
        a.progress = 0;
    });

    calculateCPM();
    renderSVG();
    updateHUD();
}

function step() {
    let allDone = state.acts.every(a => a.status === 'done');

    if (allDone) {
        clearInterval(state.sim.timer);
        toggleSim();
        alert("Project Finalized.");
        return;
    }

    state.sim.day++;
    const dl = parseInt(document.getElementById('in-deadline').value) || 0;
    const pr = parseInt(document.getElementById('in-penalty').value) || 0;

    if (state.sim.day > dl) {
        state.sim.accruedPenalty += pr;
    }

    state.acts.forEach(a => {
        if (a.status === 'done') return;

        if (a.preds.every(p => state.acts.find(x => x.id === p).status === 'done') && state.sim.day > a.es) {
            a.status = 'active';
            state.sim.accruedCost += (a.normCost + a.crashUnits * a.crashRate) / a.duration;
            a.progress += (100 / a.duration);

            if (a.progress >= 99.9) {
                a.progress = 100;
                a.status = 'done';
            }
        } else if (state.sim.day > a.es) {
            a.status = 'blocked';
        }

        const r = document.getElementById(`node-${a.id}`);
        const p = document.getElementById(`prog-${a.id}`);

        if (r) r.setAttribute("class", `node-rect ${a.isCritical ? 'critical' : ''} ${a.status}`);
        if (p) p.setAttribute("width", (a.progress / 100) * 130);
    });

    updateHUD();

    if (state.acts.every(a => a.status === 'done')) {
        clearInterval(state.sim.timer);
        toggleSim();
        alert("Project Finalized.");
    }
}

function updateHUD() {
    const runway = (parseInt(document.getElementById('in-budget').value) || 0) - (state.sim.accruedCost + state.sim.accruedPenalty);

    document.getElementById('hud-day').innerText = state.sim.day;
    document.getElementById('hud-spent').innerText = "$" + Math.floor(state.sim.committedCost).toLocaleString();
    document.getElementById('hud-accrued').innerText = "$" + Math.floor(state.sim.accruedCost).toLocaleString();
    document.getElementById('hud-penalty').innerText = "$" + state.sim.accruedPenalty.toLocaleString();

    const rEl = document.getElementById('hud-runway');
    rEl.innerText = "$" + Math.floor(runway).toLocaleString();
    rEl.style.color = runway < 0 ? 'var(--critical)' : '#22c55e';
}

function crashAction(id) {
    const a = state.acts.find(x => x.id === id);

    if (a.duration > a.minDur) {
        a.crashUnits++;
        document.querySelector(`.in-dur[data-id="${id}"]`).value = a.duration - 1;
        sync();
        calculateCPM();
        renderSVG();
        updateHUD();
    }
}
