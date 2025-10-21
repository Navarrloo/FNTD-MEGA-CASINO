
import { Unit, Rarity } from './types';

export const ADMIN_USERNAMES = ['NAVARRLO', 'AVE4GE'];
export const CASINO_COST = 0;
export const STARTING_BALANCE = 1000;
export const BALANCE_ICON = 'https://files.catbox.moe/dbovxg.webp';

export const UNITS: Unit[] = [
  {
    id: 1,
    name: 'The Puppet',
    rarity: Rarity.Epic,
    image: "https://files.catbox.moe/3rsetb.webp",
    description: 'A mysterious puppet that pulls the strings from behind the scenes, offering powerful support abilities.',
    cost: 500,
  },
  {
    id: 2,
    name: 'Puppeteer',
    rarity: Rarity.Legendary,
    image: "https://files.catbox.moe/9t36cu.webp",
    description: 'An armored version of the Marionette, trading support skills for powerful defensive and offensive capabilities on the front line.',
    cost: 1200,
  },
  {
    id: 3,
    name: 'Withered Bonnie',
    rarity: Rarity.Rare,
    image: "https://files.catbox.moe/xy6e6m.webp",
    description: 'A battle-scarred rabbit animatronic that uses its intimidating presence and heavy-hitting attacks to disrupt enemy lines.',
    cost: 375,
  },
  {
    id: 4,
    name: 'Withered Foxy',
    rarity: Rarity.Rare,
    image: "https://files.catbox.moe/x8qrug.webp",
    description: 'A swift and deadly pirate fox, specializing in rapid strikes that bypass enemy defenses.',
    cost: 450,
  },
  {
    id: 5,
    name: 'Withered Freddy',
    rarity: Rarity.Rare,
    image: "https://files.catbox.moe/ayj6f1.webp",
    description: 'The withered leader of the band, a tanky unit that can withstand heavy damage.',
    cost: 400,
  },
  {
    id: 6,
    name: '8-Bit Golden Freddy',
    rarity: Rarity.Common,
    image: "https://files.catbox.moe/g55v5l.webp",
    description: 'A low-cost, blocky version of Golden Freddy. While not powerful, it can be deployed in large numbers to swarm enemies.',
    cost: 300,
  },
  {
    id: 7,
    name: 'Balloon Boy',
    rarity: Rarity.Common,
    image: "https://files.catbox.moe/6fpdqx.webp",
    description: 'A cheerful but distracting unit that lowers the attack speed of nearby enemies with his annoying laughter and balloons.',
    cost: 400,
  },
  {
    id: 8,
    name: 'Endo Turret',
    rarity: Rarity.Rare,
    image: "https://files.catbox.moe/ox76o2.webp",
    description: 'A chaotic jumble of parts that attacks erratically, dealing area-of-effect damage to all nearby foes.',
    cost: 450,
  },
  {
    id: 9,
    name: 'Shadow Freddy',
    rarity: Rarity.Epic,
    image: "https://files.catbox.moe/vay5aa.webp",
    description: 'A spectral entity that can phase through enemies, dealing damage over time and being hard to target.',
    cost: 800,
  }
];