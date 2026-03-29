/**
 * GCSE Curriculum - AQA & Pearson Edexcel
 * Subject → Exam Board → Tier → Strand → Topic → Objective
 */

export { mathsObjectivesAqaEdexcel } from './objectives';
export { englishLanguageObjectives, englishLiteratureObjectives } from './englishObjectives';

import { mathsObjectivesAqaEdexcel } from './objectives';
import { englishLanguageObjectives, englishLiteratureObjectives } from './englishObjectives';

export const allCurriculumObjectives = [
  ...mathsObjectivesAqaEdexcel,
  ...englishLanguageObjectives,
  ...englishLiteratureObjectives,
];
