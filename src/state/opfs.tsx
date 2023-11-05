import { StateStorage } from 'zustand/esm/middleware';
import { compressSync, decompressSync, strFromU8, strToU8 } from 'fflate';



const opfs: StateStorage = {
    setItem: async (name: string, value: string) => {
        const opfsRoot = await (async () => await navigator.storage.getDirectory())();
        const compressed = compressSync(strToU8(JSON.stringify(value)));
        const writable = await (await (opfsRoot.getFileHandle(name, { create: true }))).createWritable();
        await writable.write(compressed);
        await writable.close();
    },
    getItem: async (name: string) => {
        const opfsRoot = await (async () => await navigator.storage.getDirectory())();
        const buffer = await (await (await opfsRoot.getFileHandle(name)).getFile()).arrayBuffer();
        return JSON.parse(strFromU8(decompressSync(new Uint8Array(buffer))));
    },
    removeItem: async (name: string) => {
        const opfsRoot = await (async () => await navigator.storage.getDirectory())();
        await opfsRoot.removeEntry(name);
    },
};

export default opfs;