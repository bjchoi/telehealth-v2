function getFromStorage<T>(key: string, def?: T): Promise<T> {
    try {
        const userStr = window.localStorage.getItem(key);
        if (userStr) {
            const userObj = JSON.parse(userStr);
            return Promise.resolve(userObj as T);
        }
    } catch(e) {
        console.log(e);
        return Promise.resolve(def);
    }
}

function saveToStorage<T>(key: string, obj: T): Promise<void> {
    if(obj == null) {
        window.localStorage.removeItem(key);
    } else {
        window.localStorage.setItem(key, JSON.stringify(obj));
    }

    return Promise.resolve();
}

export default {
    getFromStorage,
    saveToStorage
}