const DEFAULT_DURATION = 4;

const enableClickToGoCB = context => {
  context.map.setOptions({ clickToGo: true });
};

export const IntroScript = [
  { duration: 1 },
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
  { text: "In this ephemeral world" },
  { text: "time is constrained" },
  { text: "by the two guardian sigils" },
  { text: " - extrema of power;" },
  { text: "The Request" },
  { text: "and The Response." },
  { text: "The third sigil is a secret" },
  { text: "where true power lies." },
  { text: "We complete the triad by placing it in the middle," },
  { text: "like a bridge:" },
  { text: "The Interface." }
];

export const Checkpoint1EndScript = [
  { text: "The stars are aligned." },
  { text: "There are points ahead of you - " },
  { text: "three ever-changing sites of learning." },
  { text: "Visit them in the correct order" },
  { text: "to obtain the Waking Words." },
  { text: "The journey, like most of this algorithmic world" },
  { text: "may be tedious and repetitive." },
  { text: "But fear not - for every moment of learning" },
  { text: "brings you closer to the truth." }
];

export const scheduleScript = async (textDisplay, script, context) => {
  let currentTime = 0;
  for (let line of script) {
    const duration = line.duration || DEFAULT_DURATION;
    const time = line.time || duration;
    currentTime += time;

    setTimeout(() => {
      if (line.text) {
        textDisplay.addLine(line.text, duration * 1000);
      }

      if (line.callback) {
        line.callback(context);
      }
    }, currentTime * 1000);
  }
};
