'use client';

import { useState } from 'react';

export const useLocationSharing = () => {
  const [locationLink, setLocationLink] = useState<string | null>(null);

  const getLocationLink = async (): Promise<string | undefined> => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const link = `https://maps.google.com/?q=${latitude},${longitude}`;
          setLocationLink(link);
          resolve(link);
        },
        (error) => {
          alert('Failed to get location: ' + error.message);
          reject();
        }
      );
    });
  };

  return { locationLink, getLocationLink };
};
