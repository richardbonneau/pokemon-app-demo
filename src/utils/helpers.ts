export function getSingleParam<T>(param: T | T[]): T {
    if (Array.isArray(param)) {
        return param[0];
    }
    return param;
}

export function getPokemonIdFromUrl(url: string | string[] | undefined): string | undefined {
    if (typeof url === 'string') {
        const parts = url.split('/');
        return parts[parts.length - 2];
    }
}

export function urlReplacePokemonSpeciesWithPokemon(url: string): string {
    return url.replace('pokemon-species', 'pokemon');
}