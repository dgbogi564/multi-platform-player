import { ChangeEvent, MouseEvent } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import opfs from './opfs.tsx';
import State from '../interfaces/State.tsx';
import Track from '../interfaces/Track.tsx';
import Session from '../interfaces/Session.tsx';
import Loop from '../interfaces/Loop.tsx';

const OEMBED_URL = 'https://noembed.com/embed?url=';
const urlPattern = '([-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*))';

const useStore = create<State>()((persist(immer((set, get) => ({
    playing: true,
    input: '',

    session: {
        id: -1,
        list: [] as Array<Session>,
    },
    action: {
        load: {
            track: (index: number) => {
                if (get().session.id < 0) {
                    return;
                }
                set((state) => {
                    state.session.list[state.session.id].index = index;
                    state.playing = true;
                });
            },
            playlist: () => {
                const state = get();
                const playlist = state.input.trim().split(/\r?\n/).map(url => (url.match(urlPattern)!)[0])
                    .filter(x => x).map((url) => ({ key: crypto.randomUUID(), url: 'https://' + url } as Track));
                if (playlist.length === 0) {
                    return;
                }
                set((state) => {
                    state.session.id = state.session.list.length;
                    state.session.list.push({
                        key: crypto.randomUUID(),
                        index: 0,
                        title: new Date().toTimeString(),
                        playlist: playlist,
                        loop: {
                            value: 0,
                            single: false,
                            text: 'Loop: Off',
                        } as Loop,
                        input: state.input,
                    });
                });
                state.action.load.track(0);
            },
            session: (e: MouseEvent) => {
                const id = parseInt(e.currentTarget.getAttribute('aria-rowindex')!);
                set((state) => {
                    state.session.id = id;
                    state.input = state.session.list[id].input;
                });
            },
        },
        prev: () => {
            const state = get();
            if (state.session.id < 0) {
                return;
            }
            const session = state.session.list[state.session.id];
            const index = (session.index > 0)
                ? session.index - 1
                : (session.loop.value === 1) ? session.playlist.length - 1 : session.index;
            state.action.load.track(index);
        },
        next: () => {
            const state = get();
            if (state.session.id < 0) {
                return;
            }
            const session = state.session.list[state.session.id];
            const index = (session.index < session.playlist.length - 1)
                ? session.index + 1
                : (session.loop.value === 1) ? 0 : session.index;
            state.action.load.track(index);
        },
        shuffle: () => {
            const state = get();
            if (state.session.id < 0) {
                return;
            }
            set((state) => {
                const playlist = state.session.list[state.session.id].playlist;
                for (let i = playlist.length - 1; i >= 0; i--) {
                    const j = i + Math.floor(Math.random() * (playlist.length - i));
                    [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
                }
            });
        },
        handle: {
            ready: () => {
                console.log('onReady');
                get().action.fetchOEmbed();
            },
            start: () => {
                console.log('onStart');
            },
            play: () => {
                console.log('onPlay');
                set((state) => {
                    state.playing = true;
                });
            },
            pause: () => {
                console.log('onPause');
                set((state) => {
                    state.playing = false;
                });
            },
            buffer: () => {
                console.log('onBuffer');
            },
            ended: () => {
                console.log('onEnded');
                get().action.next();
            },
            error: (e: MouseEvent) => {
                console.error('onError', e);
                get().action.next();
            },
            input: (e: ChangeEvent) => {
                const input = (e.target as HTMLInputElement).value;
                set((state) => {
                    state.input = input;
                });
            },
        },
        toggle: {
            play: (e: MouseEvent) => {
                const state = get();
                const index = parseInt(e.currentTarget.getAttribute('aria-rowindex')!);
                if (index === state.session.list[state.session.id].index) {
                    set((state) => {
                        state.playing = !state.playing;
                    });
                } else {
                    state.action.load.track(index);
                }
            },
            loop: () => {
                set((state) => {
                    const loop = state.session.list[state.session.id].loop;
                    const value = (loop.value + 1) % 3;
                    loop.value = value;
                    loop.single = value === 2;
                    loop.text = [
                        'Loop: Off',
                        'Loop: All',
                        'Loop: Single',
                    ][value];
                });
            },
        },
        fetchOEmbed: async () => {
            const state = get();
            const sessionId = state.session.id;
            const session = state.session.list[sessionId];
            const index = session.index;
            const track = session.playlist[index];
            if (track.thumbnail_url) {
                return;
            }
            const json = await (await fetch(OEMBED_URL + track.url)).json();
            set((state) => {
                const track = state.session.list[sessionId].playlist[index];
                track.title = json.title;
                track.author_name = json.author_name;
                track.author_url = json.author_url;
                track.thumbnail_url = json.thumbnail_url;
            });
        },
    },
})), {
    name: 'session',
    partialize: (state) => ({ session: { ...state.session, id: -1 } }),
    storage: createJSONStorage(() => opfs),
})));


export const select = {
    state: (state: State) => state,
    playing: (state: State) => state.playing,
    input: (state: State) => state.input,

    current: {
        session: (state: State) => state.session.list[state.session.id],
        playlist: (state: State) => state.session.list[state.session.id].playlist,
        index: (state: State) => state.session.list[state.session.id].index,
        track: (state: State) => {
            const session = state.session.list[state.session.id];
            return session.playlist[session.index];
        },
        loop: (state: State) => state.session.list[state.session.id].loop,
    },
    session: {
        id: (state: State) => state.session.id,
        list: (state: State) => state.session.list,
    },
    action: (state: State) => state.action,
};

export default useStore;
