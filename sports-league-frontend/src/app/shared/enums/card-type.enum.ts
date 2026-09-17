export enum CardType {
  Yellow = 0,
  Red = 1,
}

export const CARD_TYPE_LABELS: Record<CardType, string> = {
  [CardType.Yellow]: 'Amarilla',
  [CardType.Red]: 'Roja',
};
