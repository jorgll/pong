/* eslint-disable no-shadow */
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { entities } from '../entities/entities';
import { onTouch, onPhysics, onCollision } from '../systems/systems';

import Matter, { IEventCollision } from 'matter-js';

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
    color: entities.plankOne.color,
  },
  plankTwoScore: {
    fontSize: 40,
    fontWeight: 'bold',
    color: entities.plankTwo.color,
  },
});

export default class Game extends Component {
  
  state = {
    plankOneScore: entities.score.plankOne,
    plankTwoScore: entities.score.plankTwo,
  };

  constructor(props: any) {
    super(props);

    Matter.World.add(
     entities.physics.world, [
      entities.ball.body, 
      entities.bottomWall.body, 
      entities.leftWall.body, 
      entities.rightWall.body, 
      entities.topWall.body,
      entities.plankOne.body,
      entities.plankTwo.body,
    ]);
  }

  onCollision = (event: IEventCollision<Matter.Engine>) => {
    // Dispatch to collision handling system
    onCollision(event);

    // Update state with new values
    this.setState({ 
      plankOneScore: entities.score.plankOne, 
      plankTwoScore: entities.score.plankTwo
    });
  }

  componentDidMount() {
    Matter.Body.setVelocity(entities.ball.body, { x: 3, y: 0 });
    Matter.Sleeping.set(entities.ball.body, false);
    Matter.Events.on(entities.physics.engine, 'collisionStart', event => this.onCollision(event))
  }

  render() {
    return (
      <GameEngine
        style={styles.container}
        systems={[onPhysics, onTouch]}
        entities={entities}>
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
