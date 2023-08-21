export const debounce = (fn: () => void, delay: number) => {
    let timeoutId: NodeJS.Timeout | null = null;
    return () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn();
            timeoutId = null;
        }, delay);
    };
};
