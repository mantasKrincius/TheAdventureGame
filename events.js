const town = document.querySelector("#town");
const arena = document.querySelector("#arena");
const castle = document.querySelector('#castle')
const toArenaBtn = document.querySelector('#toArena');
const toTownBtn = document.querySelector("#toTown");
const toTownFromCastleBtn = document.querySelector('#backToTown')
const toCastleBtn = document.querySelector('#toCastle')
const attBtn = document.querySelector("#creatureAttack");
const servantAttBtn = document.querySelector('#kingAttack');
const continueToFight = document.querySelector('#chooseCreature');
const healingBtn = document.querySelector('#heal');
const lvlUpBtn = document.querySelector('#lvlup');
const skill1Btn = document.querySelector('#skill1');

const modal = document.querySelector('#churchModal');
const healingbtn = document.querySelector('#toChurch');
const span = document.getElementsByClassName("close")[0];

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

let playerCard;
//saving to localstorage
if (localStorage.getItem('playerInfo')) {
    playerCard = JSON.parse(localStorage.getItem('playerInfo'));
} else {
    playerCard = {
        name: "",
        level: 2,
        attack: 8,
        defense: 8,
        hitpoints: 30,
        maxhp: 35,
        exp: 19,
        lvlup: 20,
        gold: 50,
        magic: 0,
        maxmagic: 20
    };
}
savePlayerInfo();

let creature;
let creatures = [{
    name: "Orc",
    attack: 7,
    defense: 5,
    hp: 4,
    exp: 1,
    gold: 2
}, {
    name: "Goblin",
    attack: 6,
    defense: 3,
    hp: 5,
    exp: 1,
    gold: 1
}, {
    name: "Ogre",
    attack: 8,
    defense: 2,
    hp: 2,
    exp: 1,
    gold: 2
}, {
    name: "Shaman",
    attack: 5,
    defense: 1,
    hp: 3,
    exp: 1,
    gold: 1
}];

let king = {
    name: "King Jonathan",
    attack: 10,
    defense: 10,
    hp: 100
};

createCreature();
unlockCastle();
creatureInfo();
kingInfo();
playerInfo();
skilleHealYourSelfUnlock();

//MOVING BETWEEN TOWN AND ARENA (adding and removing classes)
toArenaBtn.addEventListener('click', () => {
    arena.classList.remove("d-none");
    town.classList.remove("d-block");
    town.classList.add("d-none");
    arena.classList.add("d-block");
    screencleaner();
});

toTownBtn.addEventListener('click', () => {
    town.classList.remove("d-none");
    arena.classList.remove("d-block");
    town.classList.add("d-block");
    arena.classList.add("d-none");
    screencleaner();
})

toCastleBtn.addEventListener('click', () => {
    town.classList.remove("d-block");
    castle.classList.remove("d-none");
    town.classList.add("d-none");
    castle.classList.add("d-block");
    screencleaner();
})

toTownFromCastleBtn.addEventListener('click', () => {
    town.classList.remove("d-none");
    castle.classList.remove("d-block");
    town.classList.add("d-block");
    castle.classList.add("d-none");
    screencleaner();
})

//little modal for church button
healingbtn.addEventListener('click', () => {
    modal.style.display = "block";
})
span.addEventListener('click', () => {
    modal.style.display = "none";
})
document.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
})

servantAttBtn.addEventListener('click', attackKing);
attBtn.addEventListener('click', challengeMonster);
continueToFight.addEventListener('click', nextCreature);
healingBtn.addEventListener('click', healing);
lvlUpBtn.addEventListener('click', lvlup);
lvlUpBtn.addEventListener('click', unlockCastle);
skill1Btn.addEventListener('click', learnHeal);

