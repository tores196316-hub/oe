import { v2 as cloudinary } from 'cloudinary';

// Dynamic Cloudinary Config Helper
export function getCloudinaryClient(customConfig?: { cloudName?: string; apiKey?: string; apiSecret?: string }) {
  const cloud_name = customConfig?.cloudName || process.env.CLOUDINARY_CLOUD_NAME || 'lnjqbjeh';
  const api_key = customConfig?.apiKey || process.env.CLOUDINARY_API_KEY || '649449775168273';
  const api_secret = customConfig?.apiSecret || process.env.CLOUDINARY_API_SECRET || 'eCFx04kYXp_69_u7h65fUbpwbiI';

  if (cloud_name && api_key && api_secret) {
    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
      secure: true,
    });
    return { isConfigured: true, cloudinary };
  }

  return { isConfigured: false, cloudinary };
}

// Test Cloudinary connection
export async function testCloudinaryConnection(config?: { cloudName?: string; apiKey?: string; apiSecret?: string }) {
  const { isConfigured, cloudinary: client } = getCloudinaryClient(config);
  if (!isConfigured) {
    return {
      success: false,
      message: 'Cloudinary API bilgileri eksik (Cloud Name, API Key veya API Secret tanımlanmamış).',
    };
  }

  try {
    const result = await client.api.ping();
    return {
      success: true,
      message: 'Cloudinary API bağlantısı başarılı! STATUS: ' + (result.status || 'ok'),
      details: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Cloudinary bağlantı hatası: ' + (error.message || String(error)),
    };
  }
}

// Upload buffer directly to Cloudinary
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  fileName: string,
  folderPath: string = '/uploads/2026/08/'
): Promise<{
  publicId: string;
  secureUrl: string;
  thumbnailUrl: string;
  format: string;
  width: number;
  height: number;
  size: number;
}> {
  const { isConfigured, cloudinary: client } = getCloudinaryClient();

  if (!isConfigured) {
    // If Cloudinary keys are not provided yet in env, throw informative error or create optimized mock response
    throw new Error('CLOUDINARY_NOT_CONFIGURED');
  }

  return new Promise((resolve, reject) => {
    // Convert folder path to valid Cloudinary folder (e.g. "uploads/2026/08")
    const cleanFolder = folderPath.replace(/^\/+|\/+$/g, '');

    const uploadStream = client.uploader.upload_stream(
      {
        folder: cleanFolder,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload failed'));
        }

        // Generate optimized webp thumbnail URL
        const thumbnailUrl = client.url(result.public_id, {
          width: 400,
          height: 300,
          crop: 'fill',
          gravity: 'auto',
          format: 'webp',
          quality: 'auto',
          secure: true,
        });

        resolve({
          publicId: result.public_id,
          secureUrl: result.secure_url,
          thumbnailUrl: thumbnailUrl || result.secure_url,
          format: result.format || 'jpg',
          width: result.width || 800,
          height: result.height || 600,
          size: result.bytes || fileBuffer.length,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

// Delete image from Cloudinary
export async function deleteFromCloudinary(publicId: string) {
  const { isConfigured, cloudinary: client } = getCloudinaryClient();
  if (!isConfigured) return false;

  try {
    const res = await client.uploader.destroy(publicId);
    return res.result === 'ok';
  } catch (err) {
    console.error('Cloudinary destroy error:', err);
    return false;
  }
}
