import { DefaultRouting } from './defaultRouting';

export class NextPages extends DefaultRouting {
    protected override getKeyValue(filename: string): { key: string, value: string } {
        const { key, value } = super.getKeyValue(filename);
        const keyWithoutPages = key.replace(/^\/pages/, '');

        if (!value.startsWith('index.')) {
            const [filename] = value.split('.');
            return {
                key: `${keyWithoutPages}/${filename}`,
                value,
            };
        }

        return {
            key: keyWithoutPages || '/',
            value,
        };
    }
}
