/**
 * Utility for loading textures using Web Worker
 * Provides a Promise-based API for off-thread texture loading
 */

export interface LoadedTexture {
  imageBitmap: ImageBitmap;
  width: number;
  height: number;
}

export interface TextureLoadError {
  error: string;
}

export interface AtlasMetadata {
  frames: Record<string, unknown>;
  meta: {
    size: { w: number; h: number };
  };
}

let workerInstance: Worker | null = null;
let requestId = 0;

/**
 * Load a texture using Web Worker for off-thread decoding
 * @param url - URL of the texture to load
 * @returns Promise that resolves with the decoded ImageBitmap
 */
export const loadTextureInWorker = (url: string): Promise<LoadedTexture> => {
  return new Promise((resolve, reject) => {
    // Create worker if it doesn't exist
    if (!workerInstance) {
      try {
        workerInstance = new Worker('/workers/texture-loader.worker.js');
      } catch (error) {
        reject(new Error(`Failed to create worker: ${error}`));
        return;
      }
    }

    const currentRequestId = ++requestId;

    // Set up message handler
    const handleMessage = (e: MessageEvent) => {
      const { type, id, imageBitmap, width, height, error } = e.data;

      // Only handle messages for this request
      if (id !== currentRequestId) {
        return;
      }

      if (type === 'TEXTURE_READY') {
        // Clean up listener
        workerInstance?.removeEventListener('message', handleMessage);

        resolve({
          imageBitmap,
          width,
          height,
        });
      } else if (type === 'ERROR') {
        // Clean up listener
        workerInstance?.removeEventListener('message', handleMessage);

        reject(new Error(error || 'Texture loading failed'));
      }
    };

    // Set up error handler
    const handleError = (error: ErrorEvent) => {
      workerInstance?.removeEventListener('message', handleMessage);
      workerInstance?.removeEventListener('error', handleError);
      reject(new Error(`Worker error: ${error.message}`));
    };

    workerInstance.addEventListener('message', handleMessage);
    workerInstance.addEventListener('error', handleError);

    // Send load request to worker
    workerInstance.postMessage({
      type: 'LOAD_TEXTURE',
      url,
      id: currentRequestId,
    });
  });
};

/**
 * Terminate the texture loading worker
 * Call this when texture loading is complete to free resources
 */
export const terminateTextureWorker = (): void => {
  if (workerInstance) {
    workerInstance.postMessage({ type: 'TERMINATE' });
    workerInstance.terminate();
    workerInstance = null;
  }
};

/**
 * Load icon atlas texture with metadata
 * @returns Promise with ImageBitmap and metadata
 */
export const loadIconAtlasInWorker = async (): Promise<{
  imageBitmap: ImageBitmap;
  metadata: AtlasMetadata;
}> => {
  try {
    // Load texture and metadata in parallel
    const [textureResult, metadataResponse] = await Promise.all([
      loadTextureInWorker('/textures/icons.v1.png'),
      fetch('/textures/icons.v1.json'),
    ]);

    const metadata = await metadataResponse.json();

    return {
      imageBitmap: textureResult.imageBitmap,
      metadata,
    };
  } catch (error) {
    console.error('Failed to load icon atlas:', error);
    throw error;
  }
};
