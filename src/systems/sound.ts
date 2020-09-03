import Sound from 'react-native-sound';
let soundObjects: any = new Array();

const load = (filename: string) => {
  const audio: Sound = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Failed to load sound ', filename, error);
    }
    console.log('Loaded sound: ', filename);
  });
  soundObjects[filename] = audio;
  console.log('load', soundObjects);
}

export const play = (sound: string): void => {
  console.log('play', soundObjects);
  soundObjects[sound].play((success: boolean) => {
    if (!success) {
      console.log('Failed at playback state');
    }
  });
}

export const sounds = [
  'blipd3.wav',
  'blipg3.wav',
  'blipd5.wav',
  'blipg5.wav',
];

// Init sounds
Sound.setCategory('Playback');
sounds.map(s => load(s));
