import React from 'react';

interface ThreeSceneProps {
  theme: 'light' | 'dark';
  isVisible: boolean;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({
  theme: _theme,
  isVisible: _isVisible,
}) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Three.js implementation will be added later */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        3D Scene Placeholder
      </div>
    </div>
  );
};

export default ThreeScene;
