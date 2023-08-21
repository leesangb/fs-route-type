export interface Routing {
    /**
     * Returns every route that should be generated.
     */
    get routes(): string[];

    /**
     * Add a file to the routing.
     * @param filename
     */
    addFile(filename: string): void;

    /**
     * Remove a file from the routing.
     * @param filename
     */
    removeFile(filename: string): void;
}
