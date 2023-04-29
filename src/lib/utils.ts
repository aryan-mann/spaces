import type { CityT, CoordinateT, DistanceUnit, CityFilters, GeolocationStateT, SpaceDataT, SpaceT, SupportedCity, OpeningHoursT, OpenInformationT } from "./types";
import type { Page } from "@sveltejs/kit";

export function distanceToUser(userLocation: GeolocationPosition, locationCoords: CoordinateT, unit: DistanceUnit = "ms"): string {
    const distance_in_unit = distanceBetweenCoordinates(
        { lat: userLocation.coords.latitude, lng: userLocation.coords.longitude },
        locationCoords,
        unit
    );

    return `${Math.round(distance_in_unit.distance)} ${distance_in_unit.unit}`;
}

export function distanceBetweenCoordinates(coord1: CoordinateT, coord2: CoordinateT, unit: DistanceUnit = "ms"): { distance: number, unit: DistanceUnit } {
    const R = 6371e3; // metres
    const lat1 = coord1.lat;
    const lat2 = coord2.lat;
    const lng1 = coord1.lng;
    const lng2 = coord2.lng;

    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // in metres

    switch (unit) {
        case "kms":
            return { distance: (d * 0.001), unit: "kms" };
        case "miles":
            return { distance: (d * 0.000621371), unit: "miles" };
        case "ms":
            return { distance: d, unit: "ms" };
    }
}

export function userRepresentationOnMap(state: GeolocationStateT): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add("user-marker");

    const emoji = document.createElement('p');
    emoji.setAttribute('data-thing', "emoji");
    emoji.innerText = `🙋`;

    const you = document.createElement('p');
    you.setAttribute('data-thing', "you");
    you.innerText = `You are Here`;

    wrapper.appendChild(emoji);
    // wrapper.appendChild(you);

    return wrapper;
}

export function spaceRepresentationOnMap(space: SpaceT): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add("map-marker");
    wrapper.setAttribute("data-type", space.type);

    const spaceName = document.createElement('p');
    spaceName.classList.add("space-name");
    spaceName.innerText = space.name;

    const popoType = document.createElement('div');
    popoType.classList.add("space-type");
    popoType.innerText = '🦛';

    wrapper.appendChild(popoType);
    wrapper.appendChild(spaceName);

    if (space.type === "Park") {
        popoType.innerText = '🌲';
    } else if (space.type === "Cafe") {
        popoType.innerText = '☕';
    }

    return wrapper;
}

export function mapMarkerDeselected(marker: HTMLElement) {
    marker.setAttribute("data-selected", "false");
}

export function mapMarkerSelected(marker: HTMLElement) {
    marker.setAttribute("data-selected", "true");
}

export function isDebugView(page: Page<Record<string, string>, string | null>) {
    return page.url.searchParams.has("debug");
}

export function getStarRating(rating: number, max = 5, empty = '☆', full = '★'): string {
    const starRating: string[] = new Array(max).fill(empty);
    for (let i=0; i < rating; i++) {
        starRating[i] = full;
    }

    return starRating.join('');
}

export function filterSpaces(spaces: Array<SpaceT>, filters: CityFilters, userLocation: GeolocationStateT | null): Array<SpaceT> {
    if (!spaces.length) {
        return []
    }

    const now = new Date();
    spaces = spaces.filter((space) => {
        if (filters.showOnlyVetted && !space.vetted){
            return false;
        }

        if (filters.spaceType !== '' && space.type !== filters.spaceType) {
            return false;
        }

        if (filters.showOnlyOpen && typeof space.openingHours !== "string" && !parseOpeningHours(now, space.openingHours).open) {
            return false;
        }

        return true;
    });

    spaces.sort((space1, space2) => {
        if (userLocation?.location?.coords) {
            const userCoords = { lat: userLocation.location.coords.latitude, lng: userLocation.location.coords.longitude };
            const space1Distance = distanceBetweenCoordinates(space1.coordinates, userCoords).distance;
            const space2Distance = distanceBetweenCoordinates(space2.coordinates, userCoords).distance;
            return space1Distance - space2Distance;
        }
        return + (space1.name > space2.name);
    });

    return spaces;
}

const DAY_SHORT_NAME_TO_DAY_NUMBER: { [key: string]: number } = { "mo": 1, "tu": 2, "we": 3, "th": 4, "fr": 5, "sa": 6, "su": 7 }
const DAY_SHORT_NAME_TO_LONG_NAME: { [key: string]: string } = { 
    "mo": "Monday", "tu": "Tuesday", "we": "Wednesday", "th": "Thursday", 
    "fr": "Friday", "sa": "Saturday", "su": "Sunday" 
}

function timeToDate(start: Date, end: Date): { days: number, hours: number, minutes: number } {
    const diffMs = (end.valueOf() - start.valueOf());
    const diffDays = Math.floor(diffMs / 86400000); // days
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

    return {
        days: diffDays,
        hours: diffHrs,
        minutes: diffMins
    }
}

export function hour24To12(num: number): string {
    if (num > 12) {
        return `${num-12}pm`;
    }
    return `${num}am`
}

export function openingHoursToDays(hours: OpeningHoursT): string[] {
    const fdays: Array<[string,string]> = [];

    if (typeof hours === "boolean") {
        if (!hours) {
            fdays.push([`All Days`, `Closed`])
        } else {
            fdays.push([`All Days`, `Open`])
        }
    }

    for (const timeEntry of Object.entries(hours)) {
        if (timeEntry == undefined)
            continue
        const [dayString, time] = timeEntry;

        for (let i=0; i < dayString.length; i+=2) {
            const day: string = dayString.slice(i, i+2).toLowerCase();
            const day_full: string = DAY_SHORT_NAME_TO_LONG_NAME[day];

            fdays.push([day_full, `${hour24To12(time[0])} to ${hour24To12(time[1])}`])
        }
    }

    return fdays;
}

export function parseOpeningHours(now: Date, hours: OpeningHoursT): OpenInformationT {
    if (typeof hours === "boolean") {
        return hours ? { open: true, temporarilyClosed: false } : { open: false, temporarilyClosed: true }
    }

    const nowDay = now.getDay();
    for (const timeEntry of Object.entries(hours)) {
        if (timeEntry === undefined) {
            continue;
        }

        const [days, time] = timeEntry;
        for (let i=0; i < days.length; i+= 2) {
            const day: string = days.slice(i, i+2).toLowerCase();
            const day_number: number | undefined = DAY_SHORT_NAME_TO_DAY_NUMBER[day];
            if (day_number && nowDay == day_number && time !== undefined) {
                const openingTime = time[0];
                const closingTime = time[1];

                const start = new Date(now);
                start.setHours(openingTime, 0, 0, 0);
                const end = new Date(now);
                end.setHours(closingTime, 0, 0, 0);

                if (now < start) {
                    const timeToOpen = timeToDate(now, start);
                    return { open: false, from: timeToOpen, temporarilyClosed: false }
                } else if (now > end) {
                    return { open: false, temporarilyClosed: false }
                } else {
                    const timeToClose = timeToDate(now, end);
                    return { open: true, till: timeToClose, temporarilyClosed: false }
                }
            }
        }
    }

    return { open: false, temporarilyClosed: false };
}