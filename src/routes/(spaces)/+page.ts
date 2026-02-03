import type { PageLoad } from './$types';
import spacesDataSF from '$lib/spaces_sf.jsonc';
import type { SpaceT } from '$lib/types';

const spaces: SpaceT[] = (spacesDataSF as SpaceT[]).map((space) => ({
	...space,
	city: 'san-francisco'
}));

export const load: PageLoad = async () => {
	return {
		spaces
	};
};
