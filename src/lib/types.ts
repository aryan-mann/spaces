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

export interface SpaceDataT {
    version: number;
    cities: { [key: string]: CityT }
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
