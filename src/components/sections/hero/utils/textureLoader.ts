import * as THREE from 'three';

/**
 * Represents the frame data for a single icon in the texture atlas
 */
export interface IconFrame {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Metadata structure for the texture atlas
 */
export interface AtlasMetadata {
  meta: {
    version: string;
    size: number;
    iconSize: number;
    padding: number;
    count: number;
  };
  frames: Record<string, IconFrame>;
}

/**
 * Complete loaded atlas with texture, metadata, and icon names
 */
export interface LoadedAtlas {
  texture: THREE.Texture;
  metadata: AtlasMetadata;
  iconNames: string[];
}

/**
 * Loads the icon texture atlas and its metadata from the public directory
 *
 * @returns Promise resolving to LoadedAtlas or null on failure
 * @throws Error if loading fails (caught internally and returns null)
 */
export async function loadIconAtlas(): Promise<LoadedAtlas | null> {
  const ATLAS_TEXTURE_PATH = '/textures/icons.v1.png';
  const ATLAS_METADATA_PATH = '/textures/icons.v1.json';
  const LOAD_TIMEOUT = 10000; // 10 seconds

  try {
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(
        () => reject(new Error('Atlas loading timeout')),
        LOAD_TIMEOUT
      );
    });

    // Load texture and metadata in parallel with timeout
    const [texture, metadataResponse] = await Promise.race([
      Promise.all([
        loadTexture(ATLAS_TEXTURE_PATH),
        fetch(ATLAS_METADATA_PATH),
      ]),
      timeoutPromise,
    ]);

    // Parse metadata JSON
    if (!metadataResponse.ok) {
      throw new Error(
        `Failed to fetch metadata: ${metadataResponse.status} ${metadataResponse.statusText}`
      );
    }

    const metadata: AtlasMetadata = await metadataResponse.json();

    // Validate metadata structure
    if (
      !metadata.meta ||
      !metadata.frames ||
      typeof metadata.frames !== 'object'
    ) {
      throw new Error('Invalid atlas metadata structure');
    }

    // Configure texture settings for optimal quality
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16; // Maximum anisotropic filtering for sharp icons
    texture.generateMipmaps = true;
    texture.flipY = false; // Don't flip texture (we flip UV in shader instead)
    texture.needsUpdate = true;

    // Extract icon names from frames
    const iconNames = Object.keys(metadata.frames);

    if (iconNames.length === 0) {
      throw new Error('Atlas metadata contains no icon frames');
    }

    console.log(`✓ Icon atlas loaded successfully: ${iconNames.length} icons`);

    return {
      texture,
      metadata,
      iconNames,
    };
  } catch (error) {
    // Log detailed error information
    console.error('Failed to load icon atlas:', error);

    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        console.error(
          'Atlas loading timed out after 10 seconds. Check network connection.'
        );
      } else if (error.message.includes('fetch')) {
        console.error(
          'Failed to fetch atlas files. Ensure files exist in public/textures/'
        );
      } else {
        console.error('Error details:', error.message);
      }
    }

    // Return null to trigger fallback rendering
    return null;
  }
}

/**
 * Helper function to load a texture using THREE.TextureLoader
 *
 * @param path - Path to the texture file
 * @returns Promise resolving to the loaded texture
 */
function loadTexture(path: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(
      path,
      // onLoad
      (texture) => resolve(texture),
      // onProgress (optional)
      undefined,
      // onError
      (error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        reject(
          new Error(`Failed to load texture from ${path}: ${errorMessage}`)
        );
      }
    );
  });
}
