function insert(svg, x, y, text) {
    // Создаем круг
    var circle = document.createElementNS("http://www.w3.org/2000/svg","circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 30); // Радиус круга
    circle.classList.add("node-circle"); // Применяем стили к кругу

    // Создаем текст внутри круга
    var textNode = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textNode.setAttribute("x", x);
    textNode.setAttribute("y", y);
    textNode.setAttribute("text-anchor", "middle");
    textNode.setAttribute("dominant-baseline", "central");
    textNode.textContent = text;

    // Вставляем круг и текст в SVG
    svg.appendChild(circle);
    svg.appendChild(textNode);
}

// Функция для рисования линии между двумя точками
function drawLine(svg, x1, y1, x2, y2) {
    // Создаем линию
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.classList.add("line"); // Применяем стили к линии

    // Вставляем линию в SVG
    svg.appendChild(line);
}

function decisionLine(svg, x1, y1, x2, y2) {
    // Создаем линию
    var dline = document.createElementNS("http://www.w3.org/2000/svg", "line");
    dline.setAttribute("x1", x1);
    dline.setAttribute("y1", y1);
    dline.setAttribute("x2", x2);
    dline.setAttribute("y2", y2);
    dline.classList.add("dline"); // Применяем стили к линии

    // Вставляем линию в SVG
    svg.appendChild(dline);
}

//создаем контейнер для svg данных
var sample={
    age:0,
    weight:0,
    length:0,
    gender:'a'
}
var storage=[];
var prediction=0;

//заносим эти данные в массив контейнеров
function insertData(a,w,l,g)
{
    if(a && w && l && g)
    {
    storage[prediction]={};
    storage[prediction].age=a;
    storage[prediction].weight=w;
    storage[prediction].length=l;
    storage[prediction].gender=g;
    console.log(storage[prediction].age);
    console.log(storage[prediction].weight);
    console.log(storage[prediction].length);
    console.log(storage[prediction].gender);
    prediction+=1;
    console.log("Data inserted sucsessfull")}
}
var averageMaleAge=0;
var averageMaleWeight=0;
var averageMaleLength=0;
var averageFemaleAge=0;
var averageFemaleWeight=0;
var averageFemaleLength=0;
//вычисляем среднее значения для мужчин и женщин
function countAverage()
{
    var malecounter=0;
    var femalecounter=0;
    for(var i=0; i<prediction; i++)
    {
        if (storage[i].gender==="M"||storage[i].gender=== "М")
        {
            averageMaleAge=+averageMaleAge+ +storage[i].age;
            averageMaleWeight=+averageMaleWeight+ +storage[i].weight;
            averageMaleLength=+averageMaleLength+ +storage[i].length;
            malecounter++;
        }
        else
        {
            averageFemaleAge=+averageFemaleAge+ +storage[i].age;
            averageFemaleWeight=+averageFemaleWeight+ +storage[i].weight;
            averageFemaleLength=+averageFemaleLength+ +storage[i].length;
            femalecounter++;
        }
    }
    averageMaleAge/=malecounter;
    averageMaleWeight/=malecounter;
    averageMaleLength/=malecounter;
    averageFemaleAge/=femalecounter;
    averageFemaleWeight/=femalecounter;
    averageFemaleLength/=malecounter;
    console.log("Tree created sucsessfull");
    console.log("average male age"+averageMaleAge);
    console.log("average female age"+averageFemaleAge);
    console.log("average male weight"+averageMaleWeight);
    console.log("average female weight"+averageFemaleWeight);
    console.log("average male length"+averageMaleLength);
    console.log("average female length"+averageFemaleLength);
// Вставляем круги дерева и соединяем их линиями
var svg = document.getElementById("tree-svg");
insert(svg, 200, 50, "Возраст ближе к "+ averageMaleAge+ " чем к "+averageFemaleAge+ " ?");
insert(svg, 450, 150, "Да");
insert(svg, 150, 150, "Нет");
insert(svg, 150, 250, "Длина волос ближе к "+averageMaleLength+" чем к "+averageFemaleLength+" ?");
insert(svg, 200, 350, "Да");
insert(svg, 100, 350, "Нет");
insert(svg, 200, 450, "Мужчина");
insert(svg, 100, 450, "Женщина");
insert(svg, 450, 250, "Вес ближе к "+averageMaleAge+ " чем к "+averageFemaleAge+" ?");
insert(svg, 600, 350, "Да");
insert(svg, 400, 350, "Нет");
insert(svg, 400, 450, "Длина волос ближе к "+averageMaleLength+" чем к "+averageFemaleLength+" ?");
insert(svg, 450, 550, "Да");
insert(svg, 350, 550, "Нет");
insert(svg, 450, 650, "Мужчина");
insert(svg, 350, 650, "Женщина");
insert(svg, 600, 450, "Мужчина");

drawLine(svg, 200, 50, 450, 150);
drawLine(svg, 200, 50, 150, 150);
drawLine(svg, 150, 250, 100, 350);
drawLine(svg, 150, 250, 200, 350);
drawLine(svg, 150, 150, 150, 250);
drawLine(svg, 450, 150, 450, 250);
drawLine(svg, 100, 350, 100, 450);
drawLine(svg, 200, 350, 200, 450);
drawLine(svg, 450, 250, 600, 350);
drawLine(svg, 450, 250, 400, 350);
drawLine(svg, 600, 350, 600, 450);
drawLine(svg, 400, 350, 400, 450);
drawLine(svg, 400, 450, 450, 550);
drawLine(svg, 400, 450, 350, 550);
drawLine(svg, 450, 550, 450, 650);
drawLine(svg, 350, 550, 350, 650);
}

//принимаем решения попутно раскрашивая линии правильных ответов красным
function decision(a,w,l)
{
    var svg = document.getElementById("tree-svg");
    console.log(a,w,l);
    if(a && w && l)
    {
    console.log("Вопрос 1: Возраст ближе к "+averageMaleAge+  " чем к "+averageFemaleAge+"?");
    if(Math.abs(a-averageMaleAge) >= Math.abs(a-averageFemaleAge))
    {
        console.log("No->\n"+"Вопрос 2: Длина волос ближе к "+averageMaleLength+ " чем к "+averageFemaleLength +"?");
        decisionLine(svg, 200, 50, 150, 150);
        decisionLine(svg, 150, 150, 150, 250);
        if(Math.abs(l-averageMaleLength) >= Math.abs(l-averageFemaleLength))
        {
            console.log("No->Female");
            decisionLine(svg, 150, 250, 100, 350);
            decisionLine(svg, 100, 350, 100, 450);
        }
        else{
            console.log("Yes->Male");
            decisionLine(svg, 150, 250, 200, 350);
            decisionLine(svg, 200, 350, 200, 450);
        }
    }
    else {
        decisionLine(svg, 200, 50, 450, 150);
        decisionLine(svg, 450, 150, 450, 250);
        console.log("Yes->\n"+"Вопрос 2: Вес ближе к "+averageMaleWeight+ " чем к "+averageFemaleWeight +"?");
        if(Math.abs(w-averageMaleWeight) <= Math.abs(w-averageFemaleWeight)){
            console.log("Yes->Male");
            decisionLine(svg, 450, 250, 600, 350);
            decisionLine(svg, 600, 350, 600, 450);
        }
        else
        {
            console.log("No->\n"+"Вопрос 3: Длина волос ближе к "+averageMaleLength+ " чем к "+averageFemaleLength +"?");
            decisionLine(svg, 450, 250, 400, 350);
            decisionLine(svg, 400, 350, 400, 450);
            if(Math.abs(l-averageMaleLength) >= Math.abs(l-averageFemaleLength))
            {
                console.log("No->Female");
                decisionLine(svg, 400, 450, 350, 550);
                decisionLine(svg, 350, 550, 350, 650);
            }
            else{
                console.log("Yes->Male");
                decisionLine(svg, 400, 450, 450, 550);
                decisionLine(svg, 450, 550, 450, 650);
            }
        }
    }}
}