//formula: step1. Getting modifier numbers to check creature/player hit or miss, checking attack vs defense stats.
//formula: step2. In hit case: attack adding random number to increase damage and result, taking off from hit points.
//formula: step3. If missed, send message that creature/player miss.
function challengeMonster() {
    /* 1 */
    const playerAtt = document.querySelector('.PlayerAtt');
    let attackCheck = playerCard.attack + random(0, 10);
    let defenseCheck = creature.defense + random(0, 10);
    if (attackCheck > defenseCheck) {
        let damage = playerCard.attack + random(0, 5);
        /* 2 */
        creature.hp = creature.hp - damage;
        playerAtt.innerHTML = `${playerCard.name} HIT ${damage}, YES!<br>`;
    } else {
        /* 3 */
        playerAtt.innerHTML = `${playerCard.name} Missed again... <br>`;
    }

    const monsterAtt = document.querySelector('.MonsterAtt');
    let creatureAttackCheck = creature.attack + random(0, 10);
    let playerDefenseCheck = playerCard.defense + random(0, 10);
    if (creatureAttackCheck >= playerDefenseCheck) {
        let damage = creature.attack + random(0, 5);
        playerCard.hitpoints = playerCard.hitpoints - damage;
        monsterAtt.innerHTML = `${creature.name} HIT ${damage}, muahaha!<br>`;
    } else {
        monsterAtt.innerHTML = `${creature.name} Missed <br>`;
    }

    toTownBtn.disabled = true;
    continueToFight.disabled = true;
    savePlayerInfo();
    playerInfo();
    playerdead();
    creaturedead();
    creatureInfo();
}

//Similar as above formula. Differences:
// If king have less than 50hp, his modifier changed to higher.
// If player missed, king heal his self 5hp
// Damage what were made by king or player equil to them attack status.
function attackKing() {
    const playerAtt = document.querySelector('#PlayerAtt');
    let playerAttack = random(1, 5) + playerCard.attack;
    let kingDefense = random(1, 5) + king.defense;
    if (king.hp > 50) {
        kingDefense = random(3, 10) + king.defense;
    }

    if (playerAttack > kingDefense) {
        king.hp = king.hp - playerCard.attack;
        playerAtt.innerHTML = `<p>${playerCard.name}: I just hit ${playerCard.attack} damage!... Surrender, Jonathan!!</p>`;
    } else {
        king.hp = king.hp + 5;
        playerAtt.innerHTML = `<p>${playerCard.name}: Damn, missed... You're CHEATER!</p>`;
    }
    const monsterAtt = document.querySelector('#MonsterAtt');
    let kingAttack = random(1, 5) + king.attack;
    let playerDefense = random(1, 5) + playerCard.defense;

    if (kingAttack > playerDefense) {
        playerCard.hitpoints = playerCard.hitpoints - kingAttack;
        monsterAtt.innerHTML = `<p>Jonathan: enjoy ${king.attack} damage to your face! HAHA</p>`;
    } else {
        monsterAtt.innerHTML = `<p>Jonathan: Damn, ${playerCard.name}, i missed!</p>`;
    }
    playerdead();
    playerInfo();
    kingInfo();
    kingdead();
    savePlayerInfo();
}


//if king killer, removing container and creating "you win" message, image
function kingdead() {
    if (king.hp < 1) {
        const container = document.querySelector(".container");
        document.body.removeChild(container);
        const story = document.querySelector("#storyContent");
        document.body.removeChild(story);
        const titleDiv = document.createElement('div');
        const div = document.createElement('div');
        const victoryMessage = document.createElement('p');
        const victoryImg = document.createElement('img');

        victoryMessage.style.fontSize = "40px";
        victoryMessage.append("Congratulations! You just defeated Jonathan! All love from all villages comes to You! <br> To be continue...");
        victoryImg.srcset = "https://i.ytimg.com/vi/gDg9By4yqYo/hqdefault.jpg";
        div.style.textAlign = "center";
        victoryMessage.style.textAlign = "center";

        document.body.prepend(titleDiv);
        titleDiv.append(div);
        div.appendChild(victoryImg);
        titleDiv.appendChild(victoryMessage);

        toTownFromCastleBtn.disabled = false;
        servantAttBtn.disabled = true;
    }
}

function screencleaner() {
    document.querySelector('#sadInfo').innerHTML = "";
    document.querySelector('#loot').innerHTML = "";
    document.querySelector('#goodInfo').innerHTML = "";
    document.querySelector('.PlayerAtt').innerHTML = "";
    document.querySelector('.MonsterAtt').innerHTML = "";
}


