import type { PageLoad } from "./$types";
import spaceData from "$lib/spaces";

export const load: PageLoad = async ({ params }) => {
    return {
        spaces: spaceData
    }
}