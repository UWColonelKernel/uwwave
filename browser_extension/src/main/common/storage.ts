type Dictionary = { [p: string]: any }
export type StorageKeys = string | string[] | object | null

export async function setLocalStorage(data: object): Promise<void> {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(data, function () {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError)
            }
            resolve(undefined)
        })
    })
}

export async function setLocalStorageByKey(
    key: string,
    data: any,
): Promise<void> {
    return setLocalStorage({ [key]: data })
}

export async function getLocalStorage(keys: StorageKeys): Promise<Dictionary> {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(keys, function (result) {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError)
            }
            resolve(result)
        })
    })
}

export async function clearLocalStorage(): Promise<void> {
    return new Promise((resolve, reject) => {
        chrome.storage.local.clear(function () {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError)
            }
            resolve()
        })
    })
}

export function addLocalStorageListener(callback: (changes: object) => void) {
    chrome.storage.local.onChanged.addListener(callback)
}

// HELPERS

// update and return updated object
export async function updateLocalStorage<T>(key: string, data: T): Promise<T> {
    return new Promise((resolve, reject) => {
        getLocalStorage(key)
            .then(result => {
                // If key not found, result === {}, so result[key] is undefined
                const val = result[key]
                if (typeof val === 'object' && typeof data === 'object') {
                    const newData = { ...val, ...data }
                    setLocalStorage({ [key]: newData })
                        .then(() => {
                            resolve(newData)
                        })
                        .catch(reason => reject(reason))
                } else {
                    setLocalStorage({ [key]: data })
                        .then(() => {
                            resolve(data)
                        })
                        .catch(reason => reject(reason))
                }
            })
            .catch(reason => reject(reason))
    })
}
