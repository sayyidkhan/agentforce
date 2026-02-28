import dotenv from 'dotenv';
import path from 'path';

// Must run before any other module that reads process.env
dotenv.config({ path: path.join(process.cwd(), '..', '.env') });
dotenv.config({ path: path.join(process.cwd(), '.env') });
