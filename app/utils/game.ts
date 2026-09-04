/**
 * Data for the next-token prediction game.
 *
 * The visitor plays the activation unit: each round shows a sentence with a
 * blank and three candidate tokens, and picking one routes an activation
 * along that edge. Whatever they pick also dresses the character on the
 * side, so a run of wrong answers assembles a visibly wrong person.
 *
 * Every round targets a different slot of that character, which is why the
 * prompts read the way they do - each question is literally about the part
 * of the portrait it fills in.
 *
 * The percentages are the joke and the difficulty at once. They are what a
 * naive predictor would guess, so the likeliest token is deliberately not
 * always the true one: going with the distribution is exactly how a model
 * gets a confident answer wrong.
 */

/** Part of the character a round decides. One round fills exactly one. */
export type AvatarSlot = 'outfit' | 'hold' | 'hat' | 'badge' | 'face'

export interface TokenChoice {
  /** Suffix of the i18n key holding this token's label. */
  readonly id: string
  /** Value written into the round's slot when this token is picked. */
  readonly value: string
  /** Displayed likelihood, as a whole percentage. Sums to 100 per round. */
  readonly probability: number
  /** Exactly one choice per round is true. */
  readonly correct?: true
}

export interface GameRound {
  /** Suffix of the i18n key holding the prompt and the reveal. */
  readonly id: string
  readonly slot: AvatarSlot
  readonly choices: readonly TokenChoice[]
}

export const GAME_ROUNDS: readonly GameRound[] = [
  {
    id: 'job',
    slot: 'outfit',
    choices: [
      { id: 'engineer', value: 'dev', probability: 46, correct: true },
      { id: 'pastry', value: 'chef', probability: 31 },
      { id: 'welder', value: 'diver', probability: 23 },
    ],
  },
  {
    id: 'hands',
    slot: 'hold',
    choices: [
      { id: 'rollingPin', value: 'pin', probability: 41 },
      { id: 'keyboard', value: 'keyboard', probability: 38, correct: true },
      { id: 'blowtorch', value: 'torch', probability: 21 },
    ],
  },
  {
    id: 'head',
    slot: 'hat',
    choices: [
      { id: 'headphones', value: 'headphones', probability: 44, correct: true },
      { id: 'toque', value: 'toque', probability: 33 },
      { id: 'helmet', value: 'helmet', probability: 23 },
    ],
  },
  {
    id: 'badge',
    slot: 'badge',
    choices: [
      { id: 'alDente', value: 'pasta', probability: 40 },
      { id: 'depth', value: 'depth', probability: 31 },
      { id: 'shipsIt', value: 'ship', probability: 29, correct: true },
    ],
  },
  {
    id: 'face',
    slot: 'face',
    choices: [
      { id: 'serene', value: 'serene', probability: 45 },
      { id: 'bubbles', value: 'wide', probability: 28 },
      { id: 'disbelief', value: 'focus', probability: 27, correct: true },
    ],
  },
]

/** The character as it looks before the first round. */
export const AVATAR_BLANK: Record<AvatarSlot, string> = {
  outfit: 'plain',
  hold: 'none',
  hat: 'none',
  badge: 'none',
  face: 'blank',
}

/** The character the true tokens assemble, used for the closing comparison. */
export const AVATAR_TRUTH: Record<AvatarSlot, string> = Object.fromEntries(
  GAME_ROUNDS.map(round => [
    round.slot,
    round.choices.find(choice => choice.correct)!.value,
  ]),
) as Record<AvatarSlot, string>
