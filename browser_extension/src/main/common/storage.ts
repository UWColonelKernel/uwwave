import { runtime, storage } from 'webextension-polyfill'

type Dictionary = { [p: string]: any }
export type StorageKeys = string | string[] | object | null

function throwIfRuntimeError() {
    if (runtime.lastError) {
        throw runtime.lastError
    }
}

export async function setLocalStorage(data: object): Promise<void> {
    await storage.local.set(data)
    throwIfRuntimeError()
}

export async function setLocalStorageByKey(
    key: string,
    data: any,
): Promise<void> {
    return setLocalStorage({ [key]: data })
}

export async function getLocalStorage(keys: StorageKeys): Promise<Dictionary> {
    const result = await storage.local.get(keys)
    throwIfRuntimeError()
    return result
}

export async function clearLocalStorage(): Promise<void> {
    await storage.local.clear()
    throwIfRuntimeError()
}

export function addLocalStorageListener(callback: (changes: object) => void) {
    storage.local.onChanged.addListener(callback)
}

// HELPERS

// update and return updated object
export async function updateLocalStorage<T>(key: string, data: T): Promise<T> {
    const result = await getLocalStorage(key)
    const val = result[key]
    if (typeof val === 'object' && typeof data === 'object') {
        const newData = { ...val, ...data }
        await setLocalStorage({ [key]: newData })
        return newData
    } else {
        await setLocalStorage({ [key]: data })
        return data
    }
}
