import Matter from 'matter-js';

import Circle from '../components/Circle';
import Box from '../components/Box';

const BALL_SIZE = 50;
const PLANK_HEIGHT = 70;
const PLANK_WIDTH = 20;

const GAME_WIDTH = 650;
const GAME_HEIGHT = 340;

const BALL_START_POINT_X = GAME_WIDTH / 2 - BALL_SIZE;
const BALL_START_POINT_Y = GAME_HEIGHT / 2;
const BORDER = 15;

const PLANK_ONE_COLOR = '#a6e22c';
const PLANK_TWO_COLOR = '#7198e6';

let engine = Matter.Engine.create({ enableSleeping: false });
let world = engine.world;

// Settings

const plankSettings = {
  isStatic: true,
};

const wallSettings = {
  isStatic: true,
};

const ballSettings = {
  inertia: 0,
  friction: 0,
  frictionStatic: 0,
  frictionAir: 0,
  restitution: 1,
};

// Bodies

const bodies = {
  ball: Matter.Bodies.circle(
    BALL_START_POINT_X,
    BALL_START_POINT_Y,
    BALL_SIZE,
    {
      ...ballSettings,
      label: 'ball',
    }
  ),
  plankOne: Matter.Bodies.rectangle(
    BORDER,
    95,
    PLANK_WIDTH,
    PLANK_HEIGHT,
    {
      ...plankSettings,
      label: 'plankOne',
    }
  ),  
  plankTwo: Matter.Bodies.rectangle(
    GAME_WIDTH - 50,
    95,
    PLANK_WIDTH,
    PLANK_HEIGHT,
    { ...plankSettings, label: 'plankTwo' }
  ),  
  topWall: Matter.Bodies.rectangle(
    GAME_HEIGHT - 20,
    -30,
    GAME_WIDTH,
    BORDER,
    { ...wallSettings, label: 'topWall' }
  ),  
  bottomWall: Matter.Bodies.rectangle(
    GAME_HEIGHT - 20,
    GAME_HEIGHT + 33,
    GAME_WIDTH,
    BORDER,
    { ...wallSettings, label: 'bottomWall' }
  ),
  rightWall: Matter.Bodies.rectangle(
    GAME_WIDTH + 50,
    160,
    10,
    GAME_HEIGHT,
    { ...wallSettings, isSensor: true, label: 'rightWall' }
  ),  
  leftWall: Matter.Bodies.rectangle(-50, 160, 10, GAME_HEIGHT, {
    ...wallSettings,
    isSensor: true,
    label: 'leftWall',
  })
};

// Entities

export const entities = {
  physics: {
    engine: engine,
    world: world,
  },
  viewport: {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  score: {
    plankOne: 0,
    plankTwo: 0,
  },
  ball: {
    body: bodies.ball,
    size: [BALL_SIZE, BALL_SIZE],
    renderer: Circle,
    startingPointX: BALL_START_POINT_X,
    startingPointY: BALL_START_POINT_Y,
  },
  plankOne: {
    body: bodies.plankOne,
    size: [PLANK_WIDTH, PLANK_HEIGHT],
    color: PLANK_ONE_COLOR,
    renderer: Box,
    xAdjustment: 30,
  },
  plankTwo: {
    body: bodies.plankTwo,
    size: [PLANK_WIDTH, PLANK_HEIGHT],
    color: PLANK_TWO_COLOR,
    renderer: Box,
    type: 'rightPlank',
    xAdjustment: -33,
  },
  topWall: {
    body: bodies.topWall,
    size: [GAME_WIDTH, 10],
    color: '#f9941d',
    renderer: Box,
    yAdjustment: -30,
  },
  bottomWall: {
    body: bodies.bottomWall,
    size: [GAME_WIDTH, 10],
    color: '#f9941d',
    renderer: Box,
    yAdjustment: 58,
  },
  leftWall: {
    body: bodies.leftWall,
    size: [5, GAME_HEIGHT],
    color: '#333',
    renderer: Box,
    xAdjustment: 0,
  },
  rightWall: {
    body: bodies.rightWall,
    size: [5, GAME_HEIGHT],
    color: '#333',
    renderer: Box,
    xAdjustment: 0,
  },
};