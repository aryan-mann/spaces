import type { CityFilters, GeolocationStateT, SpaceT } from '$lib/types';
import type { User } from 'firebase/auth';

// Selected space state
let selectedSpaceState = $state<{ space: SpaceT; location: number } | null>(null);

export function setSelectedSpace(space: SpaceT, location: number) {
	selectedSpaceState = { space, location };
}

export function clearSelectedSpace() {
	selectedSpaceState = null;
}

export function getSelectedSpace() {
	return selectedSpaceState;
}

// User location state
const defaultUserLocation: GeolocationStateT = {
	geoLocationAvailable: null,
	loading: false,
	location: null,
	errorMessage: null,
	refreshCoords: () => {}
};

let userLocationState = $state<GeolocationStateT>(defaultUserLocation);

export function setUserLocation(location: GeolocationStateT) {
	userLocationState = location;
}

export function updateUserLocation(updates: Partial<GeolocationStateT>) {
	userLocationState = { ...userLocationState, ...updates };
}

export function getUserLocation() {
	return userLocationState;
}

// City filters state
const defaultCityFilters: CityFilters = {
	showOnlyVetted: false,
	showOnlyOpen: false,
	spaceType: '',
	spaceName: ''
};

let cityFiltersState = $state<CityFilters>(defaultCityFilters);

export function setCityFilters(filters: CityFilters) {
	cityFiltersState = filters;
}

export function updateCityFilters(updates: Partial<CityFilters>) {
	cityFiltersState = { ...cityFiltersState, ...updates };
}

export function getCityFilters() {
	return cityFiltersState;
}

// Global app state
let globalStoreState = $state<{ app: any; auth: any }>({ app: null, auth: null });

export function setGlobalStore(store: { app: any; auth: any }) {
	globalStoreState = store;
}

export function getGlobalStore() {
	return globalStoreState;
}

// Current user state
let currentUserState = $state<User | null>(null);

export function setCurrentUser(user: User | null) {
	currentUserState = user;
}

export function getCurrentUser() {
	return currentUserState;
}

// Favorites state with localStorage persistence
const STORAGE_KEY = 'ourspaces-favorites';

function loadFavoritesFromStorage(): Set<string> {
	if (typeof window === 'undefined') return new Set();
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return new Set(JSON.parse(stored));
		}
	} catch (e) {
		console.error('Failed to load favorites:', e);
	}
	return new Set();
}

function saveFavoritesToStorage(favorites: Set<string>) {
	if (typeof window === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
	} catch (e) {
		console.error('Failed to save favorites:', e);
	}
}

let favoritesState = $state<Set<string>>(loadFavoritesFromStorage());

export function toggleFavorite(spaceName: string) {
	const newFavorites = new Set(favoritesState);
	if (newFavorites.has(spaceName)) {
		newFavorites.delete(spaceName);
	} else {
		newFavorites.add(spaceName);
	}
	favoritesState = newFavorites;
	saveFavoritesToStorage(newFavorites);
}

export function isFavorite(spaceName: string): boolean {
	return favoritesState.has(spaceName);
}

export function getFavorites(): Set<string> {
	return favoritesState;
}

export function clearFavorites() {
	favoritesState = new Set();
	saveFavoritesToStorage(new Set());
}
