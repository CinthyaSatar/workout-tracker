import React from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar as RNStatusBar,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../utils/theme';

/**
 * AppLayout - A consistent layout wrapper for all screens
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The screen content
 * @param {string} props.backgroundColor - Background color of the screen
 * @param {boolean} props.noSafeArea - Whether to disable SafeAreaView
 * @param {Object} props.style - Additional styles for the container
 */
export default function AppLayout({ 
  children, 
  backgroundColor = colors.background,
  noSafeArea = false,
  style = {}
}) {
  const Container = noSafeArea ? View : SafeAreaView;
  
  return (
    <Container style={[
      styles.container, 
      { backgroundColor },
      style
    ]}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        {children}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
  },
});
