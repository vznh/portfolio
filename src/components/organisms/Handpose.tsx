// components/organisms/Handpose
import { useRef, useState, useEffect } from "react";
import { useControlsStore } from "@/stores/useControlsStore";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import * as fp from "fingerpose";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import "@tensorflow/tfjs-backend-wasm";
import Webcam from "react-webcam"; 
import { drawHand, drawPts } from "@/utils/hands";

import {
  thumbsUpDescription,
  okayDescription,
} from "@/lib/gestures";


