import type {
	CityT,
	CoordinateT,
	DistanceUnit,
	CityFilters,
	GeolocationStateT,
	SpaceDataT,
	SpaceT,
	SupportedCity,
	OpeningHoursT,
	OpenInformationT
} from './types';
import type { Page } from '@sveltejs/kit';
import Fuse from 'fuse.js';
import spacesDataSF from './spaces_sf.jsonc';

const spaces: SpaceT[] = (spacesDataSF as SpaceT[]).map((space) => ({
	...space,
	city: 'san-francisco'
}));

const spacesFuse = new Fuse(spaces, {
	keys: ['name'],
	distance: 1,
	ignoreLocation: true,
	isCaseSensitive: false,
	threshold: 0.5
});

export function distanceToUser(
	userLocation: GeolocationPosition,
	locationCoords: CoordinateT,
	unit: DistanceUnit = 'ms'
): { distance: number; unit: DistanceUnit } {
	return distanceBetweenCoordinates(
		{ lat: userLocation.coords.latitude, lng: userLocation.coords.longitude },
		locationCoords,
		unit
	);
}

export function distanceBetweenCoordinates(
	coord1: CoordinateT,
	coord2: CoordinateT,
	unit: DistanceUnit = 'ms'
): { distance: number; unit: DistanceUnit } {
	const R = 6371e3; // metres
	const lat1 = coord1.lat;
	const lat2 = coord2.lat;
	const lng1 = coord1.lng;
	const lng2 = coord2.lng;

	const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
	const φ2 = (lat2 * Math.PI) / 180;
	const Δφ = ((lat2 - lat1) * Math.PI) / 180;
	const Δλ = ((lng2 - lng1) * Math.PI) / 180;
	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c; // in metres

	switch (unit) {
		case 'kms':
			return { distance: d * 0.001, unit: 'kms' };
		case 'miles':
			return { distance: d * 0.000621371, unit: 'miles' };
		case 'ms':
			return { distance: d, unit: 'ms' };
	}
}

export function userRepresentationOnMap(state: GeolocationStateT): HTMLElement {
	const wrapper = document.createElement('div');
	wrapper.classList.add('user-marker');

	const emoji = document.createElement('p');
	emoji.setAttribute('data-thing', 'emoji');
	emoji.innerText = `🙋`;

	const you = document.createElement('p');
	you.setAttribute('data-thing', 'you');
	you.innerText = `You are Here`;

	wrapper.appendChild(emoji);
	// wrapper.appendChild(you);

	return wrapper;
}

export function spaceRepresentationOnMap(space: SpaceT, id: number = 0): HTMLElement {
	const wrapper = document.createElement('div');
	wrapper.classList.add('map-marker');
	wrapper.setAttribute('data-type', space.type);

	const spaceName = document.createElement('p');
	spaceName.classList.add('space-name');
	spaceName.innerText = `${space.name}`;

	const popoType = document.createElement('div');
	popoType.classList.add('space-type');

	const typeEmojis: Record<string, string> = {
		Cafe: '☕',
		POPO: '🏢',
		Park: '🌲',
		Library: '📚',
		Hotel: '🏨',
		Museum: '🏛️',
		'Community Center': '🏠',
		Bookstore: '📖',
		Rooftop: '🌆',
		Plaza: '⛲'
	};

	popoType.innerText = typeEmojis[space.type] ?? '📍';

	wrapper.appendChild(popoType);
	wrapper.appendChild(spaceName);

	return wrapper;
}

export function mapMarkerDeselected(marker: HTMLElement) {
	marker.setAttribute('data-selected', 'false');
}

export function mapMarkerSelected(marker: HTMLElement) {
	marker.setAttribute('data-selected', 'true');
}

export function isDebugView(page: Page) {
	return page.url.searchParams.has('debug');
}

export function getStarRating(rating: number, max = 5, empty = '☆', full = '★'): string {
	const starRating: string[] = new Array(max).fill(empty);
	for (let i = 0; i < rating; i++) {
		starRating[i] = full;
	}

	return starRating.join('');
}

export function filterSpaces(
	spaces: Array<SpaceT>,
	filters: CityFilters,
	userLocation: GeolocationStateT | null
): Array<SpaceT> {
	if (!spaces?.length) {
		return [];
	}

	const now = new Date();
	let fullList = [...spaces];
	if (filters.spaceName !== '') {
		fullList = [...spacesFuse.search(filters.spaceName).map((x) => x.item)];
	}

	fullList = fullList.filter((space) => {
		if (filters.showOnlyVetted && !space.vetted) {
			return false;
		}

		if (filters.spaceType !== '' && space.type !== filters.spaceType) {
			return false;
		}

		if (filters.showOnlyOpen && getLocationOpenInformation(now, space).status !== 'open') {
			return false;
		}

		return true;
	});

	return fullList;
}

const DAY_SHORT_NAME_TO_DAY_NUMBER: { [key: string]: number } = {
	su: 0,
	mo: 1,
	tu: 2,
	we: 3,
	th: 4,
	fr: 5,
	sa: 6
};
function timeToDate(start: Date, end: Date): { days: number; hours: number; minutes: number } {
	const diffMs = end.valueOf() - start.valueOf();
	const diffDays = Math.floor(diffMs / 86400000); // days
	const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
	const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

	return {
		days: diffDays,
		hours: diffHrs,
		minutes: diffMins
	};
}

export function getLocationOpenInformation(now: Date, location: SpaceT): OpenInformationT {
	if (location.openingHours === 'always open') {
		return { status: 'open' };
	}
	if (location.openingHours === 'closed') {
		return { status: 'permanently closed' };
	}
	if (location.openingHours === 'temporarily closed') {
		return { status: 'temporarily closed' };
	}

	// Invariant: We have an space that is sometimes open

	const nowDay = now.getDay();
	for (let [days, time] of Object.entries(location.openingHours)) {
		for (let i = 0; i < days.length; i += 2) {
			const day: string = days.slice(i, i + 2).toLowerCase();
			const day_number: number | undefined = DAY_SHORT_NAME_TO_DAY_NUMBER[day];

			if (day_number !== undefined && nowDay === day_number) {
				const openingTime = time[0];
				const closingTime = time[1];

				let start = new Date(now);
				start.setHours(openingTime, 0, 0, 0);
				let end = new Date(now);
				end.setHours(closingTime, 0, 0, 0);

				if (now < start) {
					const timeToOpen = timeToDate(now, start);
					return { status: 'closed', from: timeToOpen };
				} else if (now > end) {
					return { status: 'closed' };
				} else {
					const timeToClose = timeToDate(now, end);
					return { status: 'open', till: timeToClose };
				}
			}
		}
	}

	return { status: 'closed' };
}
