# Nova Curriculum Implementation Plan

## Overview

Nova is structured around the UK GCSE curriculum for Maths, English Language, and English Literature, with support for AQA and Pearson Edexcel pathways.

## Curriculum Model

```
Subject → Exam Board → Tier/Pathway → Strand → Topic → Objective → Question/Explanation/Assessment
```

## Data Model (Implemented)

### Types (`lib/curriculumTypes.ts`, `lib/types.ts`)

- **ExamBoard**: `'AQA' | 'Pearson Edexcel'`
- **Subject**: `'Mathematics' | 'English Language' | 'English Literature' | 'English'`
- **Objective**: id, subject, strand, topicId, topicTitle, examBoards[], tier?, prerequisites, difficulty, keywords
- **Mastery**: objectiveId, status, attempts, correctAttempts, streakCorrect, lastPracticedAt
- **LiteratureSetText**, **PoetryAnthology**, **ClassLiteratureConfig** (for configurable set texts)

### Folder Structure

```
lib/
  curriculum/
    objectives.ts      # Maths objectives (AQA & Edexcel)
    englishObjectives.ts # English Language & Literature objectives
    index.ts
  curriculumTypes.ts   # Curriculum-specific types
  types.ts             # Core types (extends curriculum)
  seedData.ts          # Question templates, default profile
  services.ts          # curriculumService, masteryService, etc.
```

## Phased Implementation

### Phase 1: Data Model & Seed Data ✅

- [x] Curriculum types (ExamBoard, Subject, Strand, Topic, Objective)
- [x] Maths objectives with exam board tags, topics, tiers
- [x] English Language objectives (skills-based)
- [x] English Literature objectives (text families, essay skills)
- [x] Question templates for practice

### Phase 2: Services & Backend ✅

- [x] curriculumService: getObjectivesBySubject, getStrandsForSubject, getObjectivesByExamBoard
- [x] masteryService: strand-level and subject-level reporting
- [x] Support for 'English' as aggregate of Language + Literature

### Phase 3: Student Experience ✅

- [x] Student dashboard with curriculum context
- [x] Practice page with objective-based questions
- [x] Learning map by strand
- [x] Chat scope by subject/objective

### Phase 4: Teacher & Org Analytics ✅

- [x] Student Nova Agent with curriculum-linked context packet
- [x] Teacher dashboard with strand progress
- [x] Org dashboard with curriculum-level reporting

### Phase 5: Production Readiness (Next)

- [ ] Real teacher/class/student entities (replace mockData)
- [ ] Exam board and tier selection per class
- [ ] Literature set text configuration per class
- [ ] Attendance, notes, payments scaffolding
- [ ] Persistence layer (Firebase or DB)

## Seed Data Examples

### Maths (AQA & Edexcel)

- **Number**: BIDMAS, factors/primes, FDP, percentages, indices, standard form, bounds
- **Algebra**: expressions, expanding, factorising, linear equations, quadratics, sequences, graphs
- **Geometry**: angles, Pythagoras, trigonometry, area, circles, transformations
- **Ratio**: ratios, proportion, rates
- **Statistics**: averages, frequency tables, scatter graphs
- **Probability**: basic probability, tree diagrams

### English Language

- **Reading**: retrieval, inference, language analysis, structure analysis, comparing, evaluating, summary
- **Writing**: transactional, descriptive, narrative, audience/purpose/form
- **SPaG**: sentence control, editing

### English Literature

- **Shakespeare**: context, character analysis, quotation knowledge
- **19th-century novel**: context, language/structure
- **Modern prose/drama**: themes, context
- **Poetry anthology**: analysis, comparison
- **Unseen poetry**: analysis, comparison
- **Essay skills**: planning, timed response

## Student Nova Agent Context

For each student, the agent receives:

- **Mastery by strand**: Maths (6 strands), English Language (3), English Literature (6)
- **Weakest objectives**: per subject, with status
- **Next recommended objectives**: curriculum-aware
- **Engagement**: last active, streak, minutes this week
- **Evidence**: exam pathway, maths tier

## Extending the Curriculum

1. Add objectives to `lib/curriculum/objectives.ts` or `englishObjectives.ts`
2. Add question templates to `lib/seedData.ts` for practice
3. Ensure `examBoards`, `topicId`, `topicTitle` are set
4. Mastery is created automatically for new objectives via `createInitialMastery`
