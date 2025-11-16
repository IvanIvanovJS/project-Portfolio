/**
 * Web Worker for off-thread texture loading and decoding
 * Handles image fetching and decoding using createImageBitmap API
 * to prevent main thread blocking during texture loading
 */

self.onmessage = async (e) => {
  const { type, url, id } = e.data;

  if (type === 'LOAD_TEXTURE') {
    try {
      // Fetch the texture image
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch texture: ${response.statusText}`);
      }

      const blob = await response.blob();

      // Decode image off main thread using createImageBitmap
      // This is much faster than letting the browser decode on main thread
      const imageBitmap = await createImageBitmap(blob, {
        premultiplyAlpha: 'none',
        colorSpaceConversion: 'none',
        imageOrientation: 'none',
      });

      // Send decoded ImageBitmap back to main thread
      // Transfer ownership to avoid copying (zero-copy transfer)
      self.postMessage(
        {
          type: 'TEXTURE_READY',
          id: id,
          imageBitmap: imageBitmap,
          width: imageBitmap.width,
          height: imageBitmap.height,
        },
        [imageBitmap] // Transferable objects
      );
    } catch (error) {
      // Send error back to main thread
      self.postMessage({
        type: 'ERROR',
        id: id,
        error: error.message || 'Unknown error occurred',
      });
    }
  } else if (type === 'TERMINATE') {
    // Clean termination
    self.close();
  }
};

// Handle worker errors
self.onerror = (error) => {
  self.postMessage({
    type: 'ERROR',
    error: error.message || 'Worker error occurred',
  });
};
