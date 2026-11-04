import { Composition } from "remotion";
import { Lesson1, LESSON1_FRAMES } from "./Lesson1";
import { framesFor, GenericLesson } from "./Generic";
import { LESSONS } from "./lessons";
import { FPS } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="b-1" component={Lesson1} durationInFrames={LESSON1_FRAMES} fps={FPS} width={1280} height={720} />
      {LESSONS.map((L) => (
        <Composition key={L.id} id={L.id} component={GenericLesson} defaultProps={{ L }} durationInFrames={framesFor(L.id)} fps={FPS} width={1280} height={720} />
      ))}
    </>
  );
};
