import type { CoordinateT, DistanceUnit, SpaceT } from "./types";


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

export function userRepresentationOnMap(pos: GeolocationPosition): Element {
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

export function spaceRepresentationOnMap(space: SpaceT): Element {
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
    }

    return wrapper;
}

export function mapMarkerDeselected(marker: Element) {
    marker.setAttribute("data-selected", "false");
}

export function mapMarkerSelected(marker: Element) {
    marker.setAttribute("data-selected", "true");
}