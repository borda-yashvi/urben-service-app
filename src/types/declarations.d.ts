declare module 'jsonwebtoken';
declare module 'node-cron';
declare module 'bcrypt';
declare module 'multer';
declare module 'serverless-http';

// Minimal multer file typing for Request.file used in this project
declare namespace Express {
    export interface MulterFile {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        buffer: Buffer;
        size: number;
    }
    export interface Request {
        file?: MulterFile;
    }
}
