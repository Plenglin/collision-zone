Game Protocol
=============

## Motivation

JSON is nice and readable and debuggable, but it has a really big problem: **IT'S DUMMY THICC.** So, we will only send it for initialization payloads, and just send raw bytes to the clients most of the time.

## The Client

A client can be a PLAYER or a SPECTATOR. 

## Protocol Events

### Initial Connection

0. Client A connects to the server via Websocket, UDP, etc.
1. Server -> Client A, reliable: `InitialPayload`
2. Client A is put into SPECTATOR mode

### Periodic Update

0. Server -> Client *, unreliable: `UpdatePayload`

### SPECTATOR wants to become PLAYER

0. Client A -> Server, reliable: `BecomePlayer`
1. Server -> Client *, reliable: `InitialPlayer`
    - The player name can be modified in the event of a duplicate

## Server -> Client Types

### `UpdatePlayer: bytes`

Name | Type | Size (bytes) | Description 
-----|------|--------------|------------
id    | int | 2 | the id of the player 
x     | float | 4 | player positional data
y     | float | 4 | player positional data
angle | float | 4 | player rotational data
vx    | float | 4 | player velocity data (help with interpolation)
vy    | float | 4 | player velocity data (help with interpolation)
flags | int | 1 | 0: alive, 1: boosting
**TOTAL** | | **23** | 

### `InitialPlayer: bytes`

Name | Type | Size (bytes) | Description 
-----|------|--------------|------------
UpdatePlayer | UpdatePlayer | 23 | include the rest of UpdatePlayer
player_class | int | 1 | the enumerated player class
name | string | ? | null-terminated display name of the player
**TOTAL** | | **?** | 

If the client does not receive a datagram for a player with id `id`, then it is safe to delete that player from the registry.

### `InitialPayload: bytes`

Name | Type | Size (bytes) | Description 
-----|------|--------------|------------
version | string | ? | null-terminated server version
player_count | int | 2 | number of players
players | InitialPlayer[] | ? | all players currently on
**TOTAL** | | **?** | 

### `UpdatePayload: bytes`

Name | Type | Size (bytes) | Description 
-----|------|--------------|------------
player_count | int | 2 | how many players there are
players | UpdatePlayer[] | player_count * size | the players
**TOTAL** | | **?** | 

### `PlayerCreatedEvent: bytes`

Name | Type | Size (bytes) | Description 
-----|------|--------------|------------
event_type | int | 1 | the number `32`, for identifying the event type
players | InitialPlayer | ? | the player
**TOTAL** | | **?** | 

## Client -> Server Types

### `BecomePlayer: JSON`

Name | Type | Description 
-----|------|-------------
name | string | player display name
player_class | int | the enumerated player class (i.e. snowplow, other types)

### `Input: bytes`

Name | Type | Size (bytes) | Description 
-----|------|--------------|------------
x     | float | 4 | rescaled mouse command
y     | float | 4 | rescaled mouse command
flags | int | 1 | 0: begin boost
**TOTAL** | | **9** | 
