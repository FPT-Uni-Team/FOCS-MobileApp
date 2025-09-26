import Sound from 'react-native-sound';

class SoundService {
  private sound: Sound | null = null;
  private isLoaded: boolean = false;

  async loadSound() {
    if (this.isLoaded) {
      return;
    }
    
    try {
      Sound.setCategory('Playback');

      this.sound = new Sound('notification.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          this.sound = null;
          this.isLoaded = false;
        } else {
          this.isLoaded = true;
        }
      });
    } catch (error) {
      this.isLoaded = false;
    }
  }

  async playSound() {
    try {
      if (!this.isLoaded) {
        await this.loadSound();
      }

      if (this.sound && this.isLoaded) {
        this.sound.play(() => {
        });
      } else {
        const sound = new Sound('notification.mp3', Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            return;
          }
          
          sound.play(() => {
            sound.release();
          });
        });
      }
    } catch (error) {
    }
  }

  async unloadSound() {
    if (this.sound) {
      this.sound.release();
      this.sound = null;
    }
  }
}

const soundService = new SoundService();
export default soundService; 