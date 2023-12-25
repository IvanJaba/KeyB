const input = document.querySelector("input");
const letters = Array.from(document.querySelectorAll("[data-letters]"));
const specs = Array.from(document.querySelectorAll("[data-spec]"));
const textExample = document.querySelector("#textExample");
const symbolsPerMinute = document.querySelector("#symbolsPerMinute");
const errorPercent = document.querySelector("#errorPercent");

const text = "В земляной норе жил хоббит. Не в отвратительной, грязной, мокрой, пропахшей плесенью норе,где из стен то и дело высовываются червяки, но и не в сухой, голой песчаной норе, где не на что сесть и нечего съесть: это была хобичья нора, а хобичья нора обозначает удобства. У нее была прекрасная круглая дверь, похожая на иллюминатор, выкрашенная зеленой краской, с сверкающей желтой медной ручкой в самой середине. Дверь вела в проход, напоминающий туннель, очень удобный туннель, без дыма, со стенами, крытыми деревом, с потолком из плиток, покрытым ковром. В туннеле стояло множество полированных стульев, а на стенах – колышки для шляп и плащей: хоббиты любят гостей. Туннель, извиваясь, уходил в глубину, он углублялся в холм–просто Холм, как называли его на много миль в округе, и по обе стороны его располагались множество маленьких круглых дверей, сначала в одну сторону, потом в другую. У хоббитов не бывает вторых этажей: спальни, ванные, погреба, кладовые (множество кладовых), гардеробные (у нашего хоббита много помещений было отведено под одежду), кухни, столовые — все это располагалось слева (если посмотреть от входа), потому что толку у них были окна, глубоко посаженные круглые окна, выходящие в сад и на луг за садом, который уходит вниз к реке. Хоббит был очень преуспевающим, зажиточным хоббитом, и звали его Бэггинс. Бэггинсы жили в окрестностях Холма с незапамятных времен и считалась очень респектабельными, не только потому, что большинство их было богато, а потому, что у них никогда не бывало приключений и они не делали ничего неожиданного: ответ Бэггинса на любой вопрос можно было знать заранее, не трудясь спрашивать. Это рассказ о том, как у Бэггинса случалось приключение и ему пришлось говорить и делать нечто совершенно неожиданное. Он мог утратить уважение соседей, но приобрел — что ж, в конце вы сами решаете, приобрел ли он что-нибудь. Матушка нашего хоббита — но кто такой хоббит? Мне кажется, в наши дни хоббиты нужны в описании, потому что встречаются редко и сторонятся Большого Народа, как они называют нас. Это маленькие человечки (ими были маленькие человеческими), меньше гномов (и бород у них нет), но гораздо больше лилипутов. Они совсем или почти совсем не владеют волшебством, которое помогает им тихо и быстро исчезать, когда появляются большие глупые люди, как вы или я, с слоновьим топором, который можно слышать за милю. У хоббитов обычно круглые животики; одеваются они ярко (главным образом в зеленые и желтые цвета); не носят обувь, потому что на ступнях у них природные прочные подошвы, а ноги поросли густой теплый коричневой шерстью, как и их головы (шерсть эта курчавиться); у них длинные искусные коричневые пальцы, добродушные лица, и смеются они глубоко и сочно (особенно после обеда, который у них бывает дважды в день, если только это возможно).Теперь вы знаете достаточно, чтобы я мог продолжать. Как я уже начал, мать нашего хоббита — Бильбо Бэггинса — была замечательная Беллодонна Тук, одна из трех замечательных дочерей Старого Тука, главы хоббитов, которые жили за Водой, небольшой речкой, пробегавшей у подножия Холма. Всегда говорили, что Туки иногда соединились с семьями фей (менее дружественно настроенные упоминали семьи гоблинов), и поэтому в них было что–то не совсем хоббичье, а время от времени кто–нибудь из Туков отправлялся на поиски приключений. Такие хоббиты незаметно исчезали, и семья старалась замять это происшествие, но факт оставался фактом: Туки были не так респектабельны, как Бэггинсы, хотя, несомненно, богаче их.";
const party = createParty(text);

init();

function init() {
    input.addEventListener("keydown", keydownHandler);
    input.addEventListener("keyup", keyupHandler);

    viewUpdate();
}

