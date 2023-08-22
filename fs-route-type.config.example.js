/**
 * @type {import('./src/config').Config}
 */
module.exports = {
    preset: 'next-app',
    includeRoot: true,
    files: [
        './app/**/(page|route).(tsx|ts|js|jsx)'
    ],
    output: {
        mode: 'type',
        path: './out/types/routes.ts',
        name: 'Route'
    }
};
