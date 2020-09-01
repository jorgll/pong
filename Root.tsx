import React, { Component } from 'react';
import { YellowBox } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import GameScreen from './src/screens/Game';

// to suppress timer warnings (has to do with Pusher)
YellowBox.ignoreWarnings(['Setting a timer']);

const RootStack = createStackNavigator(
  {
    Game: GameScreen,
  },
  {
    initialRouteName: 'Game',
  }
);

const AppContainer = createAppContainer(RootStack);

class Router extends Component {
  render() {
    return <AppContainer />;
  }
}

export default Router;