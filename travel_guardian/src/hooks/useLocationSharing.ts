import * as Location from 'expo-location';
import { useState } from 'react';

export const useLocationSharing = () => {
  const [locationLink, setLocationLink] = useState<string | null>(null);

  const getLocationLink = async (): Promise<string | undefined> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    const link = `https://maps.google.com/?q=${latitude},${longitude}`;
    setLocationLink(link);
    return link;
  };

  return { locationLink, getLocationLink };
};
