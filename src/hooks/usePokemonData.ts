import { useQuery } from "@tanstack/react-query"
import { PokemonService } from "../services"
import { getPokemonIdFromUrl } from "../utils/helpers"

export function usePokemonData(pokemonId: string) {
    const { data: pokemonDetailsData, isLoading: pokemonDetailsIsLoading, error: pokemonDetailsError } = useQuery({
        queryKey: ['pokemonDetails', pokemonId],
        queryFn: () => PokemonService.getPokemonDetails(pokemonId)
    });

    const { data: evolutionChainData, isLoading: evolutionChainIsLoading, error: evolutionChainError } = useQuery({
        queryKey: ['evolutionChain', pokemonId],
        queryFn: () => PokemonService.getPokemonSpecies(pokemonId).then((species) => {
            const evolutionChainId = getPokemonIdFromUrl(species.evolution_chain.url);

            if (!evolutionChainId) {
                throw new Error('Invalid evolution chain URL');
            }
            return PokemonService.getPokemonEvolutionChain(evolutionChainId);
        })
    });

    const isLoading = pokemonDetailsIsLoading || evolutionChainIsLoading;

    return { pokemonDetailsData, evolutionChainData, isLoading, errors: { evolutionChainError, pokemonDetailsError } };
}