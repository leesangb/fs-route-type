import path from 'path';
import { DefaultRouting } from './defaultRouting';

export class NextPages extends DefaultRouting {
    protected override getKeyValue(filename: string): { key: string, value: string } {
        const segments = filename.split(path.sep);
        const file = segments.pop()!;
        const staticSegments = segments.filter(s => s !== 'pages' && !this.isDynamicSegment(s));
        const dynamicSegments = segments.filter(s => this.isDynamicSegment(s));

        if (!file.startsWith('index.') && !this.isDynamicSegment(file)) {
            staticSegments.push(file.replace(/\.[^/.]+$/, ''));
        }
        const key = ['', ...staticSegments].join('/') || '/';
        return {
            key,
            value: [...dynamicSegments, file].join('/'),
        };
    }
}
