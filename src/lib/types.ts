export type DistanceUnit = "kms" | "miles" | "ms";

export interface MapMarkerT {
    latitude: number;
    lontitude: number;
    name: string;
}

export interface CoordinateT {
    lat: number,
    lng: number
}

export enum SupportedCity {
    SAN_FRANCISCO = "san-francisco"
}

export type CityFilters = {
    showOnlyVetted: boolean;
    showOnlyOpen: boolean,
    spaceType: string;
}

export interface GeolocationStateT {
	geoLocationAvailable: boolean | null;
	loading: boolean;
	location: GeolocationPosition | null;
	errorMessage: string | null;
    refreshCoords: () => void;
}

export interface SpaceDataT {
    version: number;
    cities: { [key in SupportedCity]: CityT }
}

export interface CityT {
    slug: string;
    address: string;
    images: string[];
    displayName: string;
    coordinates: CoordinateT;
    spaces: Array<SpaceT>;
}

export type OpeningHoursT = {
    [key: string]: number[]
} | "always open" | "temporarily closed" | "closed";


export type DetailTagT = { label: string, detail: string };
export type UrlTagT = { label: string, url: string };
export type TagT = string | DetailTagT | UrlTagT;

export const IsDetailTag = (item: any): item is DetailTagT => {
    return 'label' in item && 'detail' in item;
}
export const IsUrlTag = (item: any): item is UrlTagT => {
    return 'label' in item && 'url' in item;
}

type Location = {
    address: string;
    coordinates: CoordinateT;
}

export interface SpaceT {
    name: string;
    city?: string;
    type: "Cafe" | "POPO" | "Park";
    images: string[];
    openingHours: OpeningHoursT;
    description: string;
    location: Array<Location>;
    vetted: boolean;
    featured?: boolean;
    tags?: Array<TagT>;
    authorNote?: string;
    rating?: number;
}

export type DurationT = {
    days: number,
    hours: number,
    minutes: number
}

export type OpenInformationT = {
    status: "open" | "closed" | "temporarily closed" | "permanently closed",
    from?: DurationT,
    till?: DurationT 
}