# Playlist Randomizer (tentative name)

## Motivation
Many music platforms have issues with the way they implement shuffling.
- Youtube only loads 50 or so songs in a playlist at a time and only shuffles those loaded songs.
- Similarly, when shuffling your likes on Soundcloud, only loads the first ~28 songs into queue and only shuffles those songs.
- Spotify's shuffling algorithm is not a truly randomized one; it prioritizes placing songs it thinks you'll enjoy to the front of the queue, creating somewhat of a music echo chamber.

## Goals

The goal of this project is to create a website that can perform the following functions:
- Play songs from multiple different music platforms.
  - [x] Soundcloud
  - [x] Youtube
  - [ ] Spotify
- [x] Truly randomize and shuffle songs.
- [ ] Save, manage, and resume past sessions.
- [ ] Convert playlists into individual songs.
- [ ] Export sessions as text files.

## Issues
Soundcloud has indefinitely closed registration for their API so it may be impossible to implement playlist resolving at the moment.
