import { Audio } from 'expo-av';

class SoundService {
  private sound: Audio.Sound | null = null;

  async loadSound() {
    if (this.sound) {
      return;
    }
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const { sound } = await Audio.Sound.createAsync(
         require('../../assets/sounds/notification.mp3')
      );
      this.sound = sound;
    } catch (error) {
      console.error('Failed to load sound', error);
    }
  }

  async playSound() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

     
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/notification.mp3'),
        { shouldPlay: true }, 
      );

      this.sound = sound;
    } catch (error) {
      console.error('Failed to play sound', error);
    }
  }

  async unloadSound() {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }
}

const soundService = new SoundService();
export default soundService; 