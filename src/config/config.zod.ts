import { z } from 'zod';

export const ConfigSchema = z.object({
    preset: z.enum(['default', 'gatsby', 'next-app', 'next-pages', 'qwik', 'remix', 'sveltekit']).optional().default('default'),
    /**
     * Include root path
     * @example
     * includeRoot: true
     * - /pages/test.tsx -> /pages/test
     * includeRoot: false
     * - /pages/test.tsx -> /test
     */
    includeRoot: z.boolean().optional().default(false),
    /**
     * file names to match
     * glob patterns are supported
     */
    files: z.array(z.string()),
    output: z.object({
        /**
         * Output path
         */
        path: z.string(),
        /**
         * Name of output type or object
         */
        name: z.string().default('Route'),
    }).and(z.discriminatedUnion('mode', [
        z.object({
            /**
             * typescript type
             */
            mode: z.literal('type'),
        }),
        z.object({
            /**
             * javascript object type (const)
             */
            mode: z.literal('object'),
            /**
             * only for object mode
             * case style of output object keys
             * @example
             * camelCase: 'testRoute'
             * pascalCase: 'TestRoute'
             * snakeCase: 'test_route'
             * kebabCase: 'test-route'
             * screamCase: 'TEST_ROUTE'
             * @default camelCase
             */
            case: z.enum(['camel', 'pascal', 'snake', 'param', 'constant']).optional().default('constant'),
            /**
             * object key for root path
             */
            rootName: z.string().optional().default('root'),
        }),
    ])),
});

export type Config = z.infer<typeof ConfigSchema>;
