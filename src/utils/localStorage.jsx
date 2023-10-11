export function retrieve(key, defaultValue) {
    try {
        let serializedItem = localStorage.getItem(key)
        if (serializedItem == null) {
            return defaultValue
        }
        return JSON.parse(serializedItem)
    } catch(e) {
        return defaultValue
    }
}

export function store(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}