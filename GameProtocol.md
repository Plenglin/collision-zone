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

### `Wall: bytes`
Name | Type | Size (bytes) | Description 
-----|------|--------------|------------
x | float | 4 | position
y | float | 4 | position
w | float | 4 | size
h | float | 4 | size
a | float | 4 | angle
**TOTAL** | | **20** | 

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
wall_count | int | 4 | number of walls
walls | Wall[] | ? | walls
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
event_type | int | 1 | the number `0x81`
players | InitialPlayer | ? | the player
**TOTAL** | | **?** | 

### `TransitionResponse: bytes`

Name | Type | Size (bytes) | Description 
-----|------|--------------|------------
event_type | int | 1 | the number `0x01`
success | int | 1 | `0` = success, `1` = malformed request, `2` = username taken, `3` = username too long, `4` = username empty
player_id | int | 2 | the player's ID. does not matter if success != 0
**TOTAL** | | **4** | 

## Client -> Server Types

### `BecomePlayer: JSON`

Prepended by the byte 116 (ASCII `t`) as signaling

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
