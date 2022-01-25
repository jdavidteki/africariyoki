import { StyleSheet } from 'react-native';

export const styles = (backgroundImageURL) => StyleSheet.create({
  backgroundOverlay: {
    backgroundColor: '#0000008f',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'relative',
    zIndex: 1,
	},

  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundColor: '#f7f8e4',
		backgroundImage: `url(${backgroundImageURL})`,
  }
})