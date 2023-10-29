import {strToU8, strFromU8, compressSync, decompressSync} from "fflate"
import {Buffer} from "buffer";

let encoder = new TextEncoder('utf8')
let decoder = new TextDecoder('utf8')

export function retrieve(key, defaultValue) {
    try {
        let serializedItem = localStorage.getItem(key)
        if (serializedItem == null) {
            return defaultValue
        }
        return JSON.parse(strFromU8(decompressSync(Uint8Array.from(Buffer.from(serializedItem, 'base64')))))
    } catch (e) {
        console.log("Retrieve failed: ", e)
        return defaultValue
    }
}

export async function store(key, value) {
    localStorage.setItem(key, await bufferToBase64(compressSync(strToU8(JSON.stringify(value)))))
}

async function bufferToBase64(buffer) {
    // use a FileReader to generate a base64 data URI:
    const base64url = await new Promise(r => {
        const reader = new FileReader()
        reader.onload = () => r(reader.result)
        reader.readAsDataURL(new Blob([buffer]))
    });
    // remove the `data:...;base64,` part from the start
    return base64url.slice(base64url.indexOf(',') + 1);
}