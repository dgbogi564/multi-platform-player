# Multi-platform Player

## Introduction
Multi-platform Player allows you to play songs from multiple platforms all in one place.

## Motivation

There's no guarantee that a song you enjoy on one platform will be available on another:
This can be very frustrating when you want to listen to all the music you enjoy, leaving you with only two options:
- Either manually search for the songs another platform and add them to your playlist there.
- Or swap between which platforms you want to listen to music on.

Some music platforms may also have issues with their shuffling algorithms:
- Youtube playlists and Soundcloud likes only shuffles the first few songs in a playlist.
- Spotify's shuffling algorithm is biased and you'll end up listening to the same set of songs over and over again. 

## Features

With multi-platform player, you don't have to make those compromises:
- You can play all songs from any platform that is supported.
- You can load as many songs as your computer can handle.
- You can shuffle your songs without bias so every song has an equal chance of playing next.

## Supported Sites

This project currently relies on [react-player](https://github.com/cookpete/react-player) which can support the following sites:
- DailyMotion
- Facebook
- Kaltura
- Mixcloud
- Soundcloud
- Stremable
- Twitch
- Vidyard
- Wistia
- Youtube


## Future Plans

Nothing is guaranteed, but I would love to implement the following features the following tasks:
- Support playlist resolution.
- Add Spotify support.

## Issues (regarding future plans)

Soundcloud has indefinitely closed registration for their API so it may be impossible to implement playlist resolving at the moment.

Spotify's iframe API lacks any options to control volume which would lead to a bad user experience.