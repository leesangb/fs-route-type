import { getExtension } from '@/utils/file';
import fs from 'fs';
import { ConfigSchema } from '@/config';
import { ZodError } from 'zod';

const supportedExtensions = ['js', 'json'] as const;
type SupportedExtension = typeof supportedExtensions[number];

const configFilenames = supportedExtensions.map(ext => `fs-route-type.config.${ext}` as const);

const configFrom: Record<SupportedExtension, (path: string) => Promise<unknown>> = {
    js: async path => {
        const module = await import(path);
        return module.default;
    },
    json: async path => {
        const json = await fs.promises.readFile(path, 'utf-8');
        return JSON.parse(json);
    }
};

function assertIsSupportedExtension(extension: string): asserts extension is SupportedExtension {
    if (!supportedExtensions.includes(extension as SupportedExtension)) {
        throw new Error(`Unsupported config file extension: ${extension}`);
    }
}

export const getConfig = async (path: string = configFilenames[0]!) => {
    try {
        const extension = getExtension(path);
        assertIsSupportedExtension(extension);
        const config = await configFrom[extension](path);
        return ConfigSchema.parse(config);
    } catch (error) {
        if (error instanceof ZodError) {
            console.error('config error', error.issues);
        } else {
            console.error('config error', error);
        }
        process.exit(1);
    }
};
