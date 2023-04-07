import { writable } from "svelte/store";
import type { SpaceT } from "$lib/types";

export const selectedSpace = writable<SpaceT|null>(null);

export const userLocation = writable<GeolocationPosition | null>(null);

export type CityFilters = {
    showOnlyVetted: boolean;
}
const defaultCityFilters: CityFilters = {
    showOnlyVetted: true
}
export const cityFilters = writable<CityFilters>(defaultCityFilters)