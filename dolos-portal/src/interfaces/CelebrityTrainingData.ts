import {PromptCompletion} from "./PromptCompletion";

export interface CelebrityTrainingData {
  guest: string;
  image: string;
  prompts: PromptCompletion[];
}