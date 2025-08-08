import { useState, useEffect } from 'react';
import type { DeviceType, InputMethod } from '@/types/types';

/**
 * Hook to detect device type and primary input method
 * @returns Object containing device type and input method information
 */
const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [inputMethod, setInputMethod] = useState<InputMethod>('keyboard');

  useEffect(() => {
    // Detect if device is mobile
    const checkDeviceType = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || (window.innerWidth <= 768);
      
      setDeviceType(isMobile ? 'mobile' : 'desktop');
      setInputMethod(isMobile ? 'touch' : 'keyboard');
    };

    // Initial check
    checkDeviceType();

    // Listen for touch events to detect touch capability
    const handleTouch = () => {
      setInputMethod('touch');
      window.removeEventListener('touchstart', handleTouch);
    };

    // Listen for keyboard events to confirm keyboard usage
    const handleKeyDown = () => {
      if (deviceType === 'desktop') {
        setInputMethod('keyboard');
        window.removeEventListener('keydown', handleKeyDown);
      }
    };

    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', checkDeviceType);

    return () => {
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', checkDeviceType);
    };
  }, [deviceType]);

  return {
    isMobile: deviceType === 'mobile',
    isDesktop: deviceType === 'desktop',
    isTouch: inputMethod === 'touch',
    isKeyboard: inputMethod === 'keyboard',
    deviceType,
    inputMethod
  };
};

export default useDeviceType;