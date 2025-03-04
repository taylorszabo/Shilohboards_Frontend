import { Letter, Number } from "./GameContent";

//---------------------------------------------------------------------------------------
//Takes an array, shuffles it randomly, then returns it
export const shuffleArray = <T>(array: T[]): T[] => {
    let shuffled = [...array]; // Clone array to avoid mutating original
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Get random index
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
};

//---------------------------------------------------------------------------------------
//Takes in a letters or numbers array (as per Game Content types), and returns a shuffled/
//randomized list with X (count) number of items, which must include the item with the Id
//provided
export const getRandomItemsIncludingId = <T extends Letter | Number>(
    array: T[],
    count: number,
    includeId: string
): T[] => {
    // Ensure the provided ID exists in the array
    const includeItem = array.find(item => item.id === includeId);
    if (!includeItem) {
        console.error("The provided ID does not exist in the array.");
        return [];
    }

    // Filter out the item with the provided ID so we don't select it twice
    const filteredArray = array.filter(item => item.id !== includeId);

    // Shuffle the filtered array (Fisher-Yates Shuffle)
    for (let i = filteredArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredArray[i], filteredArray[j]] = [filteredArray[j], filteredArray[i]];
    }

    // Add the included item to the array and shuffle all items
    const allItems = [includeItem, ...filteredArray.slice(0, count - 1)];

    // Shuffle the entire array including the included item
    for (let i = allItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
    }

    return allItems;
};