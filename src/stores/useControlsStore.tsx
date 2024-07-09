// stores/useControlsStore.tsx
import { create } from 'zustand';
import { produce } from 'immer';

export const useControlsStore = create((set) => ({
  cameraAccess: false, // for status
  cameraFeed: false, // for control
  handReady: false, // check if the handPose model is ready
  leftHand: false, // check the existence
  rightHand: false, // check the existence
  cameraSize: [0, 0],
  currentPoseL: "",
  currentPoseR: "",
  currentActionL: "",
  currentActionR: "",
  handIndicatorType: "skeleton", // skeleton, points, cursor, blurred, blurDot
  handCursorType: ["➤", 24],
  handBlur: 0,
  handColor: "#0066FF",
  backgroundType: "dots", //dots, grid, none
  playgroundBgColor: "#f3f3f3",
  fingersL: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //thumb to pinky + index middlepoint
  fingersR: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //thumb to pinky + index middlepoint
  clearBtn: false,
  currentTab: "none", // none, control, rules, invite
  toggleTemplate: false,
  clearFingersL: () =>
      set((state: { fingersL: number[] }) => ({ fingersL: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] })),
  clearFingersR: () =>
      set((state: { fingersR: number[] }) => ({ fingersR: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] })),
  drawMode: false,
}));