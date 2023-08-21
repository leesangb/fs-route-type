import path from 'path';
import { Routing } from './routing';

export class DefaultRouting implements Routing {
    protected readonly directories = new Map<string, string[]>();

    public addFile(filename: string) {
        const { key, value } = this.getKeyValue(filename);

        const directory = this.directories.get(key);
        if (directory) {
            directory.push(value);
        } else {
            this.directories.set(key, [value]);
        }
    }

    public removeFile(filename: string) {
        const { key, value } = this.getKeyValue(filename);

        const directory = this.directories.get(key);
        if (!directory) {
            return;
        }
        directory.splice(directory.indexOf(value), 1);
        if (directory.length === 0) {
            this.directories.delete(key);
        }
    }

    public get routes(): string[] {
        return Array.from(this.directories.keys());
    }

    /**
     * get key and value from filename
     * @param filename
     */
    protected getKeyValue(filename: string): { key: string, value: string } {
        const segments = filename.split(path.sep);
        const file = segments.pop()!;
        const staticSegments = segments.filter(s => !this.isDynamicSegment(s));
        const dynamicSegments = segments.filter(s => this.isDynamicSegment(s));

        const key = ['', ...staticSegments].join('/') || '/';
        return {
            key,
            value: [...dynamicSegments, file].join('/'),
        };
    }

    protected isDynamicSegment(segment: string): boolean {
        return /^\[\[?(\.\.\.)?[^[\].]+]?]/.test(segment);
    }
}
