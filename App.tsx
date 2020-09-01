import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import GameScreen from './src/screens/GameScreen';

declare const global: { HermesInternal: null | {} };

export default class App extends Component {
  render() {
    return (
      <>
        <View style={styles.container}>
          <GameScreen />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
