const MPC_PAD_COUNT = 12;
const MPC_PADS = [document.getElementById('mpc-pad-0')];
const MPC_CONTAINER = document.getElementById('mpc-container');
const SOUNDBANK = new Array(12).fill(null).map(() => (new Tone.Player()));

const createPadPlayer = (index) => {
  MPC_PADS[index].addEventListener('pointerdown', () => {
    onPadPressed(index);
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
    SOUNDBANK[0] = new Tone.Player(`file://${path}/sound/CymaticsKick3.wav`).toDestination();
    console.log(`set path: ${SOUNDBANK[0].url}`);
  }
}

const playSound = (pad, velocity) => {
  if (pad >= SOUNDBANK.length) {
    console.log('nah bro');
    return;
  }

  SOUNDBANK[pad].start();
  console.log('did sound play?');

  // if (audioContext.state === 'suspended') {
  //   audioContext.resume();
  // }
  // const source = audioContext.createBufferSource();
  // source.buffer = padAudioBuffers[pad];
  // source.connect(audioContext.destination);
  // source.start();
  // console.log(`played pad ${pad}`);
}

const onPadPressed = (pad) => {
  playSound(pad);
}

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