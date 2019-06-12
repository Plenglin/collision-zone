Game Protocol
=============

## Motivation

JSON is nice and readable and debuggable, but it has a really big problem: **IT'S DUMMY THICC.** So, we will only send it for initialization payloads, and just send raw bytes to the clients most of the time.

## The Client

A client can be a PLAYER or a SPECTATOR. 

## Protocol Events

### Initial Connection

0. Client A connects to the server via Websocket, UDP, etc.
1. Server -> Client A: `InitialPayload`
2. Client A is put into SPECTATOR mode

### Periodic Update

0. Server -> Client *: `UpdatePayload`

### SPECTATOR wants to become PLAYER

0. Client A -> Server: `BecomePlayer`
1. Server -> Client *: `InitialPlayer`
    - The player name can be modified in the event of a duplicate

## Server -> Client Types

### `InitialPlayer: JSON`

Name | Type | Description 
-----|------|-------------
id | int | the id of the player
name | string | display name of the player

The client, upon receiving this object, will not know the position or status of the players. This is fine, because UpdatePayload is sent so regularly it will not be necessary. 

### `InitialPayload: JSON`

Name | Type | Description 
-----|------|-------------
version | string | server version
players | InitialPlayer[] | all players currently on

### `UpdatePayload: bytes`

Name | Type | Size (bytes) | Description 
-----|------|--------------|------------
player_count | int | 2 | how many players there are
players | InitialPlayer[] | player_count * size | the players
**TOTAL** | | **VARIABLE** | 

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
**TOTAL** | | **16** | 

If the client does not receive a datagram for a player with id `id`, then it is safe to delete that player from the registry.

## Client -> Server Types

### `BecomePlayer: JSON`

Name | Type | Description 
-----|------|-------------
name | string | player display name
player_class | int (enumerated) | the player class (i.e. snowplow, other types)

### `Input: bytes`

Name | Type | Size (bytes) | Description 
-----|------|--------------|------------
x     | float | 4 | rescaled mouse command
y     | float | 4 | rescaled mouse command
flags | int | 1 | 0: begin boost
**TOTAL** | | **9** | 