//with each level, creature and king getting stronger, just for fun, for later chapters
function creatureLvlUp() {
    creatures.forEach(item => {
        item.attack = item.attack + random(1, 2);
        item.defense = item.defense + playerCard.level;
        item.hp = item.hp + playerCard.level + 10;
        item.exp = item.exp + random(1, 3);
        item.gold = item.gold + random(1, 10);
    })

    king.attack = king.attack + random(0, 3);
    king.hp = king.hp + playerCard.level;
    king.defense = king.defense + random(0, 3);
}

function savePlayerInfo() {
    localStorage.setItem('playerInfo', JSON.stringify(playerCard));
}

//taking PARTS of creature, from creatures array and making ONE monster. To have bigger "random" chance.
function createCreature() {
    creature = {
        name: creatures[random(0, 4)].name,
        attack: creatures[random(0, 4)].attack,
        defense: creatures[random(0, 4)].defense,
        hp: creatures[random(0, 4)].hp,
        exp: creatures[random(0, 4)].exp,
        gold: creatures[random(0, 4)].gold
    }
}

function creatureInfo() {
    document.querySelector('#creatureInfo').innerHTML =
        `King Servants: ${creature.name}<br>
Hit Points: ${creature.hp} <br>
Attack Points: ${creature.attack} <br>
Defensive Points: ${creature.defense}<br>`
}

function kingInfo() {
    document.querySelector('#kingInfo').innerHTML =
        `King name: ${king.name}<br>
Hit Points: ${king.hp} <br>
Attack Points: ${king.attack} <br>
Defensive Points: ${king.defense}<br>`
}

function nextCreature() {
    createCreature();
    creatureInfo();
    attBtn.disabled = false;
    toTownBtn.disabled = false;
    screencleaner();
}

function playerInfo() {
    document.querySelector('#playerInfo').innerHTML =
        `Player name: ${playerCard.name}<br>
Level: ${playerCard.level} <br>
Hit Poins: ${playerCard.hitpoints} / ${playerCard.maxhp}<br>
Attack Points: ${playerCard.attack} <br>
Defensive Points: ${playerCard.defense}<br>
Gold: ${playerCard.gold}<br>
EXP: ${playerCard.exp} / ${playerCard.lvlup}<br>
Runes: ${playerCard.magic} / ${playerCard.maxmagic}
`
}

//after reach level 5, unlocked button castle
function unlockCastle() {
    playerCard.level >= 5 ? toCastleBtn.disabled = false : toCastleBtn.disabled = true;
}

function receiveExpGold() {
    playerCard.exp = playerCard.exp + creature.exp;
    playerCard.gold = playerCard.gold + creature.gold;
}

//after dead/injuried disabled attack and next btns
function playerdead() {
    if (playerCard.hitpoints < 0) {
        attBtn.disabled = true;
        servantAttBtn.disabled = true;
        continueToFight.disabled = true;
        toTownBtn.disabled = false;
        toTownFromCastleBtn.disabled = false
        document.querySelector("#sadInfo").innerHTML = "You need to see your doctor";
    }
}

function creaturedead() {
    if (creature.hp < 1 && playerCard.hitpoints > 1) {
        continueToFight.disabled = false;
        attBtn.disabled = true;
    }
    if (creature.hp < 1) {
        document.querySelector('#loot').innerHTML = `<p>Creature dead <br> You get killed ${creature.name} and find ${creature.gold} gold and got ${creature.exp} exp</p>`
        receiveExpGold();
        playerInfo();
    }
}

function healing() {
    let sadInfo = document.querySelector("#sadInfo");
    if (playerCard.gold >= 5 && playerCard.hitpoints !== playerCard.maxhp) {
        playerCard.gold = playerCard.gold - 5;
        playerCard.hitpoints = playerCard.hitpoints + 5;
        if (playerCard.hitpoints > playerCard.maxhp) {
            playerCard.hitpoints = playerCard.maxhp;
        }
        continueToFight.disabled = false;
        servantAttBtn.disabled = false;
        sadInfo.innerHTML = "<p>Healing, Healing, Healing thats my job</p> <br>";
        playerInfo();
        savePlayerInfo();
    } else {
        sadInfo.innerHTML = "<p>You are already full, or maybe you need to check your gold sack</p> <br>"
    }
    attBtn.disabled = false;
}

