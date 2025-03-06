export type CharacterBuild = {
    id: number;
    name: string;
    picture: string;
    bgColor: string;
};

export type Character = {
    id: string;
    picture: any;
};

export const characterOptions: Character[] = [
    {id: 'hotdog', picture: require('./assets/Alphabet/Images/Hotdog.png')},
    {id: 'flower', picture: require('./assets/Alphabet/Images/Flower.png')},
    {id: 'tree', picture: require('./assets/Alphabet/Images/Tree.png')},
    {id: 'whale', picture: require('./assets/Alphabet/Images/Whale.png')},
    {id: 'moon', picture: require('./assets/Alphabet/Images/Moon.png')},
    {id: 'penguin', picture: require('./assets/Alphabet/Images/Penguin.png')},
];

export const bgColorOptions: string[] = ['#C3E2E5', '#C0E3B9', '#FDFFB8', '#FFDDF6', '#FFD195', '#FFA3A3'];

export var tempCharacterArray: CharacterBuild[] = [
    {
        id: 0, 
        name: "Shiloh", 
        picture: characterOptions[0].id, 
        bgColor: bgColorOptions[1],
    },
    {
        id: 1, 
        name: "Jessica", 
        picture: characterOptions[1].id,
        bgColor: bgColorOptions[3],
    },    
    {
        id: 2, 
        name: "Mina", 
        picture: characterOptions[5].id,
        bgColor: bgColorOptions[4],
    },
];

export const formatNameWithCapitals = (str: string) => 
    str.toLowerCase().replace(/\b\w|(?<=[-'])\w/g, char => char.toUpperCase());
    