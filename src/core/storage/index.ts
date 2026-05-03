// Storage — async key/value abstraction.
//
// The substrate phase uses an in-memory implementation so we don't have to
// add @react-native-async-storage/async-storage just yet. Cross-session
// persistence (dismiss-sticky banner, queued deep links) requires swapping
// `storage` for an AsyncStorage-backed instance — call sites stay
// unchanged.

export interface Storage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    getItem(key) {
      return Promise.resolve(map.get(key) ?? null);
    },
    setItem(key, value) {
      map.set(key, value);
      return Promise.resolve();
    },
    removeItem(key) {
      map.delete(key);
      return Promise.resolve();
    },
  };
}

export const storage: Storage = createMemoryStorage();
