import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { images, colors } from '@/theme';

interface NavigationHeaderTitleProps {
  title?: string;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
});

export default function NavigationHeaderTitle({ title }: NavigationHeaderTitleProps) {
  if (title) {
    return (
      <View style={styles.container}>
        <Image source={images.logo} style={styles.logo} />
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  }

  return <Image source={images.logo} style={styles.logo} />;
}