//player get level when he has enough exp points, everytime after hes lv lup, adding 20 to requirement for the next lvl up.
function lvlup() {
    if (playerCard.exp >= playerCard.lvlup) {
        playerCard.attack = playerCard.attack + random(1, 3);
        playerCard.defense = playerCard.defense + random(1, 3);
        playerCard.hitpoints = playerCard.hitpoints + random(1, 3);
        playerCard.maxhp = playerCard.maxhp + random(5, 15);
        playerCard.level = playerCard.level + 1;
        playerCard.exp = playerCard.exp - playerCard.lvlup;
        playerCard.lvlup = playerCard.lvlup + 20;
        playerCard.magic = playerCard.magic + 3;
        document.querySelector("#goodInfo").innerHTML = `<p>Congratulations! Lvl UP! Now you're ${playerCard.level} level!</p><br> Your stats increased as well!`
        savePlayerInfo();
        creatureLvlUp();
        skilleHealYourSelfUnlock();
        playerInfo()
    } else {
        document.querySelector("#goodInfo").innerHTML = "<p>You need to get more expierance</p><br>"
    }
    playerInfo();
}

/// WORKING ON SKILLS!

function skilleHealYourSelfUnlock() {
    const skill1 = document.querySelector('#skill1');
    // const skill2 = document.querySelector('#skill2');
    playerCard.level === 2 ? skill1.disabled = false : skill1.disabled = true;
    // playerCard.level === 3 ? skill2.disabled = false : skill2.disabled = true;
}

function learnHeal() {
    const skill1Btn = document.querySelector('#skill1');
    if (playerCard.gold >= 30) {
        playerCard.gold = playerCard.gold - 30;
        playerCard.magic = playerCard.magic + 3;
        creatingSkillButton();
        document.querySelector('#goodInfo').innerHTML = "Congratulations, You just learned your first skill!"
    } else {
        document.querySelector('#sadInfo').innerHTML = "Sorry mate, but you need 30 gold";
    }
    document.querySelector('#adds').removeChild(skill1Btn);
    savePlayerInfo();
    playerInfo();
}

function creatingSkillButton() {
    const arena = document.querySelector('#arena');
    const castle = document.querySelector('#castle');

    const button = document.createElement('button');

    button.innerHTML = "Skill1 <br> Heal";

    castle.appendChild(button);
    arena.appendChild(button);

    button.addEventListener('click', healYourSelf);
}

function healYourSelf() {
    if (playerCard.magic > 0) {
        playerCard.magic = playerCard.magic - 1;
        playerCard.hitpoints = playerCard.hitpoints + 30;
        document.querySelector('#goodInfo').innerHTML = "You just healed 20hp!";
    } else {
        document.querySelector('#sadInfo').innerHTML = "You need 1 rune for it!";
    }
    playerInfo();
    savePlayerInfo();
}


const storyChapters = ['<p>Waky waky, stranger... <br> Gods, why are you lying by the Antharas city gate...?</p>', '<p>I can see injuries at your body... <br> Are you are still in pain? </p>', '<p>I never saw you here. Are you new in a capital? <br> This place full of s**t... </p>', '<p>People who lives here, lives under pressure of our King Jonathan<br> He loves our gold and hates us... <br> He could kill anyone, only cus he is in a a bad mood <br> People scared and poor here... <br> We still waiting for our heroe.. Who will help us or at least defend us from our King Jonathan servants </p>', '<p>Thats how people lives here... <br> But im not gonna moan about it anymore to you, Sir <br> Would you like to eat some food, you look hungry.. </p>', '<p>Ill share with you just dry bread, but still better than nothing<br> Are you still wanna to get into city?</p>', '<p>If you want to help us... <br> Go to fight in arena, get some glory! Dont forget time to time visit our church...<br> And one day you will find a way to sort everything, stay strong..</p>', '<img class="gateDecoration" src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/787400/e54a88667f299c8c0196f33616e866688429008f.jpg" alt="the gate">', `<p>Before you enter to our city.. <br> The last question, stranger, whats your name?</p>`];
storyChaptersShowing(storyChapters, 0);

