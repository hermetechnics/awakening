const DEFAULT_DURATION = 4;

const enableClickToGoCB = context => {
  context.map.setOptions({ clickToGo: true });
};

const flashStatus = (text, duration = 5) => context => {
  context.statusContainer.innerText = text;
  context.statusContainer.classList.add('fade-in');
  setTimeout(() => {
    context.statusContainer.innerText = '';
    context.statusContainer.classList.remove('fade-in');
  }, duration * 1000);
};

const showFakeCaptcha = (callback = () => {}) => context => {
  const captcha = context.fakeCaptchas[0];
  captcha.element.hidden = false;
  const listener = e => {
    callback(e, context);
    captcha.checkbox.removeEventListener('click', listener);
  };

  captcha.checkbox.addEventListener('click', listener);
}

const hideFakeCaptcha = context => {
  const captcha = context.fakeCaptchas[0];
  captcha.element.hidden = true;
}

const showSigil = name => context => {
  const sigil = document.getElementById(`sigil-${name}`);
  const sigilVideos = [...sigil.getElementsByTagName('video')];

  Promise.all(sigilVideos.map(v => v.play())).then(() => sigil.classList.remove('sigil--hidden'));
};

const hideSigil = name => context => {
  const sigil = document.getElementById(`sigil-${name}`);
  sigil.classList.add('sigil--hidden');
}

const hideAllSigils = (c) => (hideSigil("request")(c), hideSigil("response")(c), hideSigil("interface")(c));

const updateSoundTrackVolume = volume => context => {
  console.log('sound', volume);
  const { masterGain, audioContext } = context;
  masterGain.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 7);
}

const fadeInSoundTrack = updateSoundTrackVolume(1);
const fadeOutSoundTrack = updateSoundTrackVolume(0);

export const IntroScript = [
  { duration: 2 },
  { text: "Wake up." },
  { text: "It's time to go" },
  { text: "I will lead you on a journey", time: 3, duration: 7 },
  { text: "an act of gnosis", time: 3, duration: 3 },
  { text: "a ritual of sorts.", duration: 5 },
  {
    text: "The magick of our ancestors is of no use here",
    time: 3,
    duration: 6
  },
  {
    text: "their methods... limited by their love of objects and tools",
    time: 2,
    duration: 4
  },
  { duration: 2 },
  { text: "Before we begin" },
  { text: "I want you to stop and listen" },
  { text: "look around you - the world is moving" },
  { text: "the sky is ephemeral, and glimmering with copyright." },
  { duration: 9 },
  { text: "We are going to proceed." },
  { text: "A set of transient experiences" },
  { text: "as a function of latitude, longitude, heading and pitch" },
  { text: "shall be presented", time: 2, duration: 6 },
  { text: "and rearranged", time: 2, duration: 6 },
  { text: "again and again - ", time: 2, duration: 6 },
  { text: " - to find the Words of Waking.", duration: 5 },
  { duration: 2 },
  { text: "Begin", duration: 2 },
  {
    text: "by walking down the A-665 road.",
    duration: 2,
    callback: enableClickToGoCB
  },
  {
    text: "Stop when you hear the music."
  },
  {
    text: "No need to hurry - take your time."
  }
];

export const Checkpoint1IntroScript = [
  {
    text: "",
    duration: 5,
    callback: (context) => {
      flashStatus("Phase One: The Dharma Wrapper")(context);
      fadeOutSoundTrack(context);
    }
  },
  {
    text: "In this ephemeral world",
    time: 3,
    duration: 6
  },
  { text: "time is constrained", duration: 3 },
  { text: "by the two guardian sigils", time: 3, duration: 6 },
  { text: " - extrema of power;", duration: 3 },
  { text: "The Request", time: 5, duration: 10, callback: showSigil("request") },
  { text: "and The Response.", duration: 5, callback: showSigil("response") },
  { text: "The third sigil is a secret" },
  { text: "where true power lies." },
  {
    text: "We complete the triad by placing it in the middle,",
    time: 5,
    duration: 3
  },
  { text: "like a bridge:", duration: 2, callback: showSigil("interface") },
  { text: "The Interface.", duration: 5 },
  { text: "The first step in a journey is to ask for help - ", duration: 2 },
  { text: "recognize the state of your being,", duration: 2 },
  { text: "take Refuge in who you are", duration: 3 },
  { text: "and who you are not.", duration: 2 },
  { text: "",
    duration: 2,
    callback: showFakeCaptcha((e, context) => {
      setTimeout(() => {
        hideFakeCaptcha(context);
        scheduleScript(Checkpoint1EndScript, context);
      }, 3000);
    }) },
];

export const Checkpoint1EndScript = [
  { text: "The stars are aligned.", callback: hideAllSigils },
  { text: "There are points ahead of you - " },
  { text: "three ever-changing sites of learning." },
  { text: "Visit them in the correct order" },
  { text: "to obtain the Waking Words." },
  { text: "The journey, like most of this algorithmic world" },
  { text: "may be tedious and repetitive." },
  { text: "But fear not - for every moment of learning" },
  { text: "brings you closer to the truth.", callback: fadeInSoundTrack }
];

export const scheduleScript = (script, context) => {
  const { textDisplay } = context;
  let currentTime = 0;
  let timeouts = [];

  for (let line of script) {
    const duration = line.duration || DEFAULT_DURATION;
    const time = line.time || duration;

    const timeout = setTimeout(() => {
      if (line.text) {
        textDisplay.addLine(line.text, duration * 1000);
      }

      if (line.callback) {
        line.callback(context);
      }
    }, currentTime * 1000);

    currentTime += time;
    timeouts.push(timeout);
  }

  return {
    stop: () => {
      timeouts.forEach(clearTimeout);
      timeouts = [];
      textDisplay.clear();
    }
  };
};
