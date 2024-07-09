// utils/hands 

interface FingerJointsInterface {
  [key: string]: number[];
}

interface HandStyleInterface {
  [key: number]: {
    color: string;
    size: number;
  };
}

const fingerJoints: FingerJointsInterface = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

const dotSize = 2;

const jointColor = "#87cefa";

const handStyle: HandStyleInterface = {
  0: { color: "white", size: dotSize },
  1: { color: "white", size: dotSize },
  2: { color: "white", size: dotSize },
  3: { color: "white", size: dotSize },
  4: { color: jointColor, size: dotSize },
  5: { color: "white", size: dotSize },
  6: { color: "white", size: dotSize },
  7: { color: "white", size: dotSize },
  8: { color: jointColor, size: dotSize },
  9: { color: "white", size: dotSize },
  10: { color: "white", size: dotSize },
  11: { color: "white", size: dotSize },
  12: { color: jointColor, size: dotSize },
  13: { color: "white", size: dotSize },
  14: { color: "white", size: dotSize },
  15: { color: "white", size: dotSize },
  16: { color: jointColor, size: dotSize },
  17: { color: "white", size: dotSize },
  18: { color: "white", size: dotSize },
  19: { color: "white", size: dotSize },
  20: { color: jointColor, size: dotSize },
};

export const drawHand = (predictions: any, color: string, ctx: CanvasRenderingContext2D): void => {
  // Check if predictions exist
  if (predictions.length > 0) {
    // Loop through each prediction
    for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
      let finger = Object.keys(fingerJoints)[j];

      // Loop through pairs of joints 
      for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
        // Get pairs of joints
        const firstJointIdx = fingerJoints[finger][k];
        const secondJointIdx = fingerJoints[finger][k + 1];

        // Draw path
        ctx.beginPath();
        ctx.moveTo(
          predictions[0].keypoints[firstJointIdx].x,
          predictions[0].keypoints[firstJointIdx].y
        );
        ctx.lineTo(
          predictions[0].keypoints[secondJointIdx].x,
          predictions[0].keypoints[secondJointIdx].y
        );
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Create dots
    for (let i = 0; i < predictions[0].keypoints.length; i++) {
      // Get X, Y positionings
      const x = predictions[0].keypoints[i].x;
      const y = predictions[0].keypoints[i].y;

      // Start drawing once more
      ctx.beginPath(); 
      ctx.arc(x, y, handStyle[i].size, 0, 3 * Math.PI);

      // Set line color
      ctx.fillStyle = jointColor;
      ctx.fill();
    }
  }
};

export const drawPts = (predictions: any, color: string, ctx: CanvasRenderingContext2D): void => {
  // Check if we have predictions
  if (predictions.length > 0) {
    // Loop through each prediction
    for (let i = 1; i < 6; i++) {
      // Get X, Y points
      const x = predictions[0].keypoints[i*4].x;
      const y = predictions[0].keypoints[i*4].y;

      // Start drawing
      ctx.beginPath();
      ctx.arc(x, y, handStyle[i*4].size, 0, 3 * Math.PI);

      // Set line color
      ctx.fillStyle = jointColor;
      ctx.fill();
    }
  }
};