//ohh boys... this massive function... creating all story content... need to cut it to the units
// every index located in storychapters array above
function storyChaptersShowing(storyChapters, index) {
    const nextBtn = document.createElement('button');
    const p = document.createElement('p');
    const div = document.createElement('div');
    const output = document.createElement(`p`);
    const yesBtn = document.createElement('button');
    const noBtn = document.createElement('button');

    if (storyChapters[index] !== undefined) {

        div.style.border = "1pt solid black";
        div.style.width = "400pt";
        p.style.padding = "5pt";
        p.style.lineHeight = "auto";
        output.style.paddingLeft = "5pt";
        output.style.color = "blue";


        nextBtn.id = "next";
        output.id = "output";
        yesBtn.id = "yes";
        noBtn.id = "no";
        div.id = "storyContent";
        p.innerHTML = storyChapters[index];
        nextBtn.innerHTML = 'Next';

        div.appendChild(p);
        div.appendChild(nextBtn);
        div.appendChild(output);
        document.body.prepend(div);

        switch (index) {
            case 1:
                yesBtn.innerHTML = "Im in pain... But im a man!";
                noBtn.innerHTML = "No, im good, its just scratches";

                div.appendChild(yesBtn);
                div.appendChild(noBtn);

                yesBtn.addEventListener('click', questionOneYes);
                noBtn.addEventListener('click', questionOneNo);

                nextBtn.disabled = true;
                break

            case 2:
                yesBtn.innerHTML = "Yes, im just arrived, before someone welcomed me and attacked, why did you say so??";
                noBtn.innerHTML = "No, i was here few years ago and now someone welcomed me with swords, what news?";

                div.appendChild(yesBtn);
                div.appendChild(noBtn);

                yesBtn.addEventListener('click', questionTwoYes);
                noBtn.addEventListener('click', questionTwoNo);

                nextBtn.disabled = true;
                break

            case 4:
                yesBtn.innerHTML = "No thanks, im not hungry";
                noBtn.innerHTML = "Sure, im starving";

                div.appendChild(yesBtn);
                div.appendChild(noBtn);

                yesBtn.addEventListener('click', questionThreeYes);
                noBtn.addEventListener('click', questionThreeNo);

                nextBtn.disabled = true;
                break

            case 5:
                yesBtn.innerHTML = "Yes. I will kill that bastard and become a King!";
                noBtn.innerHTML = "Yes. I will defend all people";

                div.appendChild(yesBtn);
                div.appendChild(noBtn);

                yesBtn.addEventListener('click', questionFourYes);
                noBtn.addEventListener('click', questionFourNo);

                nextBtn.disabled = true;
                break

            case 8:
                const input = document.createElement('input');
                const sayTheNameBtn = document.createElement('button');


                sayTheNameBtn.innerHTML = "Tell your name";

                div.appendChild(input);
                div.appendChild(sayTheNameBtn);


                sayTheNameBtn.addEventListener('click', addingTheName);
                nextBtn.disabled = true;
                break
        }

        nextBtn.addEventListener('click', function () {
            let current = this;
            nextChapter(storyChapters, index, current);
        });
    }
}

function nextChapter(storyChapters, index, current) {
    let currentElem = current.parentElement;
    document.body.removeChild(currentElem);
    index++;
    storyChaptersShowing(storyChapters, index);
}

function option() {
    const nextBtn = document.querySelector('#next');
    const yesBtn = document.querySelector('#yes');
    const noBtn = document.querySelector('#no');
    nextBtn.disabled = false;
    yesBtn.disabled = true;
    noBtn.disabled = true;
}

function questionOneYes() {
    option();
    let add = random(1, 5);
    playerCard.maxhp = playerCard.maxhp - add;
    document.querySelector('#output').innerHTML = `You just lost ${add} max hitpoints`;
    savePlayerInfo();
}

function questionOneNo() {
    option();
    let add = random(5, 10);
    playerCard.maxhp = playerCard.maxhp + add;
    document.querySelector('#output').innerHTML = `You just got addinioal ${add} max hitpoints`;
    savePlayerInfo();
}

