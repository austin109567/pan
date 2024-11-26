import imageCompression from 'browser-image-compression';

interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker?: boolean;
  fileType?: string;
}

export async function compressImage(
  dataUrl: string,
  options: CompressionOptions
): Promise<string> {
  try {
    // Convert data URL to File object
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], 'image.png', { type: 'image/png' });

    // Compress the image
    const compressedFile = await imageCompression(file, {
      maxSizeMB: options.maxSizeMB,
      maxWidthOrHeight: options.maxWidthOrHeight,
      useWebWorker: options.useWebWorker ?? true,
      fileType: options.fileType ?? 'image/png'
    });

    // Convert compressed file back to data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(compressedFile);
    });
  } catch (error) {
    console.error('Image compression failed:', error);
    // Return original image if compression fails
    return dataUrl;
  }
} 