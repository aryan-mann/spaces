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

export interface SpaceT {
    name: string;
    type: string;
    images?: string[];
    openingHours: string;
    description: string;
    coordinates: CoordinateT;
    address?: string;
    vetted?: boolean;
    featured?: boolean;
    tags?: string[];
    authorNote?: string;
    rating?: number;
}
