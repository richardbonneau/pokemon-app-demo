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

export function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}