const MPC_PAD_COUNT = 12;
const MPC_PADS = [document.getElementById('mpc-pad-0')];
const MPC_CONTAINER = document.getElementById('mpc-container');

// TODO: run tone js noises

const createPadPlayer = (index) => {
  MPC_PADS[index].addEventListener("click", () => {
    onPadPressed(index);
  });
  // TODO: add sounds to pad
}

const onPadPressed = (index) => {
  console.log(`PRESSED PAD ${index}`);
}

const init = () => {
  createPadPlayer(0);
  // create duplicates 
  for (let i = 1; i < MPC_PAD_COUNT; i++) {
    const pad = MPC_PADS[0].cloneNode(true);
    pad.id = `mpd-pad-${i}`;
    pad.childNodes.forEach(n => {
      if (n.textContent === 'PAD 0') {
        n.textContent = `PAD ${i}`;
      }
    });
    MPC_CONTAINER.appendChild(pad);
    MPC_PADS.push(pad);
    createPadPlayer(i);
  }
}

init();