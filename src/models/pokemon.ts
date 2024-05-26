export type URLItem = {
  name: string
  url: string
}

export interface PokemonType {
  type: URLItem
}

export interface Move {
  move: URLItem
}

export type EvolutionChain = {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChain[];
};