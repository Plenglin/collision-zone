**Snowplow Derby Game Server**
==============================

# To Do

## Now

- All the damn game logic
- Create AI players when necessary

## Later

- Tell the main server about how good at the game some players are when they die
- Tell the main server about basic information
- Alert the devs when it crashes via push notification!
- Add support for UDP communication when we eventually do mobile
- Different types of player cars

# Design Document

_Because timezones suck. Note that ALL of these numbers are subject to change based on balancing._

The arena is square, and 100 meters on one side. When there are not enough human players, bot players are be added to the game. 

When players join the game, they get a car that they can control. In game, cars are on average 1 meter long. There are different kinds of cars with different shapes, weak spots, speeds, boosting behaviors, etc. that the player is allowed to choose from. The snowplow is the default car.

The camera follows the player's car. Speed and angular velocity is controlled by the player's mouse. The further the mouse is from the car, the faster the car will move. The car will also attempt to turn in the direction of the player's mouse.

When the player left clicks, they boost for 3 seconds. This boost cannot be stopped. When boosting, the car increases speed, but receives a reduction in angular velocity. After boosting, for a short period of time, the car's speed and angular velocity are both reduced for 1 second. Boost takes 5 seconds to recharge.

When another car hits your weak spot, you die and your chassis is sent flinging away. Kill credit is given to either the car who killed you, or the person who killed the dead car who killed you.

## Killstreaks

Killstreaks bonuses are rewarded to create a positive feedback loop. Inspired by Call of Duty. 

Passive bonuses:
 - Increased velocity up to a maximum
 - Increased angular velocity up to a maximum (or, alternatively, reduce angular velocity down to a minimum for getting more kills?)

Active bonuses, just like in CoD, are chosen by the player and bestowed at fixed kill increments, like 3, 6, 9, etc. Ideas for some streak bonuses:
 - Invulnerability bubble for 1 seconds
 - Push everyone away from you
 - Pull everyone towards you
 - Blink 5 meters forward
 - Fire a slowing dart
 - Fire a slowing dart barrage
 - Instant turning for 2 seconds

## Car ideas

Shitty ASCII sketches included. `%` = weak spot, `#` = chassis.

### Double-edged car

```
            %
Front    #######
            %
```

Increased angular velocity and speed at the cost of more difficulty to protect its weak spots.

### Pipe Wrench

```
         #########
Front    #   %%  #
         #   %%  #######

```

