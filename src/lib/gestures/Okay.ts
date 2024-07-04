// lib/gestures/Okay
import {
  Finger,
  FingerCurl,
  FingerDirection,
  GestureDescription,
} from "fingerpose";

export const okayDescription = new GestureDescription("okay");

// thumb description
okayDescription.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
okayDescription.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
okayDescription.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
okayDescription.addDirection(
  Finger.Thumb,
  FingerDirection.DiagonalUpRight,
  1.0
);
okayDescription.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 1.0);

// index description
okayDescription.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
okayDescription.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
okayDescription.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
okayDescription.addDirection(
  Finger.Index,
  FingerDirection.DiagonalUpRight,
  1.0
);
okayDescription.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 1.0);

// middle description
okayDescription.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
okayDescription.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);
okayDescription.addDirection(
  Finger.Middle,
  FingerDirection.DiagonalUpLeft,
  1.0
);
okayDescription.addDirection(
  Finger.Middle,
  FingerDirection.DiagonalUpRight,
  1.0
);

// ring description
okayDescription.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
okayDescription.addDirection(Finger.Ring, FingerDirection.VerticalUp, 1.0);
okayDescription.addDirection(Finger.Ring, FingerDirection.DiagonalUpLeft, 1.0);
okayDescription.addDirection(Finger.Ring, FingerDirection.DiagonalUpRight, 1.0);

// pinky description
okayDescription.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
okayDescription.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 1.0);
okayDescription.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 1.0);
okayDescription.addDirection(Finger.Pinky, FingerDirection.DiagonalUpRight, 1.0);
