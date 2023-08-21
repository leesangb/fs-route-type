import fs from 'fs';
import { Config, ConfigSchema } from '@/config';

const configFilenames = [
    'fs-route-type.config.json',
] as const;

export const getConfig = (path: string = configFilenames[0]): Config => {
    try {
        const configJson = JSON.parse(fs.readFileSync(path, 'utf8'));
        return ConfigSchema.parse(configJson);
    } catch (error) {
        console.error('config error', error);
        process.exit(1);
    }
};
