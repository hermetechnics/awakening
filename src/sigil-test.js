import { LSystem } from "./l-system.js";
import { rad, enumerate } from "./utils.js";

const MAX_ITERATIONS = 6;
const FW_SPEED = -4;
const ANG_SPEED = rad(25);

const REQUEST_RULE = {
  F: ["F", "[", "-", "F", "]", "F", "[", "-", "F", "]", "F"]
};
const RESPONSE_RULE = {
  F: ["F", "[", "+", "F", "]", "F", "[", "+", "F", "]", "F"]
};

const INTERFACE_RULE = {
  F: ["F", "[", "-", "X", "]", "F", "[", "+", "F", "X", "]", "F"],
  X: ["F", "X", "-", "F", "[", "+", "F", "X", "]", "[", "-", "X", "]"]
};

const lsystem = new LSystem(["F"], REQUEST_RULE);
new Array(MAX_ITERATIONS).fill(0).forEach(_ => lsystem.iterate());
console.log(lsystem.state.length);

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
c.strokeStyle = "white";

const blurCanvas = document.getElementById("blur");
const blurC = blurCanvas.getContext("2d");

const recorder = new MediaRecorder(canvas.captureStream());
const recording = [];
recorder.addEventListener("dataavailable", event => {
  recording.push(event.data);
});
recorder.addEventListener("stop", event => {
  const videoBlob = new Blob(recording, { type: "video/webm" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(videoBlob);
  link.download = "request-sigil.webm";
  link.click();
});

console.time("render");
c.clearRect(0, 0, canvas.width, canvas.height);
c.save();

c.scale(0.8, 0.8);

c.translate(400, 900);
c.beginPath();
c.moveTo(0, 0);

const render = progress => () => {
  c.lineWidth = 12 * (progress / lsystem.state.length);
  const token = lsystem.state[progress];

  switch (token) {
    case "F":
      c.moveTo(0, 0);
      c.lineTo(
        0,
        FW_SPEED
      );
      c.translate(0, FW_SPEED);
      c.rotate(rad(0.5));
      break;
    case "+":
      c.rotate(ANG_SPEED);
      break;
    case "-":
      c.rotate(-ANG_SPEED);
      break;
    case "[":
      c.save();
      break;
    case "]":
      c.restore();
      break;
    case "X":
    default:
      break;
  }

  c.stroke();

  if (progress < lsystem.state.length) {
    console.log(progress);
    requestAnimationFrame(render(progress + 1));
  } else {
    console.log("ending");
    console.timeEnd("render");
    c.resetTransform();
    recorder.stop();
  }
};

recorder.start();
requestAnimationFrame(render(0));
