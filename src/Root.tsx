import React from "react";
import { Composition } from "remotion";
import { Video } from "./Video";
import { TOTAL_FRAMES } from "./timeline";
import { FPS } from "./lib";

export const Root: React.FC = () => (
  <Composition id="NuevaMente" component={Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} />
);
