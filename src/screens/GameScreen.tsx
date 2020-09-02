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

const PLANK_ONE_COLOR = '#a6e22c';
const PLANK_TWO_COLOR = '#7198e6';

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
    console.debug(move);

    if (move.event.locationX < GAME_WIDTH / 2) {
      // Swipe was on left hand side, move plankOne
      const newPosition = {
        x: plankOne.position.x,
        y: plankOne.position.y + move.delta.pageY,
      };
      Matter.Body.setPosition(plankOne, newPosition);
    } else {
      // Swipe was on right hand side, move plankTwo
      const newPosition = {
        x: plankTwo.position.x,
        y: plankTwo.position.y + move.delta.pageY,
      };
      Matter.Body.setPosition(plankTwo, newPosition);      
    }
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
  plankOneScore: {
    fontSize: 40,
    fontWeight: 'bold',
    color: PLANK_ONE_COLOR,
  },
  plankTwoScore: {
    fontSize: 40,
    fontWeight: 'bold',
    color: PLANK_TWO_COLOR,
  },
});

export default class Game extends Component {
  state = {
    plankOneScore: 0,
    plankTwoScore: 0,
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
      color: PLANK_ONE_COLOR,
      renderer: Box,
      xAdjustment: 30,
    },
    playerTwoPlank: {
      body: plankTwo,
      size: [PLANK_WIDTH, PLANK_HEIGHT],
      color: PLANK_TWO_COLOR,
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

  componentDidMount() {
    Matter.Body.setVelocity(ball, { x: 3, y: 0 });
    Matter.Sleeping.set(ball, false);

    Matter.Events.on(engine, 'collisionStart', event => {
      var pairs = event.pairs;

      var objectA = pairs[0].bodyA.label;
      var objectB = pairs[0].bodyB.label;

      // If ball hits the right wall, score a point for plankOne and reset ball
      if (objectA == 'ball' && objectB == 'rightWall') {
        this.setState(
          { plankOneScore: +this.state.plankOneScore +1 },
          () => {
            Matter.Body.setPosition(ball, {
              x: BALL_START_POINT_X,
              y: BALL_START_POINT_Y,
            });
          }
        );
      }

      // If ball hits the right wall, score a point for plankTwo and reset ball
      if (objectA == 'ball' && objectB == 'leftWall') {
        this.setState(
          { plankTwoScore: +this.state.plankTwoScore +1 },
          () => {
            Matter.Body.setPosition(ball, {
              x: BALL_START_POINT_X,
              y: BALL_START_POINT_Y,
            });
          }
        );
      }

      // If either player has reached the winning score, stop moving the ball
      if (this.state.plankOneScore == WINNING_SCORE || this.state.plankTwoScore == WINNING_SCORE) {
        Matter.Sleeping.set(ball, true);
      }
    })
  }

  render() {
    return (
      <GameEngine
        style={styles.container}
        systems={[onPhysics, onMovePlank]}
        entities={this.entities}>
        <View style={styles.scoresContainer}>
          <View style={styles.score}>
            <Text style={styles.plankOneScore}>{this.state.plankOneScore}</Text>
            <Text style={styles.plankTwoScore}> {this.state.plankTwoScore}</Text>
          </View>
        </View>
      </GameEngine>
    );
  }
}
