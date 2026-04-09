function update() {
    const t_k1 = Number(document.getElementById('step_kristen_1').value) || 0;
    const t_k2 = Number(document.getElementById('step_kristen_2').value) || 0;

    const t_r1 = Number(document.getElementById('step_room_1').value) || 0;
    const t_r2 = Number(document.getElementById('step_room_2').value) || 0;
    const t_r3 = Number(document.getElementById('step_room_3').value) || 0;

    const t_o1 = Number(document.getElementById('step_oven_1').value) || 0;

    const time_kristen = t_k1 + t_k2;
    const time_roommate = t_r1 + t_r2 + t_r3;
    const time_oven = t_r1 + t_o1;

    document.getElementById('disp_kristen_time').value = time_kristen;
    document.getElementById('disp_room_time').value = time_roommate;
    document.getElementById('disp_oven_time').value = time_oven;

    const n_k = Number(document.getElementById('count_kristen').value) || 1;
    const n_r = Number(document.getElementById('count_room').value) || 1;
    const n_o = Number(document.getElementById('count_oven').value) || 1;

    const caps = [
        { id: 'kristen', name: 'Kristen', val: time_kristen > 0 ? (n_k * 60) / time_kristen : 0 },
        { id: 'oven', name: 'Oven', val: time_oven > 0 ? (n_o * 60) / time_oven : 0 },
        { id: 'room', name: 'Roommate', val: time_roommate > 0 ? (n_r * 60) / time_roommate : 0 }
    ];

    const minCap = Math.min(...caps.map(c => c.val));
    const maxCap = Math.max(...caps.map(c => c.val));

    document.getElementById('sys-cap').innerText = minCap.toFixed(2);
    const bnNames = caps
        .filter(c => Math.abs(c.val - minCap) < 0.001)
        .map(c => c.name);

    document.getElementById('sys-bn').innerText = bnNames.join(" & ").toUpperCase();

    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';

    caps.forEach(c => {
        const isBn = Math.abs(c.val - minCap) < 0.001;
        const pct = maxCap > 0 ? (c.val / maxCap) * 100 : 0;

        tbody.innerHTML += `
            <tr>
                <td style="${isBn ? 'color:var(--danger); font-weight:bold' : ''}">${c.name}</td>
                <td>${c.val.toFixed(2)}</td>
                <td>
                    <div class="bar-bg">
                        <div class="bar-fill ${isBn ? 'bn' : ''}" style="width:${pct}%"></div>
                    </div>
                </td>
            </tr>
        `;
    });

    const MAX_HEIGHT_PX = 180;
    const MIN_HEIGHT_PX = 70;

    caps.forEach(c => {
        const node = document.getElementById(`node-${c.id}`);
        const lbl = document.getElementById(`lbl-${c.id}`);
        const isBn = Math.abs(c.val - minCap) < 0.001;

        lbl.innerText = c.val.toFixed(2) + " doz/hr";

        let heightPx = maxCap > 0 ? (c.val / maxCap) * MAX_HEIGHT_PX : MIN_HEIGHT_PX;
        if (heightPx < MIN_HEIGHT_PX) heightPx = MIN_HEIGHT_PX;

        node.style.height = `${heightPx}px`;

        if (isBn) {
            node.classList.add('bottleneck');
        } else {
            node.classList.remove('bottleneck');
        }
    });
}

update();