function keydownHandler(event) {
    event.preventDefault();

    const letter = letters.find((x) => x.dataset.letters.includes(event.key));

    if (letter) {
        letter.classList.add("pressed");
        press(event.key);
        return;
    }

    let key = event.key.toLowerCase();

    if (key === " ") {
        key = "space";
        press(" ");
    }

    if (key === "enter") {
        press("\n");
    }

    const ownSpecs = specs.filter((x) => x.dataset.spec === key);

    if (ownSpecs.length) {
        ownSpecs.forEach((spec) => spec.classList.add("pressed"));
        return;
    }

    console.warn("Не известный вид клавиши.", event);
}

function keyupHandler(event) {
    event.preventDefault();

    const letter = letters.find((x) => x.dataset.letters.includes(event.key));

    if (letter) {
        letter.classList.remove("pressed");

        return;
    }

    let key = event.key.toLowerCase();

    if (key === " ") {
        key = "space";
    }

    const ownSpecs = specs.filter((x) => x.dataset.spec === key);

    if (ownSpecs.length) {
        ownSpecs.forEach((spec) => spec.classList.remove("pressed"));
        return;
    }
}

function createParty(text) {
    const party = {
        text,
        strings: [],
        maxStringLength: 70,
        maxShowStrings: 3,
        currentStringIndex: 0,
        currentPressedIndex: 0,
        errors: [],
        started: false,

        statisticFlag: false,
        timerCounter: 0,
        startTimer: 0,
        errorCounter: 0,
        commonCounter: 0,
    };

    party.text = party.text.replace(/\n/g, "\n ");
    const words = party.text.split(" ");

    let string = [];
    for (const word of words) {
        const newStringLength =
            [...string, word].join(" ").length + !word.includes("\n");

        if (newStringLength > party.maxStringLength) {
            party.strings.push(string.join(" ") + " ");
            string = [];
        }

        string.push(word);

        if (word.includes("\n")) {
            party.strings.push(string.join(" "));
            string = [];
        }
    }

    if (string.length) {
        party.strings.push(string.join(" "));
    }

    return party;
}

function press(letter) {
    party.started = true;

    if (!party.statisticFlag) {
        party.statisticFlag = true;
        party.startTimer = Date.now();
    }

    const string = party.strings[party.currentStringIndex];
    const mustLetter = string[party.currentPressedIndex];

    if (letter === mustLetter) {
        party.currentPressedIndex++;

        if (string.length <= party.currentPressedIndex) {
            party.currentPressedIndex = 0;
            party.currentStringIndex++;

            party.statisticFlag = false;
            party.timerCounter = Date.now() - party.startTimer;
        }
    } else if (!party.errors.includes(mustLetter)) {
        party.errors.push(mustLetter);
        party.errorCounter++;
    }

    party.commonCounter++;

    viewUpdate();
}

function viewUpdate() {
    const string = party.strings[party.currentStringIndex];

    const showedStrings = party.strings.slice(
        party.currentStringIndex,
        party.currentStringIndex + party.maxShowStrings
    );

    const div = document.createElement("div");

    const firstLine = document.createElement("div");
    firstLine.classList.add("line");
    div.append(firstLine);

    const done = document.createElement("span");
    done.classList.add("done");
    done.textContent = string.slice(0, party.currentPressedIndex);
    firstLine.append(
        done,
        ...string
            .slice(party.currentPressedIndex)
            .split("")
            .map((letter) => {
                if (letter === " ") {
                    return "·";
                }

                if (letter === "\n") {
                    return "¶";
                }

                if (party.errors.includes(letter)) {
                    const errorSpan = document.createElement("span");
                    errorSpan.classList.add("hint");
                    errorSpan.textContent = letter;
                    return errorSpan;
                }

                return letter;
            })
    );

    for (let i = 1; i < showedStrings.length; i++) {
        const line = document.createElement("div");
        line.classList.add("line");
        div.append(line);

        line.append(
            ...showedStrings[i].split("").map((letter) => {
                if (letter === " ") {
                    return "·";
                }

                if (letter === "\n") {
                    return "¶";
                }

                if (party.errors.includes(letter)) {
                    const errorSpan = document.createElement("span");
                    errorSpan.classList.add("hint");
                    errorSpan.textContent = letter;
                    return errorSpan;
                }

                return letter;
            })
        );
    }

    textExample.innerHTML = "";
    textExample.append(div);

    input.value = string.slice(0, party.currentPressedIndex);

    if (!party.statisticFlag && party.started) {
        symbolsPerMinute.textContent = Math.round(
            (60000 * party.commonCounter) / party.timerCounter
        );

        errorPercent.textContent =
            Math.floor((10000 * party.errorCounter) / party.commonCounter) / 100 +
            "%";
    }
}