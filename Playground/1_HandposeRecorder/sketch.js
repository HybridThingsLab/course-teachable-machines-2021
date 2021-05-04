// webcam
let video;

// handpose
let handpose;
let poses = [];
let recordedPoses = [];
let recordedPosesCounter = 0;
let recording = false;
let animationCounter = [];


function setup() {

  // canvas
  const canvas = createCanvas(640, 480);
  canvas.parent('canvas');

  // init webcam
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // init handpose, see also https://google.github.io/mediapipe/solutions/hands.html

  // options
  const options = {
    flipHorizontal: true, // boolean value for if the video should be flipped, defaults to false
    maxContinuousChecks: Infinity, // How many frames to go without running the bounding box detector. Defaults to infinity, but try a lower value if the detector is consistently producing bad predictions.
    detectionConfidence: 0.8, // Threshold for discarding a prediction. Defaults to 0.8.
    scoreThreshold: 0.75, // A threshold for removing multiple (likely duplicate) detections based on a "non-maximum suppression" algorithm. Defaults to 0.75
    iouThreshold: 0.3, // A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3.
  }
  handpose = ml5.handpose(video, options, modelReady);

  select('#output').html('... loading model');

  // detect if new pose detected and call 'gotResultModel'
  handpose.on('predict', gotResultsModel);

  // Hide the video element, and just show the canvas
  video.hide();

}


function draw() {
  // clear background
  background(0);

  // show video (flipped)
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  // show results of handpose (just if not recording)
  drawKeypoints();
  drawSkeleton();

  fill(255, 0, 0);
  textSize(20);
  text("recording: " + recording, 20, 20);

  // show recorded hand poses

  // work with variable loop lenght here
  let loopLength = recordedPoses.length;
  // do not show active recording if recording
  if (recording) loopLength = recordedPoses.length - 1;
  for (let i = 0; i < loopLength; i++) {

    let currentPose = recordedPoses[i][animationCounter[i]];

    // counter for animation
    animationCounter[i]++;
    if (animationCounter[i] >= recordedPoses[i].length) animationCounter[i] = 0;

    // just if there is something recorded
    if (currentPose != undefined) {
      // do not draw currently recording pose > ToDo
      drawRecordedKeypoints(currentPose);
      drawRecordedSkeletons(currentPose);
    }
  }
}

//////////////////////////////
// Visualization Recordings //
//////////////////////////////

// keypoints
function drawRecordedKeypoints(pose) {
  for (let i = 0; i < pose.landmarks.length; i += 1) {
    const keypoint = pose.landmarks[i];
    fill(255, 0, 0);
    noStroke();
    ellipse(keypoint[0], keypoint[1], 10, 10);
  }
}

// skeleton
function drawRecordedSkeletons(pose) {

  let annotations = pose.annotations;
  stroke(255, 0, 0);
  for (let j = 0; j < annotations.thumb.length - 1; j++) {
    line(annotations.thumb[j][0], annotations.thumb[j][1], annotations.thumb[j + 1][0], annotations.thumb[j + 1][1]);
  }
  for (let j = 0; j < annotations.indexFinger.length - 1; j++) {
    line(annotations.indexFinger[j][0], annotations.indexFinger[j][1], annotations.indexFinger[j + 1][0], annotations.indexFinger[j + 1][1]);
  }
  for (let j = 0; j < annotations.middleFinger.length - 1; j++) {
    line(annotations.middleFinger[j][0], annotations.middleFinger[j][1], annotations.middleFinger[j + 1][0], annotations.middleFinger[j + 1][1]);
  }
  for (let j = 0; j < annotations.ringFinger.length - 1; j++) {
    line(annotations.ringFinger[j][0], annotations.ringFinger[j][1], annotations.ringFinger[j + 1][0], annotations.ringFinger[j + 1][1]);
  }
  for (let j = 0; j < annotations.pinky.length - 1; j++) {
    line(annotations.pinky[j][0], annotations.pinky[j][1], annotations.pinky[j + 1][0], annotations.pinky[j + 1][1]);
  }

  line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.thumb[0][0], annotations.thumb[0][1]);
  line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.indexFinger[0][0], annotations.indexFinger[0][1]);
  line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.middleFinger[0][0], annotations.middleFinger[0][1]);
  line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.ringFinger[0][0], annotations.ringFinger[0][1]);
  line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.pinky[0][0], annotations.pinky[0][1]);

}


// model ready
function modelReady() {
  select('#output').html('model loaded');
}

// results of current model (p.ex. PoseNet, handpose, facemesh...)
function gotResultsModel(result) {
  poses = result;
  // just update optimized input data if new input data available
  if (poses.length > 0) {
    if (recording) {
      recordedPoses[recordedPosesCounter].push(poses[0]);
    }
  }
}

////////////////////////////
// Visualization handpose //
////////////////////////////

// draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < poses.length; i++) {
    const pose = poses[i];

    // have a detailed look in your console
    // console.log(pose);

    for (let j = 0; j < pose.landmarks.length; j += 1) {
      const keypoint = pose.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}

// draw the skeletons
function drawSkeleton() {

  for (let i = 0; i < poses.length; i++) {
    //onst pose = poses[i];
    let annotations = poses[0].annotations;
    stroke(0, 255, 0);
    for (let j = 0; j < annotations.thumb.length - 1; j++) {
      line(annotations.thumb[j][0], annotations.thumb[j][1], annotations.thumb[j + 1][0], annotations.thumb[j + 1][1]);
    }
    for (let j = 0; j < annotations.indexFinger.length - 1; j++) {
      line(annotations.indexFinger[j][0], annotations.indexFinger[j][1], annotations.indexFinger[j + 1][0], annotations.indexFinger[j + 1][1]);
    }
    for (let j = 0; j < annotations.middleFinger.length - 1; j++) {
      line(annotations.middleFinger[j][0], annotations.middleFinger[j][1], annotations.middleFinger[j + 1][0], annotations.middleFinger[j + 1][1]);
    }
    for (let j = 0; j < annotations.ringFinger.length - 1; j++) {
      line(annotations.ringFinger[j][0], annotations.ringFinger[j][1], annotations.ringFinger[j + 1][0], annotations.ringFinger[j + 1][1]);
    }
    for (let j = 0; j < annotations.pinky.length - 1; j++) {
      line(annotations.pinky[j][0], annotations.pinky[j][1], annotations.pinky[j + 1][0], annotations.pinky[j + 1][1]);
    }

    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.thumb[0][0], annotations.thumb[0][1]);
    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.indexFinger[0][0], annotations.indexFinger[0][1]);
    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.middleFinger[0][0], annotations.middleFinger[0][1]);
    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.ringFinger[0][0], annotations.ringFinger[0][1]);
    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.pinky[0][0], annotations.pinky[0][1]);
  }

}

//////////////
// Recorder //
//////////////

function keyReleased() {
  // SPACE
  if (keyCode == 32) {
    if (recording) {
      recording = false;
      recordedPosesCounter++;
    } else {
      recording = true;
      // add new recording
      recordedPoses[recordedPosesCounter] = [];
      animationCounter[recordedPosesCounter] = 0;
    }
  }
}