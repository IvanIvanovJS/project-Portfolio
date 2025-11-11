import React from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
} from 'lucide-react';
import { WeatherIcon } from '../types';

/**
 * Get the appropriate weather icon component based on the icon type
 *
 * @param iconType - The weather icon type
 * @param size - The size of the icon in pixels
 * @returns React element with the appropriate weather icon
 */
export const getWeatherIcon = (
  iconType: WeatherIcon,
  size: number = 24
): React.ReactElement => {
  const iconProps = {
    size,
    strokeWidth: 2,
    className: 'weather-icon',
  };

  switch (iconType) {
    case 'sun':
      return <Sun {...iconProps} color="#FDB813" />;
    case 'moon':
      return <Moon {...iconProps} color="#A8B8D8" />;
    case 'cloud':
      return <Cloud {...iconProps} color="#B0BEC5" />;
    case 'cloud-sun':
      return <CloudSun {...iconProps} color="#FDB813" />;
    case 'cloud-moon':
      return <CloudMoon {...iconProps} color="#A8B8D8" />;
    case 'cloud-rain':
      return <CloudRain {...iconProps} color="#64B5F6" />;
    case 'cloud-drizzle':
      return <CloudDrizzle {...iconProps} color="#81C784" />;
    case 'cloud-snow':
      return <CloudSnow {...iconProps} color="#E3F2FD" />;
    case 'cloud-lightning':
      return <CloudLightning {...iconProps} color="#FFB74D" />;
    case 'fog':
      return <CloudFog {...iconProps} color="#B0BEC5" />;
    default:
      return <Cloud {...iconProps} color="#B0BEC5" />;
  }
};
