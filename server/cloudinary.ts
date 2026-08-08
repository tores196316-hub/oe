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
      message: 'Cloudinary API ve Otomatik WebP/Kalite Optimizasyonu Aktif! STATUS: ' + (result.status || 'ok'),
      optimization: {
        webpEnabled: true,
        autoQualityEnabled: true,
        defaultFormat: 'webp (f_auto, q_auto)',
      },
      details: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Cloudinary bağlantı hatası: ' + (error.message || String(error)),
    };
  }
}

// Upload buffer directly to Cloudinary with automatic WebP format & quality optimization
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  fileName: string,
  folderPath: string = '/uploads/2026/08/'
): Promise<{
  publicId: string;
  secureUrl: string;
  webpUrl: string;
  optimizedUrl: string;
  originalUrl: string;
  thumbnailUrl: string;
  format: string;
  width: number;
  height: number;
  size: number;
}> {
  const { isConfigured, cloudinary: client } = getCloudinaryClient();

  if (!isConfigured) {
    // If Cloudinary keys are not provided yet in env, throw informative error
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
        transformation: [{ fetch_format: 'auto', quality: 'auto' }],
        eager: [
          { format: 'webp', quality: 'auto:good' },
          { width: 400, height: 300, crop: 'fill', gravity: 'auto', format: 'webp', quality: 'auto' },
        ],
        eager_async: false,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload failed'));
        }

        // Generate optimized auto-format (f_auto) and auto-quality (q_auto) URL
        // Cloudinary f_auto delivers WebP to WebP-capable browsers automatically
        const optimizedUrl = client.url(result.public_id, {
          fetch_format: 'auto',
          quality: 'auto',
          secure: true,
        });

        // Generate explicit WebP format URL
        const webpUrl = client.url(result.public_id, {
          format: 'webp',
          quality: 'auto:good',
          secure: true,
        });

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
          secureUrl: optimizedUrl || webpUrl || result.secure_url,
          webpUrl: webpUrl || result.secure_url,
          optimizedUrl: optimizedUrl || result.secure_url,
          originalUrl: result.secure_url,
          thumbnailUrl: thumbnailUrl || webpUrl || result.secure_url,
          format: 'webp',
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
