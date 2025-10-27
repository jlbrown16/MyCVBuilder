import '@testing-library/jest-dom/vitest';

declare global {
  interface Window {
    localStorage: Storage;
  }
}

beforeEach(() => {
  const store: Record<string, string> = {};

  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach((key) => delete store[key]);
      },
      key: (index: number) => Object.keys(store)[index] ?? null,
      get length() {
        return Object.keys(store).length;
      },
    },
    configurable: true,
  });
});
export {};
