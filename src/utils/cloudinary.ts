import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadBufferAsImage(buffer: Buffer, filename = 'file') {
    const dataUri = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    const res = await cloudinary.uploader.upload(dataUri, { folder: 'urben' });
    return res.secure_url;
}

export default cloudinary;
