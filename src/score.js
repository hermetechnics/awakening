import { sleep } from "./time.js";

const OSC_TYPE = "sine";
const MAX_GAIN = 0.5;
const NOTE_WAIT = 2000;
const BEND_PROB = 0.1;

const Envelope = {
  attack: 0.01,
  decay: 0.2,
  release: 6,
  gap: 0.3
};

const randomFrequency = () => {
  const note = Math.floor(Math.random() * 36);
  return 200 + 200 * 0.056 * note;
};

const scoreGenerator = function*(context, sink) {
  while (true) {
    const frequency = randomFrequency();
    const osc = new OscillatorNode(context, { type: OSC_TYPE, frequency });
    const panner = new StereoPannerNode(context, {
      pan: Math.random() * 2 - 1
    });
    const gain = new GainNode(context, { gain: 0 });

    osc
      .connect(gain)
      .connect(panner)
      .connect(sink);
    osc.start();

    const peakVolume = MAX_GAIN * Math.random();

    gain.gain.linearRampToValueAtTime(
      peakVolume,
      context.currentTime + Envelope.attack
    );
    gain.gain.linearRampToValueAtTime(
      peakVolume / 2,
      context.currentTime + Envelope.attack + Envelope.decay
    );
    gain.gain.linearRampToValueAtTime(
      0.0,
      context.currentTime + Envelope.attack + Envelope.decay + Envelope.release
    );

    if (Math.random() > BEND_PROB) {
      osc.frequency.linearRampToValueAtTime(
        randomFrequency(),
        context.currentTime + Envelope.attack + Envelope.decay
      );
    }

    osc.stop(
      context.currentTime +
        Envelope.attack +
        Envelope.decay +
        Envelope.release +
        Envelope.gap
    );
    osc.addEventListener("ended", () => {
      panner.disconnect();
      gain.disconnect();
      osc.disconnect();
    });

    yield gain;
  }
};

export const startScore = async (context, sink) => {
  const score = scoreGenerator(context, sink);

  for (let note of score) {
    await sleep(Math.random() * NOTE_WAIT + NOTE_WAIT / 3);
  }
};
