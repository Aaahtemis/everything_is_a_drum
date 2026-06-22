const MPC_PAD_COUNT = 12;
const MPC_PADS = [document.getElementById('mpc-pad-0')];
const MPC_CONTAINER = document.getElementById('mpc-container');
const SOUNDBANK = new Array(12).fill(null);

const createPadPlayer = (index) => {
  MPC_PADS[index].addEventListener('pointerdown', () => {
    playSound(index, 127);
  });
}

const loadSound = async (url) => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
  }
  catch (err) {
    console.error("failed to load sound: ", err);
  }
}

const loadBank = async (name) => {
  // SOUNDBANK.forEach(pad => {
  // load 1 sound per pad
  // });

  // hardcoded soundbank for now
  if (name === 'default') {
    // request path from main process
    const path = await window.electronAPI.getData('path');
    SOUNDBANK[0] = new Tone.Player(`${path}/Kick3.wav`).toDestination();
    SOUNDBANK[1] = new Tone.Player(`${path}/HouseSnare2.wav`).toDestination();
    SOUNDBANK[2] = new Tone.Player(`${path}/Shaker5.wav`).toDestination();
    SOUNDBANK[3] = new Tone.Player(`${path}/Perc10.wav`).toDestination();
    SOUNDBANK[4] = new Tone.Player(`${path}/HouseKick5.wav`).toDestination();
    SOUNDBANK[5] = new Tone.Player(`${path}/HouseCrash3.wav`).toDestination();
    SOUNDBANK[6] = new Tone.Player(`${path}/Biangle.wav`).toDestination();
    SOUNDBANK[7] = new Tone.Player(`${path}/Cowbell.wav`).toDestination();
    SOUNDBANK[8] = new Tone.Player(`${path}/Crash23.wav`).toDestination();
    SOUNDBANK[9] = new Tone.Player(`${path}/HouseClap1.wav`).toDestination();
    SOUNDBANK[10] = new Tone.Player(`${path}/Perc2.wav`).toDestination();
    SOUNDBANK[11] = new Tone.Player(`${path}/SmallClap9.wav`).toDestination();
  }
}

const playSound = (pad, velocity) => {
  if (pad >= SOUNDBANK.length) {
    console.error(`nah bro pad ${pad} does not exist`);
    return;
  }
  if (!SOUNDBANK[pad]) {
    console.error(`pad ${pad} player don't exist m8`);
    return;
  }

  SOUNDBANK[pad].start();
  console.log(`played pad ${pad}`);
}

window.electronAPI.onPadPressed(data => {
  console.log('received data, ', data);
  playSound(data.pad, data.velocity);
})

const load = async () => {
  await loadBank('default');
  console.log(SOUNDBANK);
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

load();