function questionTwoYes() {
    option();
    let add = random(1, 5);
    playerCard.exp = playerCard.exp + add;
    document.querySelector('#output').innerHTML = `You just got earned ${add} expierance`;
    savePlayerInfo();
}

function questionTwoNo() {
    option();
    let add = random(5, 10);
    playerCard.exp = playerCard.exp + add;
    document.querySelector('#output').innerHTML = `You just got earned ${add} expierance`;
    savePlayerInfo();
}

function questionThreeYes() {
    option();
    let add = random(1, 3);
    playerCard.hitpoints = playerCard.hitpoints + add;
    document.querySelector('#output').innerHTML = `You just got ${add} hitpoints`;
    savePlayerInfo();
}

function questionThreeNo() {
    option();
    let add = random(5, 10);
    playerCard.hitpoints = playerCard.hitpoints + add;
    document.querySelector('#output').innerHTML = `You just got ${add} hitpoints`;
    savePlayerInfo();
}

function questionFourYes() {
    option();
    let add = random(1, 5);
    playerCard.attack = playerCard.attack + add;
    document.querySelector('#output').innerHTML = `You just got earned ${add} attack`;
    savePlayerInfo();
}

function questionFourNo() {
    option();
    let add = random(1, 5);
    playerCard.defense = playerCard.defense + add;
    document.querySelector('#output').innerHTML = `You just got earned ${add} defense`;
    savePlayerInfo();
}

function addingTheName() {
    const input = document.querySelector('input');
    if (input.value === "") {
        document.querySelector('#output').innerHTML = "Please Enter Your Name!!";
    } else {
        playerCard.name = input.value;
        savePlayerInfo();
        enterToTheGame();
        playerInfo();
        enterToTheGame();
    }
}

//hide and seek with classes, story hide, main app in

function enterToTheGame() {
    document.querySelector('.container').classList.add("d-block");
    document.querySelector('#storyContent').classList.add("d-none");

}

loadingGame();

//if in localstorage player have a name, load main app, if not load story
function loadingGame() {
    const futureUpdates = document.querySelector('#futureUpdates');
    if (playerCard.name === "") {
        document.querySelector('#storyContent').classList.add("d-block");
        document.querySelector('.container').classList.add("d-none");
        document.body.removeChild(futureUpdates);
    } else {
        document.querySelector('#storyContent').classList.add("d-none");
        document.querySelector('.container').classList.add("d-block");
    }
}


//FOR FUTURE CHAPTERS TO CHANGE kingdead FUNCTIONS
// function kingdead() {
//     if (king.hp < 1) {
//         document.querySelector('#goodInfo').innerHTML = "You just killed a KING, King Dead, Hail New King"
//         toTownFromCastleBtn.disabled = false;
//         servantAttBtn.disabled = true;
//     }
// }

//ADDING ONE MORE SPELLS
// function whitePower() {
//     if (playerCard.magic > 0) {
//         playerCard.magic = playerCard.magic - 10;
//         playerCard.attack = playerCard.attack + 30;
//         document.querySelector('#goodInfo').innerHTML = "You just healed 20hp!";
//     } else {
//         document.querySelector('#sadInfo').innerHTML = "You need 10 runes for it";
//     }
//
//     playerInfo();
//     savePlayerInfo();
// }


// function learnWhitePower() {
//     const skill2Btn = document.querySelector('#skill2');
//     if (playerCard.gold >= 40) {
//         playerCard.gold = playerCard.gold - 40;
//         playerCard.magic = playerCard.magic + 5;
//         creatingSkill2Button();
//         document.querySelector('#goodInfo').innerHTML = "Congratulations, You just learned your second skill!"
//     } else {
//         document.querySelector('#sadInfo').innerHTML = "Sorry mate, but you need 40 gold";
//     }
//
//     document.querySelector('#adds').removeChild(skill2Btn);
//     savePlayerInfo();
//     playerInfo();
// }

// function creatingSkill2Button() {
//     const arena = document.querySelector('#arena');
//     const castle = document.querySelector('#castle');
//
//     const button = document.createElement('button');
//
//     button.innerHTML = "Skill2 <br> White Power";
//
//     castle.appendChild(button);
//     arena.appendChild(button);
//
//     button.addEventListener('click', whitePower);
// }

// create button in html for skill2