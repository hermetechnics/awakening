import { startScore } from "./score.js";
import { TextDisplay } from "./text.js";
import {
  scheduleScript,
  IntroScript,
  Checkpoint1IntroScript
} from "./script.js";
import { Sharawadji } from "../sharawadji/src/index.js";
import { latLngDist } from "./utils.js";
import { fakeCaptcha } from "./fakeCaptcha.js";

const INIT_RAMP = 20;

const container = document.getElementById("container");
const intro = document.getElementById("intro");
const bgAudio = document.getElementById("bg-audio");
const textContainer = document.getElementById("text-display");
const statusContainer = document.getElementById("status-display");
const fakeCaptchas = Array.from(
  document.getElementsByClassName("fake-captcha")
).map(c => fakeCaptcha(c));

const textDisplay = new TextDisplay(textContainer);
let currentScript = null;
let audioContext, masterGain = null;

const debug = location.search.includes("debug=true");

const mapOptions = {
  position: new google.maps.LatLng(-20.5069053, -69.3754891),
  pov: { heading: 308.77, pitch: 3 },
  clickToGo: debug ? true : false,
  disableDefaultUI: true
};

const sounds = [
  {
    name: "checkpoint1-music",
    lat: -20.503758,
    lng: -69.3805445,
    timestamp: 551459942721,
    src: "assets/audio/lj.mp3",
    db: 80,
    loop: true
  }
];

const Checkpoints = [
  {
    lat: -20.503758,
    lng: -69.3805445,
    callback: () => {
      currentScript.stop();
      currentScript = scheduleScript(Checkpoint1IntroScript, {
        map,
        bgAudio,
        statusContainer, fakeCaptchas, textDisplay, masterGain, audioContext
      });
    }
  }
];

const CHECKPOINT_DISTANCE_THRESHOLD = 30;

const checkForCheckpoints = map => () => {
  const position = map.getPosition();

  for (let checkpoint of Checkpoints) {
    if (checkpoint.passed) {
      continue;
    }

    const distanceFromCheckpoint = latLngDist(
      position,
      new google.maps.LatLng(checkpoint.lat, checkpoint.lng)
    );

    if (distanceFromCheckpoint < CHECKPOINT_DISTANCE_THRESHOLD) {
      checkpoint.passed = true;
      checkpoint.callback();
    }
  }
};

const map = new google.maps.StreetViewPanorama(container, mapOptions);
google.maps.event.addListener(
  map,
  "position_changed",
  checkForCheckpoints(map)
);

const initialize = event => {
  if (event.currentTarget !== intro) {
    return;
  }
  intro.removeEventListener("click", initialize);
  intro.classList.add("hidden");
  bgAudio.volume = 0.3;

  audioContext = new AudioContext();
  masterGain = new GainNode(audioContext, { gain: 0 });
  const bgNode = new MediaElementAudioSourceNode(audioContext, {
    mediaElement: bgAudio
  });
  bgNode.connect(masterGain).connect(audioContext.destination);
  bgAudio.play();

  currentScript = scheduleScript(IntroScript, { textDisplay, map, bgAudio, statusContainer, fakeCaptchas, masterGain, audioContext });
  startScore(audioContext, masterGain);

  masterGain.gain.linearRampToValueAtTime(
    1,
    audioContext.currentTime + INIT_RAMP
  );

  const sharawadji = new Sharawadji(sounds, map, {
    debug: true,
    compressor: true
  });
};

intro.addEventListener("click", initialize);
