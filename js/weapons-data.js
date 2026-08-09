window.WEAPONS = [
 {
  "name": "Twin Bolters",
  "slug": "twin-bolters",
  "desc": "Twin heavy bolters that trade accuracy for punishing hull damage at close to mid range.",
  "ability": false,
  "rarity": "Rare",
  "rarityTier": 2,
  "passive": false,
  "auto": false,
  "front": false,
  "rear": false,
  "stats": {
   "physicalDamage": 15,
   "shieldDamage": 2,
   "physicalAreaDamage": 0,
   "shieldAreaDamage": 0,
   "speed": 30,
   "cooldown": 1,
   "energyCost": 15,
   "randomInaccuracy": 10,
   "impactForce": 0,
   "duration": 0.5,
   "maxCharges": 2,
   "chargeCooldown": 3
  },
  "talents": [
   {
    "name": "Auto-Loading",
    "desc": "Reduces Recharge by 1 Second",
    "locked": false,
    "icon": "assets/talents/t-00-200.png"
   },
   {
    "name": "Targeting Array",
    "desc": "Increase Range And Accuracy",
    "locked": false,
    "icon": "assets/talents/t-01-ssf-002.png"
   },
   {
    "name": "Deflection Rounds",
    "desc": "Bullets Will Ricochet once",
    "locked": false,
    "icon": "assets/talents/t-02-richocette.png"
   },
   {
    "name": "Overdrive Cannons",
    "desc": "Lowers Delay between shots shorter",
    "locked": false,
    "icon": "assets/talents/t-03-ignition-surge.png"
   },
   {
    "name": "Auxiliary Shells",
    "desc": "Increases Charges by one",
    "locked": false,
    "icon": "assets/talents/t-04-auxiliary-shells.png"
   },
   {
    "name": "Ignition Surge",
    "desc": "Each Burst Becomes 10% Stronger",
    "locked": false,
    "icon": "assets/talents/t-05-abstract-talent-icon-3.png"
   }
  ],
  "icon": "assets/weapons/twin-bolters.png",
  "type": "Kinetic"
 },
 {
  "name": "Cannon",
  "slug": "cannon",
  "desc": "A heavy old cannon that fires slow, inaccurate shells with brutal impact force.",
  "ability": false,
  "rarity": "Epic",
  "rarityTier": 3,
  "passive": false,
  "auto": false,
  "front": true,
  "rear": false,
  "stats": {
   "physicalDamage": 15,
   "shieldDamage": 5,
   "physicalAreaDamage": 0,
   "shieldAreaDamage": 0,
   "speed": 20,
   "cooldown": 1.5,
   "energyCost": 35,
   "randomInaccuracy": 25,
   "impactForce": 0.5,
   "duration": 1,
   "maxCharges": 0,
   "chargeCooldown": 0
  },
  "talents": [
   {
    "name": "Machined Barrel",
    "desc": "Increases Bullet Speed",
    "locked": false,
    "icon": "assets/talents/t-06-13.png"
   },
   {
    "name": "Shrapnel",
    "desc": "Explosions leave Shrapnel",
    "locked": false,
    "icon": "assets/talents/t-07-1.png"
   },
   {
    "name": "Cluster Burst",
    "desc": "Increases Blast Radius, Blast Damage and Shrapnel",
    "locked": true,
    "icon": "assets/talents/t-08-27.png"
   },
   {
    "name": "Barrel Grooves",
    "desc": "Increases Accuracy by 10%",
    "locked": false,
    "icon": "assets/talents/t-09-14.png"
   },
   {
    "name": "Hot Shot",
    "desc": "Flaming shots launch embers that can ignite ship hulls and spread fire to other vessels.",
    "locked": false,
    "icon": "assets/talents/t-10-flamingorb-new.png"
   },
   {
    "name": "Chain Shot",
    "desc": "Fires Two Projectiles Attached to a chain",
    "locked": false,
    "icon": "assets/talents/t-11-4.png"
   }
  ],
  "icon": "assets/weapons/cannon.png",
  "type": "Kinetic"
 },
 {
  "name": "Machine Gun",
  "slug": "machine-gun",
  "desc": "Rapid-fire kinetic cannons that chew through light targets with steady sustained fire.",
  "ability": false,
  "rarity": "Common",
  "rarityTier": 0,
  "passive": false,
  "auto": true,
  "front": false,
  "rear": false,
  "stats": {
   "physicalDamage": 3,
   "shieldDamage": 2,
   "physicalAreaDamage": 0,
   "shieldAreaDamage": 0,
   "speed": 25,
   "cooldown": 0.075,
   "energyCost": 3,
   "randomInaccuracy": 5,
   "impactForce": 0,
   "duration": 0.45,
   "maxCharges": 25,
   "chargeCooldown": 2
  },
  "talents": [
   {
    "name": "Rapid‑Cycle Loader",
    "desc": "Reduces Recharge to 1.5 Seconds",
    "locked": false,
    "icon": "assets/talents/t-12-b-28.png"
   },
   {
    "name": "Deep Feed Reserves",
    "desc": "Increases max ammo by 50%",
    "locked": false,
    "icon": "assets/talents/t-13-generic-bullets.png"
   },
   {
    "name": "Auto Reload",
    "desc": "Upon Using Passive restore 50% of ammo",
    "locked": false,
    "icon": "assets/talents/t-14-b-20.png"
   },
   {
    "name": "Recoil Dampeners",
    "desc": "Accuracy recovery increased 25% While not Firing. Accuracy degradation decreased by 25% While Firing",
    "locked": false,
    "icon": "assets/talents/t-15-retro-target-lock.png"
   },
   {
    "name": "High Calibure Rounds",
    "desc": "Increases size of bullets slightly, increases physical damage by 1",
    "locked": false,
    "icon": "assets/talents/t-16-engineerskill-25-bullets-1.png"
   },
   {
    "name": "Quad cannon",
    "desc": "Upgrades from Duel Cannons to Quad Cannons Doubles attack speed by 50%",
    "locked": false,
    "icon": "assets/talents/t-17-quad-cannon-blast3.png"
   }
  ],
  "icon": "assets/weapons/machine-gun.png",
  "type": "Kinetic"
 },
 {
  "name": "LaserBolt",
  "slug": "laserbolt",
  "desc": "Standard-issue laser repeater with balanced shield damage and reliable sustained fire.",
  "ability": false,
  "rarity": "Common",
  "rarityTier": 0,
  "passive": false,
  "auto": true,
  "front": false,
  "rear": false,
  "stats": {
   "physicalDamage": 5,
   "shieldDamage": 7,
   "physicalAreaDamage": 8,
   "shieldAreaDamage": 8,
   "speed": 17,
   "cooldown": 0.15,
   "energyCost": 10,
   "randomInaccuracy": 10,
   "impactForce": 0,
   "duration": 0.5,
   "maxCharges": 0,
   "chargeCooldown": 0
  },
  "talents": [
   {
    "name": "Precision Opticts",
    "desc": "Range Increased by 50%",
    "locked": false,
    "icon": "assets/talents/t-18-23.png"
   },
   {
    "name": "Yellow Lasers",
    "desc": "Upgrades red lasers to yellow, increases damage, minor increase to size, slight decrease to Fire Rate",
    "locked": false,
    "icon": "assets/talents/t-19-yellow-laser.png"
   },
   {
    "name": "Auto Targeting",
    "desc": "Lasers will auto target enemies infront of them in a 25 Degree angle",
    "locked": false,
    "icon": "assets/talents/t-20-153.png"
   },
   {
    "name": "Efficency",
    "desc": "Lowers the Energy Cost By 3",
    "locked": false,
    "icon": "assets/talents/t-21-ssf-090.png"
   },
   {
    "name": "Overdrive",
    "desc": "Increases Rate of Fire by 25% while above 50% energy",
    "locked": false,
    "icon": "assets/talents/t-22-ssf-082.png"
   },
   {
    "name": "Twin Blast",
    "desc": "Lasers will fire with Duel blast instead of alternating blast",
    "locked": false,
    "icon": "assets/talents/t-23-two-red-lasers.png"
   }
  ],
  "icon": "assets/weapons/laserbolt.png",
  "type": "Energy"
 },
 {
  "name": "Laser Blasters",
  "slug": "laser-blasters",
  "desc": "Twin-linked green lasers that fire both barrels in unison at an unpredictable cadence.",
  "ability": false,
  "rarity": "Common",
  "rarityTier": 0,
  "passive": false,
  "auto": true,
  "front": false,
  "rear": false,
  "stats": {
   "physicalDamage": 5,
   "shieldDamage": 7,
   "physicalAreaDamage": 8,
   "shieldAreaDamage": 8,
   "speed": 17,
   "cooldown": 0.6,
   "energyCost": 10,
   "randomInaccuracy": 10,
   "impactForce": 0,
   "duration": 0.5,
   "maxCharges": 0,
   "chargeCooldown": 0
  },
  "talents": [
   {
    "name": "Tight Cycle",
    "desc": "Reduces the minimum and maximum delay between volleys by 0.1 seconds.",
    "locked": false,
    "icon": "assets/talents/t-24-b-30.png"
   },
   {
    "name": "Convergence Relay",
    "desc": "When both bolts in a volley hit the same enemy, the delay before the next volley is reduced by 50%.",
    "locked": false,
    "icon": "assets/talents/t-25-b-33.png"
   },
   {
    "name": "Echo Salvo",
    "desc": "Each volley has a 50% chance to echo, firing again 0.2 seconds later for half the normal Energy cost. The echo is skipped if Energy runs dry.",
    "locked": false,
    "icon": "assets/talents/t-26-g-01.png"
   },
   {
    "name": "Efficient Coupling",
    "desc": "Reduces Laser Blasters Energy cost by 15%.",
    "locked": false,
    "icon": "assets/talents/t-27-skill-magiceye.png"
   },
   {
    "name": "Blue Shift",
    "desc": "Converts the blasters to blue lasers, increasing area damage and shield-impact strength at the cost of 30% more Energy and 20% longer volley delay.",
    "locked": false,
    "icon": "assets/talents/t-28-blue-laser.png"
   },
   {
    "name": "Cryo Lock",
    "desc": "When both bolts in a volley hit the same enemy, deals 5 bonus Shield damage and reduces its movement and turning by 50% for 0.5 seconds.",
    "locked": true,
    "icon": "assets/talents/t-29-skill-41-ice.png"
   }
  ],
  "icon": "assets/weapons/laser-blasters.png",
  "type": "Energy"
 },
 {
  "name": "Phasor",
  "slug": "phasor",
  "desc": "A focused beam weapon that burns through shields and hull with a long, high-energy burst.",
  "ability": false,
  "rarity": "Rare",
  "rarityTier": 2,
  "passive": false,
  "auto": false,
  "front": true,
  "rear": false,
  "stats": {
   "physicalDamage": 40,
   "shieldDamage": 40,
   "physicalAreaDamage": 0,
   "shieldAreaDamage": 0,
   "speed": 0,
   "cooldown": 6,
   "energyCost": 40,
   "randomInaccuracy": 0,
   "impactForce": 0,
   "duration": 1.5,
   "maxCharges": 0,
   "chargeCooldown": 0
  },
  "talents": [
   {
    "name": "Rapid Recycle",
    "desc": "Reduces Phasor Recharge, letting you redeploy the sweep more often. \\nRecharge reduction by 1 second",
    "locked": false,
    "icon": "assets/talents/t-24-b-30.png"
   },
   {
    "name": "Extended Emitter",
    "desc": "Increases Phasor beam length by 20%, letting the sweep reach farther targets and maintain contact at longer range.",
    "locked": false,
    "icon": "assets/talents/t-30-b-24.png"
   },
   {
    "name": "Duel Beam",
    "desc": "Spawns two Phasors that will speed across. \\nIncrease Energy cost by 20",
    "locked": false,
    "icon": "assets/talents/t-31-cross-beam.png"
   },
   {
    "name": "Efficent Start",
    "desc": "Lowers the enegy cost by 15",
    "locked": false,
    "icon": "assets/talents/t-32-g-27.png"
   },
   {
    "name": "Arc Stabilizers",
    "desc": "While Phaser is active, energy regeneration penalty is reduced (regen is cut less), so you can keep maneuvering and supporting weapons online. \\nIncreases width by 30%",
    "locked": false,
    "icon": "assets/talents/t-33-164.png"
   },
   {
    "name": "Echo Sweep",
    "desc": "After completing a sweep, the Phaser immediately performs a second pass (re-sweeps the same arc), extending coverage and time-on-target.",
    "locked": false,
    "icon": "assets/talents/t-34-48.png"
   }
  ],
  "icon": "assets/weapons/phasor.png",
  "type": "Energy"
 },
 {
  "name": "Dumb-Fire Missile",
  "slug": "dumb-fire-missile",
  "desc": "Fires unguided rockets straight ahead after a short arming delay for heavy burst damage.",
  "ability": false,
  "rarity": "Rare",
  "rarityTier": 2,
  "passive": false,
  "auto": false,
  "front": false,
  "rear": false,
  "stats": {
   "physicalDamage": 10,
   "shieldDamage": 5,
   "physicalAreaDamage": 25,
   "shieldAreaDamage": 5,
   "speed": 10,
   "cooldown": 0.3,
   "energyCost": 15,
   "randomInaccuracy": 5,
   "impactForce": 0.6,
   "duration": 5,
   "maxCharges": 4,
   "chargeCooldown": 3
  },
  "talents": [
   {
    "name": "Advanced Engines",
    "desc": "Increases Max Speed and Thrust by 20%",
    "locked": false,
    "icon": "assets/talents/t-35-r-14.png"
   },
   {
    "name": "Targeting Computer",
    "desc": "Missiles will slightly turn towards targets",
    "locked": false,
    "icon": "assets/talents/t-36-191.png"
   },
   {
    "name": "Hull Buster",
    "desc": "increases damage against hull by 30%",
    "locked": false,
    "icon": "assets/talents/t-37-ssf-061.png"
   },
   {
    "name": "Armored Hull",
    "desc": "Doubles Hitpoints of Rocket",
    "locked": false,
    "icon": "assets/talents/t-38-aura-platearmor.png"
   },
   {
    "name": "Payload",
    "desc": "Increases Charge Count by 2",
    "locked": false,
    "icon": "assets/talents/t-39-ssf-056.png"
   },
   {
    "name": "Duel loader",
    "desc": "Recharges two charges at a time instead of one.",
    "locked": false,
    "icon": "assets/talents/t-40-ssf-034.png"
   }
  ],
  "icon": "assets/weapons/dumb-fire-missile.png",
  "type": "Explosive"
 },
 {
  "name": "Sidewinder",
  "slug": "sidewinder",
  "desc": "Short-range lock-on missile built to chase fighters and punish evasive targets.",
  "ability": false,
  "rarity": "Epic",
  "rarityTier": 3,
  "passive": false,
  "auto": false,
  "front": false,
  "rear": false,
  "stats": {
   "physicalDamage": 15,
   "shieldDamage": 10,
   "physicalAreaDamage": 10,
   "shieldAreaDamage": 5,
   "speed": 10,
   "cooldown": 5,
   "energyCost": 40,
   "randomInaccuracy": 5,
   "impactForce": 2,
   "duration": 6,
   "maxCharges": 1,
   "chargeCooldown": 5
  },
  "talents": [
   {
    "name": "Aegis Plating",
    "desc": "Reinforces the missile’s nano‑ceramic shell, increasing structural integrity from 1 to 10 HP. Allows the missile to survive point‑defense hits and environmental hazards.",
    "locked": false,
    "icon": "assets/talents/t-41-sidewinder-durability.png"
   },
   {
    "name": "Micro‑Thrusters",
    "desc": "Upgrades the missile’s attitude jets, granting sharper turning arcs and higher pursuit velocity. Enables extreme close‑range dogfight maneuvers.",
    "locked": false,
    "icon": "assets/talents/t-42-sidewinder-manuverability.png"
   },
   {
    "name": "Long‑Burn Ion Core",
    "desc": "Enhances the missile’s ion reactor efficiency, extending flight duration and maximum chase range.",
    "locked": false,
    "icon": "assets/talents/t-43-sidewinder-range2.png"
   },
   {
    "name": "Omni‑Link Targeting",
    "desc": "The missile’s lock no longer breaks due to obstruction or low sensor energy Reduces energy cost to 35",
    "locked": false,
    "icon": "assets/talents/t-44-targetlock.png"
   },
   {
    "name": "Avoidance AI",
    "desc": "The missile’s onboard intelligence now actively dodges obstacles, debris, and incoming projectiles while maintaining pursuit.",
    "locked": false,
    "icon": "assets/talents/t-45-missile-dodge.png"
   },
   {
    "name": "Rapid‑Acquire Sensor",
    "desc": "Ideal for fast‑moving or evasive targets. Reduces lock‑on time from 0.75s Reduces Recharge by 2.5 seconds Expands lock‑on cone from 35° to 50°.",
    "locked": false,
    "icon": "assets/talents/t-15-retro-target-lock.png"
   }
  ],
  "icon": "assets/weapons/sidewinder.png",
  "type": "Explosive"
 },
 {
  "name": "Swarmer Missile",
  "slug": "swarmer-missile",
  "desc": "Launches a spread of lock-on micro-missiles that pressure targets from multiple angles.",
  "ability": false,
  "rarity": "Legendary",
  "rarityTier": 4,
  "passive": false,
  "auto": false,
  "front": false,
  "rear": false,
  "stats": {
   "physicalDamage": 15,
   "shieldDamage": 10,
   "physicalAreaDamage": 10,
   "shieldAreaDamage": 5,
   "speed": 10,
   "cooldown": 3,
   "energyCost": 40,
   "randomInaccuracy": 5,
   "impactForce": 2,
   "duration": 6,
   "maxCharges": 4,
   "chargeCooldown": 8
  },
  "talents": [
   {
    "name": "Cycle Accelerator",
    "desc": "Recharge decreased by 2 Seconds",
    "locked": false,
    "icon": "assets/talents/t-46-missiles.png"
   },
   {
    "name": "Boost Thrusters",
    "desc": "Missile speed increased",
    "locked": false,
    "icon": "assets/talents/t-47-ssf-071.png"
   },
   {
    "name": "Swarm Multiplexer",
    "desc": "Increases Missile Launched from 4 to 6",
    "locked": false,
    "icon": "assets/talents/t-48-mega-swarm.png"
   },
   {
    "name": "Arc Aperture",
    "desc": "Lock-on arc increased (45° → 90°)",
    "locked": false,
    "icon": "assets/talents/t-49-sf-s-04.png"
   },
   {
    "name": "Reacquire Matrix",
    "desc": "Auto-retargets on kill \\nIncreases duration by 1",
    "locked": false,
    "icon": "assets/talents/t-50-sf-s-083.png"
   },
   {
    "name": "Inertial Null Charge",
    "desc": "Hits dampen target momentum for one second making additional missiles Easier to hit\\nIncreases Shield Damage per Missile to 10",
    "locked": false,
    "icon": "assets/talents/t-51-aura-magicalshock.png"
   }
  ],
  "icon": "assets/weapons/swarmer-missile.png",
  "type": "Explosive"
 },
 {
  "name": "Volley Missiles",
  "slug": "volley-missiles",
  "desc": "",
  "ability": false,
  "rarity": "Rare",
  "rarityTier": 2,
  "passive": false,
  "auto": false,
  "front": false,
  "rear": false,
  "stats": {
   "physicalDamage": 8,
   "shieldDamage": 2,
   "physicalAreaDamage": 4,
   "shieldAreaDamage": 2,
   "speed": 10,
   "cooldown": 0.5,
   "energyCost": 70,
   "randomInaccuracy": 10,
   "impactForce": 0.4,
   "duration": 5,
   "maxCharges": 1,
   "chargeCooldown": 4.5
  },
  "talents": [
   {
    "name": "Rapid Launch Sequencer",
    "desc": "Compresses the launcher cycle, releasing the full missile rack in a tighter, near-instant burst.",
    "locked": false,
    "icon": "assets/talents/t-35-r-14.png"
   },
   {
    "name": "Proximity Fuse",
    "desc": "Missiles that skim past nearby targets detonate before flying wide, dealing their area damage in a short blast.",
    "locked": false,
    "icon": "assets/talents/t-52-r-28.png"
   },
   {
    "name": "Blast Fuse Amplifier",
    "desc": "Upgrades Proximity Fuse, increasing explosion size and proximity detonation range by 30%. Area damage increases by 3 Hull and 2 Shield.",
    "locked": true,
    "icon": "assets/talents/t-53-r-29.png"
   },
   {
    "name": "Capacitor Siphon",
    "desc": "Refits the Volley rack with a charge-recovery loop that recaptures launch waste, reducing energy cost to 50.",
    "locked": false,
    "icon": "assets/talents/t-32-g-27.png"
   },
   {
    "name": "Stabilized Launch Rack",
    "desc": "Tightens the Volley rack's initial random launch spread to 20 degrees.",
    "locked": false,
    "icon": "assets/talents/t-54-n05-b.png"
   },
   {
    "name": "Expanded Launch Rack",
    "desc": "Expands the Volley rack to launch 8 missiles per activation.",
    "locked": false,
    "icon": "assets/talents/t-55-big-volley.png"
   }
  ],
  "icon": "assets/weapons/volley-missiles.png",
  "type": "Explosive"
 },
 {
  "name": "Mine",
  "slug": "mine",
  "desc": "Drops a drifting proximity mine that detonates on contact. Keep clear of the blast.",
  "ability": false,
  "rarity": "Uncommon",
  "rarityTier": 1,
  "passive": false,
  "auto": false,
  "front": false,
  "rear": true,
  "stats": {
   "physicalDamage": 10,
   "shieldDamage": 5,
   "physicalAreaDamage": 25,
   "shieldAreaDamage": 5,
   "speed": -3,
   "cooldown": 2,
   "energyCost": 25,
   "randomInaccuracy": 0,
   "impactForce": 0.6,
   "duration": 180,
   "maxCharges": 2,
   "chargeCooldown": 5
  },
  "talents": [
   {
    "name": "Echo Charge",
    "desc": "Hull Increased by 300% when mine is Hit, it will bounce. will last 3 hits",
    "locked": false,
    "icon": "assets/talents/t-56-echo-charge.png"
   },
   {
    "name": "Proxy Mine",
    "desc": "Mines will explode in a proximity",
    "locked": false,
    "icon": "assets/talents/t-57-mine-proximity.png"
   },
   {
    "name": "Dense Powder",
    "desc": "Explosion Radius and proximity radius increased by 50%",
    "locked": true,
    "icon": "assets/talents/t-58-mine-explosion.png"
   },
   {
    "name": "Heavy Loadout",
    "desc": "Increases Charge count by 2",
    "locked": false,
    "icon": "assets/talents/t-59-heavy-loadout2.png"
   },
   {
    "name": "Double Mine",
    "desc": "Drops 2 mines instead of 1",
    "locked": false,
    "icon": "assets/talents/t-60-double-mine.png"
   },
   {
    "name": "Efficent Design",
    "desc": "Decreases Energy Cost by 20%. Reduces Recharge by 1 second. Improves existing talents if taken Echo Charge - 6 bounces, bounces farther Explosion Radius - Increased by 25% Improved Loadout - 6 Charges, Double Mine - 3 mines",
    "locked": false,
    "icon": "assets/talents/t-61-mine-deconstructed.png"
   }
  ],
  "icon": "assets/weapons/mine.png",
  "type": "Explosive"
 },
 {
  "name": "Magnetic Grenade",
  "slug": "magnetic-grenade",
  "desc": "Prototype magnetic grenade platform. Behavior and stats still need final tuning.",
  "ability": false,
  "rarity": "Common",
  "rarityTier": 0,
  "passive": false,
  "auto": false,
  "front": false,
  "rear": false,
  "stats": {},
  "talents": [],
  "icon": null,
  "type": "Kinetic"
 },
 {
  "name": "Barrel Roll",
  "slug": "barrel-roll",
  "desc": "Execute an evasive roll that phases you through projectiles and physical objects. Explosions and area effects still reach you.",
  "ability": true,
  "rarity": "Common",
  "rarityTier": 0,
  "passive": true,
  "auto": false,
  "front": false,
  "rear": false,
  "stats": {
   "physicalDamage": 0,
   "shieldDamage": 0,
   "physicalAreaDamage": 0,
   "shieldAreaDamage": 0,
   "speed": 0,
   "cooldown": 1,
   "energyCost": 20,
   "randomInaccuracy": 0,
   "impactForce": 0,
   "duration": 0,
   "maxCharges": 2,
   "chargeCooldown": 5
  },
  "talents": [
   {
    "name": "Vector Surge",
    "desc": "Barrel Roll's movement burst launches farther and can exceed normal max speed.",
    "locked": false,
    "icon": "assets/talents/t-62-vectorsurge.png"
   },
   {
    "name": "Snap Roll",
    "desc": "Immediately perform a second Barrel Roll. You can rotate while rolling, and the second roll triggers another movement burst.",
    "locked": false,
    "icon": "assets/talents/t-63-twinroll.png"
   },
   {
    "name": "Reserve Roll",
    "desc": "Barrel Roll gains +1 maximum charge.",
    "locked": false,
    "icon": "assets/talents/t-64-reserveroll.png"
   },
   {
    "name": "Evasive Maneuvers",
    "desc": "After Barrel Roll ends, evasive maneuvering reduces hull damage by 25% for 2 seconds.",
    "locked": false,
    "icon": "assets/talents/t-65-evasiveplating.png"
   },
   {
    "name": "Deadstick Roll",
    "desc": "Barrel Roll costs no energy.",
    "locked": false,
    "icon": "assets/talents/t-66-zerogroll.png"
   },
   {
    "name": "Capacitor Rewind",
    "desc": "Barrel Roll restores 20% of max energy on activation.",
    "locked": true,
    "icon": "assets/talents/t-67-kineticrecharge.png"
   }
  ],
  "icon": "assets/weapons/barrel-roll.png"
 },
 {
  "name": "Blink",
  "slug": "blink",
  "desc": "Fold space to instantly teleport forward. Passes through all physical obstacles in its path.",
  "ability": true,
  "rarity": "Common",
  "rarityTier": 0,
  "passive": true,
  "auto": false,
  "front": false,
  "rear": false,
  "stats": {
   "physicalDamage": 0,
   "shieldDamage": 0,
   "physicalAreaDamage": 0,
   "shieldAreaDamage": 0,
   "speed": 0,
   "cooldown": 1,
   "energyCost": 25,
   "randomInaccuracy": 0,
   "impactForce": 0,
   "duration": 0,
   "maxCharges": 2,
   "chargeCooldown": 4
  },
  "talents": [
   {
    "name": "Horizon Breaker",
    "desc": "Increases Blink Range to 10",
    "locked": false,
    "icon": "assets/talents/t-68-long-range-stylized.png"
   },
   {
    "name": "Phase Shear",
    "desc": "Blinking through targets deal damage, scales with engine speed",
    "locked": false,
    "icon": "assets/talents/t-69-warp-damage.png"
   },
   {
    "name": "Cascading Singularity",
    "desc": "On Destroying Target through blink, refreshes the blink charge and energy cost.",
    "locked": true,
    "icon": "assets/talents/t-70-warp-damage-chain.png"
   },
   {
    "name": "Warp Optimization",
    "desc": "Reduce Recharge by 1 second and reduces energy cost by 10%",
    "locked": false,
    "icon": "assets/talents/t-71-cooldown.png"
   },
   {
    "name": "Phase Reloader",
    "desc": "Upon Blinking instantly regenerate 25% kinetic charges on all kinetic weapons",
    "locked": false,
    "icon": "assets/talents/t-72-blink-reset.png"
   },
   {
    "name": "Warp Cache",
    "desc": "Blink gains a third charge",
    "locked": false,
    "icon": "assets/talents/t-73-1.png"
   }
  ],
  "icon": "assets/weapons/blink.png"
 },
 {
  "name": "Blade Maneuver",
  "slug": "blade-maneuver",
  "desc": "Redirect momentum toward your maneuver input while the ability is held.",
  "ability": true,
  "rarity": "Common",
  "rarityTier": 0,
  "passive": true,
  "auto": false,
  "front": false,
  "rear": false,
  "stats": {
   "physicalDamage": 0,
   "shieldDamage": 0,
   "physicalAreaDamage": 0,
   "shieldAreaDamage": 0,
   "speed": 0,
   "cooldown": 3,
   "energyCost": 20,
   "randomInaccuracy": 0,
   "impactForce": 0,
   "duration": 0.5,
   "maxCharges": 0,
   "chargeCooldown": 0
  },
  "talents": [
   {
    "name": "Boost",
    "desc": "Slam the throttle wide open. The maneuver surges at full engine speed instead of half.",
    "locked": false,
    "icon": "assets/talents/t-74-boost.png"
   },
   {
    "name": "Rapid Cycling",
    "desc": "Streamlined capacitors cycle the maneuver in half the time for half the energy.",
    "locked": false,
    "icon": "assets/talents/t-75-125.png"
   },
   {
    "name": "Weapons Hot",
    "desc": "Coming out of the maneuver leaves your autoloaders overcharged, boosting automatic weapons' attack speed by 25% for 2 seconds after it ends.",
    "locked": false,
    "icon": "assets/talents/t-76-sf-s-069.png"
   },
   {
    "name": "BladeStorm",
    "desc": "The saw dash commits for 1 second. Anything you hit takes 10 hull and 10 shield damage, and you ricochet onward for the remaining duration.",
    "locked": false,
    "icon": "assets/talents/t-77-warriorskill-21-blades.png"
   },
   {
    "name": "Juggernaut",
    "desc": "Blade mode becomes unstoppable. Environmental collisions deal you no damage, all other damage is reduced by 25%, and after half a second you can press the ability again to end the dash early. Requires Bladestorm.",
    "locked": true,
    "icon": "assets/talents/t-78-blade-armor.png"
   },
   {
    "name": "Maelstrom",
    "desc": "Blade mode generates a gravity well that drags asteroids and enemy ships into the storm. Every collision sharpens the blades, adding 2 shield and 2 hull damage per stack (up to 4), and the dash lasts 0.5 seconds longer. Requires Juggernaut.",
    "locked": true,
    "icon": "assets/talents/t-79-blade-storm.png"
   }
  ],
  "icon": "assets/weapons/blade-maneuver.png"
 }
];
