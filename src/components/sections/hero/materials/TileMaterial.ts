import * as THREE from 'three';

/**
 * Custom shader material for rendering technology icons on tiles
 * with glassmorphism aesthetic and glow effects
 */
export class TileMaterial extends THREE.ShaderMaterial {
  constructor(atlasTexture: THREE.Texture, atlasSize: number) {
    super({
      uniforms: {
        uAtlasTexture: { value: atlasTexture },
        uAtlasSize: { value: atlasSize },
        uTime: { value: 0 },
        uThemeColor: { value: new THREE.Color(0xbaffe9) }, // Default: cyan for dark theme
      },
      vertexShader: `
        // Per-instance attributes for UV mapping and animation
        attribute vec2 uvOffset;
        attribute vec2 uvScale;
        attribute float glowIntensity;
        attribute float animationPhase;
        
        // Varying variables passed to fragment shader
        varying vec2 vUv;
        varying float vGlow;
        varying float vAnimPhase;
        
        void main() {
          // Calculate UV coordinates from atlas using offset and scale
          // Flip both U and V coordinates to correct orientation
          vec2 flippedUv = vec2(uv.x, 1.0 - uv.y); // Flip V coordinate

          vUv = flippedUv * uvScale + uvOffset;
          
          // Pass glow intensity to fragment shader
          vGlow = glowIntensity;
          
          // Pass animation phase for time-based effects
          vAnimPhase = animationPhase;
          
          // Apply instance matrix for proper tile positioning
          vec4 instancePosition = instanceMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * instancePosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uAtlasTexture;
        uniform vec3 uThemeColor;
        uniform float uTime;
        
        varying vec2 vUv;
        varying float vGlow;
        varying float vAnimPhase;
        
        void main() {
          // Sample texture atlas at correct UV coordinates
          vec4 iconColor = texture2D(uAtlasTexture, vUv);
          
          // Glassmorphism base color (blend icon with white/glass)
          // Use the icon color directly with some brightness boost
          vec3 glassColor = iconColor.rgb * 1.5; // Boost brightness
          
          // Add emissive glow using theme color and glow intensity
          vec3 glowColor = uThemeColor * vGlow * 0.3;
          vec3 finalColor = glassColor + glowColor;
          
          // Use full opacity for now to see the icons
          float alpha = max(iconColor.a, 0.9);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: true, // Enable depth writing for proper sorting
      depthTest: true, // Enable depth testing
    });
  }

  /**
   * Update the time uniform for time-based animations
   */
  updateTime(time: number): void {
    this.uniforms.uTime.value = time;
  }

  /**
   * Update the theme color for light/dark mode transitions
   * @param isDark - Whether dark theme is active
   */
  updateThemeColor(isDark: boolean): void {
    // Cyan (#baffe9) for dark theme, orange (#ff8800) for light theme
    const color = isDark ? 0xbaffe9 : 0xff8800;
    this.uniforms.uThemeColor.value.setHex(color);
  }

  /**
   * Set a custom theme color
   */
  setThemeColor(color: THREE.Color): void {
    this.uniforms.uThemeColor.value.copy(color);
  }
}
