import Matter, { IEventCollision } from 'matter-js';
import { entities } from '../entities/entities';
import { play, sounds } from './sound';
import { GameEngineUpdateEventOptionType } from 'react-native-game-engine';

const WINNING_SCORE = 5;

// Physics system
// Update Matter.js world with each tick
export const onPhysics = (entities: any, { time }: GameEngineUpdateEventOptionType ) => {
  let engine = entities.physics.engine;
  engine.world.gravity.y = 0;
  Matter.Engine.update(engine, time.delta);

  return entities;
};

// Touch system
// Find if there are inputs, map those to the right player, and update position in space
export const onTouch = (entities: any, { touches }: GameEngineUpdateEventOptionType ) => {
  let move = touches.find((x: { type: string }) => x.type === 'move');
  if (move && move.delta) {
    if (move.event.locationX < entities.viewport.width / 2) {
      // Swipe was on left hand side, move plankOne
      const newPosition = {
        x: entities.plankOne.body.position.x,
        y: entities.plankOne.body.position.y + move.delta.pageY,
      };
      Matter.Body.setPosition(entities.plankOne.body, newPosition);
    } else {
      // Swipe was on right hand side, move plankTwo
      const newPosition = {
        x: entities.plankTwo.body.position.x,
        y: entities.plankTwo.body.position.y + move.delta.pageY,
      };
      Matter.Body.setPosition(entities.plankTwo.body, newPosition);      
    }
  }

  return entities;
};

// Collision system
// For each collision that happens, update scores
export const onCollision = (event: IEventCollision<Matter.Engine>) => {
  var pairs = event.pairs;

  var objectA = pairs[0].bodyA.label;
  var objectB = pairs[0].bodyB.label;

  // If ball hits plank one, play boop
  if (objectA == 'ball' && objectB == 'plankOne') {
    play(sounds[2]);
  }

  // If ball hits plank one, play beep
  if (objectA == 'ball' && objectB == 'plankTwo') {
    play(sounds[3]);
  }

  // If ball hits the right wall, score a point for plankOne, play bleep, and reset ball
  if (objectA == 'ball' && objectB == 'rightWall') {
    entities.score.plankOne += 1;
    play(sounds[0]);
    Matter.Body.setPosition(entities.ball.body, {
          x: entities.ball.startingPointX,
          y: entities.ball.startingPointY,
        });
    }

    // If ball hits the left wall, score a point for plankTwo, play bloop, and reset ball
    if (objectA == 'ball' && objectB == 'leftWall') {
      entities.score.plankTwo += 1;
      play(sounds[1]);
      Matter.Body.setPosition(entities.ball.body, {
        x: entities.ball.startingPointX,
        y: entities.ball.startingPointY,
      });
    }

  // If either player has reached the winning score, stop moving the ball
  if (entities.score.plankOne >= WINNING_SCORE || entities.score.plankTwo >= WINNING_SCORE) {
    Matter.Sleeping.set(entities.ball.body, true);
  }

  console.info('New score: ', entities.score);
}