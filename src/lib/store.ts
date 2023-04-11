import { writable } from "svelte/store";
import type { CityFilters, GeolocationStateT, SpaceT } from "$lib/types";

export const selectedSpace = writable<SpaceT|null>(null);


const defaultUserLocation: GeolocationStateT = {
    geoLocationAvailable: null,
    loading: false,
    location: null,
    errorMessage: null
}
export const userLocation = writable<GeolocationStateT>(defaultUserLocation);

const defaultCityFilters: CityFilters = {
    showOnlyVetted: true,
    showOnlyOpen: true,
    spaceType: ''
}
export const cityFilters = writable<CityFilters>(defaultCityFilters)