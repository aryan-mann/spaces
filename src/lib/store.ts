import { writable } from "svelte/store";
import type { CityFilters, GeolocationStateT, SpaceT } from "$lib/types";
import type { User } from "firebase/auth";

export const selectedSpace = writable<{ space: SpaceT, location: number }|null>(null);

const defaultUserLocation: GeolocationStateT = {
    geoLocationAvailable: null,
    loading: false,
    location: null,
    errorMessage: null,
    refreshCoords: () => {}
}
export const userLocation = writable<GeolocationStateT>(defaultUserLocation);

const defaultCityFilters: CityFilters = {
    showOnlyVetted: false,
    showOnlyOpen: false,
    spaceType: '',
    spaceName: 'reveille',
}
export const cityFilters = writable<CityFilters>(defaultCityFilters)

export const globalStore = writable<{ app: any, auth: any }>({ app: null, auth: null });
export const currentUser = writable<User|null>(null);