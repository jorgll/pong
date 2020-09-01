/* eslint-disable no-shadow */
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Circle from '../components/Circle';
import Box from '../components/Box';

import Matter from 'matter-js';

const BALL_SIZE = 50;
const PLANK_HEIGHT = 70;
const PLANK_WIDTH = 20;

const GAME_WIDTH = 650;
const GAME_HEIGHT = 340;

const BALL_START_POINT_X = GAME_WIDTH / 2 - BALL_SIZE;
const BALL_START_POINT_Y = GAME_HEIGHT / 2;
const BORDER = 15;

const WINNING_SCORE = 5;

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

const ball = Matter.Bodies.circle(
  BALL_START_POINT_X,
  BALL_START_POINT_Y,
  BALL_SIZE,
  {
    ...ballSettings,
    label: 'ball',
  }
);

const plankOne = Matter.Bodies.rectangle(
  BORDER,
  95,
  PLANK_WIDTH,
  PLANK_HEIGHT,
  {
    ...plankSettings,
    label: 'plankOne',
  }
);

const plankTwo = Matter.Bodies.rectangle(
  GAME_WIDTH - 50,
  95,
  PLANK_WIDTH,
  PLANK_HEIGHT,
  { ...plankSettings, label: 'plankTwo' }
);

const topWall = Matter.Bodies.rectangle(
  GAME_HEIGHT - 20,
  -30,
  GAME_WIDTH,
  BORDER,
  { ...wallSettings, label: 'topWall' }
);

const bottomWall = Matter.Bodies.rectangle(
  GAME_HEIGHT - 20,
  GAME_HEIGHT + 33,
  GAME_WIDTH,
  BORDER,
  { ...wallSettings, label: 'bottomWall' }
);

const rightWall = Matter.Bodies.rectangle(
  GAME_WIDTH + 50,
  160,
  10,
  GAME_HEIGHT,
  { ...wallSettings, isSensor: true, label: 'rightWall' }
);

const leftWall = Matter.Bodies.rectangle(-50, 160, 10, GAME_HEIGHT, {
  ...wallSettings,
  isSensor: true,
  label: 'leftWall',
});

const planks = {
  plankOne: plankOne,
  plankTwo: plankTwo,
};

let engine = Matter.Engine.create({ enableSleeping: false });
let world = engine.world;

const onPhysics = (entities: any, { time }: any) => {
  let engine = entities.physics.engine;
  engine.world.gravity.y = 0;
  Matter.Engine.update(engine, time.delta);
  return entities;
};

const onMovePlank = (entities: any, { touches }: any) => {
  let move = touches.find((x: { type: string }) => x.type === 'move');
  if (move) {
    const newPosition = {
      x: plankOne.position.x,
      y: plankOne.position.y + move.delta.pageY,
    };
    Matter.Body.setPosition(plankOne, newPosition);
  }

  return entities;
};

const styles = StyleSheet.create({
  container: {
    width: 650,
    height: 340,
    backgroundColor: '#FFF',
    alignSelf: 'center',
  },
  scoresContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    flexDirection: 'row',
  },
  scoreLabel: {
    fontSize: 20,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default class Game extends Component {
  state = {
    myScore: 0,
    opponentScore: 0,
  };

  entities = {
    physics: {
      engine: engine,
      world: world,
    },
    pongBall: {
      body: ball,
      size: [BALL_SIZE, BALL_SIZE],
      renderer: Circle,
    },
    playerOnePlank: {
      body: plankOne,
      size: [PLANK_WIDTH, PLANK_HEIGHT],
      color: '#a6e22c',
      renderer: Box,
      xAdjustment: 30,
    },
    playerTwoPlank: {
      body: plankTwo,
      size: [PLANK_WIDTH, PLANK_HEIGHT],
      color: '#7198e6',
      renderer: Box,
      type: 'rightPlank',
      xAdjustment: -33,
    },
    theCeiling: {
      body: topWall,
      size: [GAME_WIDTH, 10],
      color: '#f9941d',
      renderer: Box,
      yAdjustment: -30,
    },
    theFloor: {
      body: bottomWall,
      size: [GAME_WIDTH, 10],
      color: '#f9941d',
      renderer: Box,
      yAdjustment: 58,
    },
    theLeftWall: {
      body: leftWall,
      size: [5, GAME_HEIGHT],
      color: '#333',
      renderer: Box,
      xAdjustment: 0,
    },
    theRightWall: {
      body: rightWall,
      size: [5, GAME_HEIGHT],
      color: '#333',
      renderer: Box,
      xAdjustment: 0,
    },
  };

  movePlankInterval: any = null;
  myPlankColor: string = 'Pong';
  myplank = planks.plankOne;

  constructor(props: any) {
    super(props);

    this.movePlankInterval = null;
    this.setupWorld();
  }

  setupWorld() {
    Matter.World.add(world, [
      ball,
      plankOne,
      plankTwo,
      topWall,
      bottomWall,
      leftWall,
      rightWall,
    ]);
  }

  render() {
    return (
      <GameEngine
        style={styles.container}
        systems={[onPhysics, onMovePlank]}
        entities={this.entities}>
        <View style={styles.scoresContainer}>
          <View style={styles.score}>
            <Text style={styles.scoreLabel}>{this.myPlankColor}</Text>
            <Text style={styles.scoreValue}> {this.state.myScore}</Text>
          </View>
        </View>
      </GameEngine>
    );
  }
}
