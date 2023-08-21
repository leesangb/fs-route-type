import { DefaultRouting } from './defaultRouting';

export class NextApp extends DefaultRouting {
    /**
     * @example
     * app/page.tsx => { key: '/', value: 'page.tsx', isDynamic: false }
     * app/test/page.tsx => { key: '/test', value: 'page.tsx', isDynamic: false }
     * app/test/route.ts => { key: '/test', value: 'route.ts', isDynamic: false }
     * app/[dynamic]/page.tsx => { key: '/', value: '[dynamic]/page.tsx', isDynamic: true }
     * @param filename
     * @protected
     */
    protected override getKeyValue(filename: string): { key: string; value: string } {
        const { key, value } = super.getKeyValue(filename);
        const keyWithoutApp = key.replace(/^\/app/, '');
        const segments = keyWithoutApp.split('/');
        const staticSegments = segments.filter(s => !this.isDynamicSegment(s)).join('/');
        const dynamicSegments = segments.filter(s => this.isDynamicSegment(s)).join('/');

        return {
            key: staticSegments || '/',
            value: [...dynamicSegments, value].join('/'),
        };
    }
}
