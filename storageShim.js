function keyFor(key, shared) {
  return (shared ? "shared:" : "personal:") + key;
}

window.storage = {
  async get(key, shared) {
    const raw = localStorage.getItem(keyFor(key, shared));
    if (raw === null) throw new Error("not found");
    return { key, value: raw, shared: !!shared };
  },
  async set(key, value, shared) {
    localStorage.setItem(keyFor(key, shared), value);
    return { key, value, shared: !!shared };
  },
  async delete(key, shared) {
    localStorage.removeItem(keyFor(key, shared));
    return { key, deleted: true, shared: !!shared };
  },
  async list(prefix, shared) {
    const p = keyFor(prefix || "", shared);
    const stripLen = (shared ? "shared:" : "personal:").length;
    const keys = Object.keys(localStorage)
      .filter((k) => k.startsWith(p))
      .map((k) => k.slice(stripLen));
    return { keys, prefix, shared: !!shared };
  },
};
