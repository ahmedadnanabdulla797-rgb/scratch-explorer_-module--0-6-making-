import { Module, LessonStatus } from './types';

export const FULL_CURRICULUM: Module[] = [
  {
    id: 'module-1',
    title: 'Module 1: Coordinates',
    lessons: [
      {
        id: '1.2',
        title: 'Level 1: Treasure Hunt', 
        description: 'Type the code to move the cat!',
        type: 'project',
        status: LessonStatus.AVAILABLE,
        stars: 300,
        content: 'COORDINATE_GAME'
      },
      {
        id: '1.3',
        title: 'Level 2: Map Quiz',
        description: 'Do you know the secret codes?',
        type: 'quiz',
        status: LessonStatus.AVAILABLE,
        stars: 150,
        content: 'QUIZ_COORDINATES'
      }
    ]
  },
  {
    id: 'module-2',
    title: 'Module 2: Magic Rules',
    lessons: [
      {
        id: '2.2',
        title: 'Level 1: Rule Maker',
        description: 'Connect rules to make the cat dance!',
        type: 'project',
        status: LessonStatus.AVAILABLE,
        stars: 400,
        content: 'EVENTS_GAME'
      },
      {
        id: '2.3',
        title: 'Level 2: Rules Quiz',
        description: 'Can you match the magic blocks?',
        type: 'quiz',
        status: LessonStatus.AVAILABLE,
        stars: 150,
        content: 'QUIZ_EVENTS'
      }
    ]
  },
  {
    id: 'module-3',
    title: 'Module 3: Robot Brains',
    lessons: [
      {
        id: '3.1',
        title: 'Level 1: Do It Again!',
        description: 'Make Kit dance over and over.',
        type: 'project',
        status: LessonStatus.AVAILABLE,
        stars: 250,
        content: 'LOOP_GAME_EASY'
      },
      {
        id: '3.2',
        title: 'Level 2: Loop Quiz',
        description: 'Checking your loop skills!',
        type: 'quiz',
        status: LessonStatus.AVAILABLE,
        stars: 150,
        content: 'QUIZ_MODULE_3'
      },
      {
        id: '3.3',
        title: 'Level 3: Thinking Robot',
        description: 'Teach Kit to turn at the walls!',
        type: 'project',
        status: LessonStatus.AVAILABLE,
        stars: 300,
        content: 'CONDITION_GAME_EASY'
      },
      {
        id: '3.4',
        title: 'Level 4: Brain Quiz',
        description: 'Does the robot have a brain?',
        type: 'quiz',
        status: LessonStatus.AVAILABLE,
        stars: 150,
        content: 'QUIZ_CONDITIONS'
      }
      {
    id: 'module-5',
    title: 'Module 5: Game Master',
    lessons: [
      {
        id: '5.1',
        title: 'Level 1: Big Boss Maze',
        description: 'Help the cat find the home! 🏠',
        type: 'project',
        status: LessonStatus.AVAILABLE,
        stars: 800,
        content: 'MAZE_GAME_EASY'
      },
      {
        id: '5.2',
        title: 'Level 2: Win Quiz',
        description: 'Pick the happy cat! 🐱',
        type: 'quiz',
        status: LessonStatus.AVAILABLE,
        stars: 200,
        content: 'QUIZ_MODULE_5'
      }
    ]
  },
  {
    id: 'module-6',
    title: 'Module 6: Super Creator',
    lessons: [
      {
        id: '6.1',
        title: 'Level 1: Magic Party',
        description: 'Make everything move at once! 🎉',
        type: 'project',
        status: LessonStatus.AVAILABLE,
        stars: 1000,
        content: 'PLAYGROUND_EASY'
      },
      {
        id: '6.2',
        title: 'Level 2: Master Gift',
        description: 'You are the best coder! 👑',
        type: 'quiz',
        status: LessonStatus.AVAILABLE,
        stars: 500,
        content: 'QUIZ_MODULE_6'
      }
    ]
  }
];
