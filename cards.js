/*
    negative special - 28
    without special - 23
    with special - 18
    with strong special - 14
*/
module.exports = {
    //Strength chars
    giant: {
        cardTitle:"Giant",
        special:"none",
        animation:"giant",
        agility:3,
        intelligence:7,
        strength:13,
        descriptionTitle:"No special",
        description:""
    },
    leviathan: {
        cardTitle:"Leviathan",
        special:"fear",
        animation:"leviathan",
        agility:2,
        intelligence:2,
        strength:12,
        descriptionTitle:"Fear",
        description:"All cards enemy cards lose 1 from the game mode stat"
    },

    forestDragon : {
        cardTitle:"Forest Dragon",
        special:"entangle",
        animation:"forestDragon",
        agility:1,
        intelligence:4,
        strength:13,
        descriptionTitle:"Entangle",
        description:"Enemy agility becomes 1"
    },
    warrior: {
        cardTitle:"Warrior",
        special:"warCry",
        animation:"warrior",
        agility:7,
        intelligence:1,
        strength:10,
        descriptionTitle:"War Cry",
        description:"If the mode is strength + 6 strength"
    },
    
    knight: {
        cardTitle:"Knight",
        special:"warExperience",
        animation:"knight",
        agility:6,
        intelligence:4,
        strength:8,
        descriptionTitle:"War Experience",
        description:"+1 to the voted stat for every tied card."
    }
    ,

    //Agility characters
    antiMage: {
        cardTitle:"Mage hunter",
        special:"antiMage",
        animation:"antiMage",
        intelligence:5,
        strength:5,
        agility:8,
        descriptionTitle:"Intelligence Trap",
        description:"If you have less intelligence than the enemy, the enemy loses all stats."
    },
    theThing: {
        cardTitle:"The Thing",
        special:"squash",
        animation:"theThing",
        intelligence:2,
        strength:6,
        agility:10,
        descriptionTitle:"Squash",
        description:"If you have more strength than the enemy, the enemy loses all stats."
    },
    windElemental: {
        cardTitle:"Wind Elemental",
        special:"haste",
        animation:"windElemental",
        intelligence:2,
        strength:7,
        agility:9,
        descriptionTitle:"Haste",
        description:"+1 agility to all cards in your hand."
    },
    boxer: {
        cardTitle:"Boxer",
        special:"none",
        animation:"boxer",
        intelligence:3,
        strength:8,
        agility:12,
        description:"",
        descriptionTitle:"No special"
    },
    copyCat: {
        cardTitle:"Copy Cat",
        special:"copy",
        animation:"copyCat",
        intelligence:5,
        strength:2,
        agility:11,
        description:"If you have less in the voted stat than the enemy take the stat of your first hand card instead.",
        descriptionTitle:"copy"
    },
    
    //Intelligence characters
    scientist: {
        cardTitle:"Scientist",
        special:"science",
        intelligence:12,
        animation:"scientist",
        strength:2,
        agility:2,
        descriptionTitle:"Science!!!",
        description:"All cards in your hand get +1 for the game mode stat"
    },
    witch: {
        cardTitle:"Witch",
        special:"curse",
        animation:"witch",
        intelligence:9,
        agility:6,
        strength:3,
        description:"The first card in the enmeies hand becomes 1/1/1",
        descriptionTitle:"Curse"
    },
    oldWitcher: {
        cardTitle:"Witcher",
        special:"poison",
        animation:"oldMen",
        description:"The right most card of the enemy hand becomes 1/1/1",
        descriptionTitle:"Poison",
        intelligence:10,
        strength:7,
        agility:1
    },
    genie: {
        cardTitle:"Genie",
        special:"wish",
        animation:"genie",
        intelligence:10,
        agility:4,
        strength:4,
        description:"You get one point for the end scorer",
        descriptionTitle:"Wish"
    },
    philosopher:{
        cardTitle:"Philosopher",
        special:"none",
        animation:"philosopher",
        description:"",
        descriptionTitle:"No special",
        intelligence:13,
        strength:5,
        agility:5
    },

    //Balanced
    sphinx:{
        cardTitle:"Sphinx",
        special:"riddle",
        animation:"sphinx",
        description:"If you have more intelligence enemy loses all stats",
        descriptionTitle:"Riddle",
        intelligence:7,
        agility:5,
        strength:6
    },
    monk:{
        cardTitle:"Monk",
        special:"training",
        animation:"monk",
        description:"+3 for the voted stat",
        descriptionTitle:"Training",
        intelligence:7,
        agility:7,
        strength:4
    },
    devil: {
        cardTitle:"Devil",
        intelligence:6,
        animation:"devil",
        strength:6,
        agility:6,
        special:"hell",
        description:"+1 to mode stat for half of the cards you have taken",
        descriptionTitle:"Hell", 
    },
    hell: {
        cardTitle:"Hell",
        intelligence:6,
        animation:"hell",
        strength:6,
        agility:6,
        special:"payForSins",
        description:"+1 to mode stat for half of the taken cards your enemy has taken",
        descriptionTitle:"Pay for your sins", 
    },
    swissArmyKnife: {
        cardTitle:"Swiss army knife",
        special:"none",
        animation:"swissArmyKnife",
        description:"",
        descriptionTitle:"No special",
        intelligence:8,
        strength:8,
        agility:7
    },


    //1 lacking
    saturn: {
        cardTitle:"Saturn",
        special:"eatYourChildren",
        animation:"saturn",
        agility:2,
        intelligence:13,
        strength:13,
        descriptionTitle:"Eat your children",
        description:"Make the first card in your own hand 1/1/1"
    },

    angel: {
        cardTitle:"Angel",
        special:"blessing",
        animation:"angel",
        agility:8,
        intelligence:8,
        strength:2,
        descriptionTitle:"Blessing",
        description:"The first card in your hand gets +2 to all stats"
    },

    snakes: {
        cardTitle:"Snakes",
        special:"none",
        animation:"snakes",
        agility:11,
        intelligence:11,
        strength:1,
        descriptionTitle:"No special",
        description:""
    },
}