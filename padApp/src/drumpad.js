const MPC_PAD_COUNT = 12;
const MPC_PADS = [document.getElementById('mpc-pad-0')];
const MPC_CONTAINER = document.getElementById('mpc-container');

// create duplicates 
for (let i = 1; i <= MPC_PAD_COUNT; i++) {
  const pad = MPC_PADS[0].cloneNode(true);
  pad.id = `mpd-pad-${i}`;
  pad.childNodes.forEach(n => {
    if (n.nodeType == Node.ELEMENT_NODE && n.tagName === 'SPAN') {
      n.textContent = `PAD ${i}`;
    }
  });
  MPC_CONTAINER.appendChild(pad);
  MPC_PADS.push(pad);
}