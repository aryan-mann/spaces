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
} | boolean;

export interface SpaceT {
    name: string;
    type: string;
    images?: string[];
    openingHours: OpeningHoursT;
    description: string;
    coordinates: CoordinateT;
    address?: string;
    vetted?: boolean;
    featured?: boolean;
    tags?: string[];
    authorNote?: string;
    rating?: number;
}

export type DurationT = {
    days: number,
    hours: number,
    minutes: number
}

export type OpenInformationT = {
    open: boolean,
    from?: DurationT,
    till?: DurationT 
}