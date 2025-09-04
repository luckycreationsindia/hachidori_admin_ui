declare global {
    interface Window {
        javascriptCallback: () => void;
    }
}

export {};