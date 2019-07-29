import { startScore } from "./score.js";
import { TextDisplay } from "./text.js";
import { scheduleScript, IntroScript } from "./script.js";

const INIT_RAMP = 20;

const container = document.getElementById("container");
const intro = document.getElementById("intro");
const bgAudio = document.getElementById("bg-audio");
const textContainer = document.getElementById("text-display");

const textDisplay = new TextDisplay(textContainer);

const mapOptions = {
  position: new google.maps.LatLng(-20.5069053, -69.3754891),
  pov: { heading: 308.77, pitch: 3 },
  clickToGo: false,
  disableDefaultUI: true
};

const map = new google.maps.StreetViewPanorama(container, mapOptions);

const initialize = event => {
  if (event.currentTarget !== intro) {
    return;
  }
  intro.removeEventListener("click", initialize);
  intro.classList.add("hidden");
  bgAudio.volume = 0.3;

  speechSynthesis.speak(new SpeechSynthesisUtterance("Wake up"));

  scheduleScript(textDisplay, IntroScript, { map, bgAudio });

  const audioContext = new AudioContext();
  const masterGain = new GainNode(audioContext, { gain: 0 });
  const bgNode = new MediaElementAudioSourceNode(audioContext, {
    mediaElement: bgAudio
  });
  bgNode.connect(masterGain).connect(audioContext.destination);
  bgAudio.play();

  startScore(audioContext, masterGain);

  masterGain.gain.linearRampToValueAtTime(
    1,
    audioContext.currentTime + INIT_RAMP
  );
};

intro.addEventListener("click", initialize);
