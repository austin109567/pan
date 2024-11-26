import * as snappy from 'snappy';
import { encode as encodeBase64, decode as decodeBase64 } from 'base64-arraybuffer';

export const compressData = async (data: any): Promise<string> => {
  try {
    const jsonString = JSON.stringify(data);
    const buffer = Buffer.from(jsonString);
    const compressed = await snappy.compress(buffer);
    return encodeBase64(compressed);
  } catch (error) {
    console.error('Compression failed:', error);
    throw error;
  }
};

export const decompressData = async (compressed: string): Promise<any> => {
  try {
    const buffer = Buffer.from(decodeBase64(compressed));
    const decompressed = await snappy.uncompress(buffer);
    const jsonString = decompressed.toString();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Decompression failed:', error);
    throw error;
  }
};