import React from 'react';
import { View, StyleSheet } from 'react-native';

const GAME_WIDTH = 650;
const GAME_HEIGHT = 340;

const BODY_DIAMETER = Math.trunc(Math.max(GAME_WIDTH, GAME_HEIGHT) * 0.05);
const BORDER_WIDTH = Math.trunc(BODY_DIAMETER * 0.1);

const styles = StyleSheet.create({
  head: {
    backgroundColor: '#FF5877',
    borderColor: '#FFC1C1',
    borderWidth: BORDER_WIDTH,
    width: BODY_DIAMETER,
    height: BODY_DIAMETER,
    position: 'absolute',
    borderRadius: BODY_DIAMETER * 2,
  },
});

const Circle = ({ body }: any) => {
  const { position } = body;

  const x = position.x - BODY_DIAMETER / 2;
  const y = position.y - BODY_DIAMETER / 2;
  return <View style={[styles.head, { left: x, top: y }]} />;
};

export default Circle;
