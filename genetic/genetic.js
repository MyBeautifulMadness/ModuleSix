const canvas = document.getElementById('field');
const context = canvas.getContext('2d');
canvas.addEventListener('mousedown', handleMouseDown);
let mutationRate = document.getElementById("mutationRate").value;
let populationSize = document.getElementById("populationSize").value;
let maxGenerations = document.getElementById("maxGenerations").value;
let points = [];
function handleMouseDown(event) {
    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(x - 8, y - 8, 5, 0, Math.PI * 2);
    context.fill();
    points.push([x, y]);
}

function createPopulation(populationSize, cities) {
    const population = [];
    for (let i = 0; i < populationSize; i++) {
        // Перемешиваем города, чтобы создать случайный порядок
        const individual = cities.slice();
        for (let j = individual.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [individual[j], individual[k]] = [individual[k], individual[j]];
        }
        population.push(individual);
    }
    return population;
}

function calcFitness(pattern) {
    let totalDistance = 0;
    for (let i = 0; i < pattern.length - 1; i++) {
        const cityA = pattern[i];
        const cityB = pattern[i + 1];
        const dx = cityB[0] - cityA[0];
        const dy = cityB[1] - cityA[1];
        totalDistance += Math.sqrt(dx * dx + dy * dy);
    }
    return 100 / totalDistance;
}

function getFittest(cities) {
    let fittest = cities[0];
    let maxFitness = calcFitness(fittest);
    for (let i = 1; i < cities.length; i++) {
        const fitness = calcFitness(cities[i]);
        if (fitness > maxFitness) {
            fittest = cities[i];
            maxFitness = fitness;
        }
    }
    return fittest;
}

function crossover(parentA, parentB) {
    const offspring = new Array(parentA.length);
    let start = Math.floor(Math.random() * parentA.length);
    let end = Math.floor(Math.random() * parentA.length);

    while (start === end) {
        start = Math.floor(Math.random() * parentA.length);
        end = Math.floor(Math.random() * parentA.length);
    }
    if (start !== end) {
        // Меняем местами начало и конец, если начало больше конца
        if (start > end) {
            const temp = start;
            start = end;
            end = temp;
        }

        // Копируем города из родителя A в потомка
        for (let i = start; i <= end; i++) {
            offspring[i] = parentA[i];
        }

        // Копируем города из родителя B в потомка
        let j = 0;
        for (let i = 0; i < offspring.length; i++) {
            if (offspring[i] === undefined) {
                // Находим первый город в родительском элементе B, которого еще нет в дочернем элементе
                while (offspring.includes(parentB[j])) {
                    j++;
                }
                offspring[i] = parentB[j];
            }
        }
    }

    return offspring;
}

function mutate(pattern) {
    for (let i = 0; i < pattern.length; i++) {
        if (Math.random() < mutationRate) {
            const j = Math.floor(Math.random() * pattern.length);
            const temp = pattern[i];
            pattern[i] = pattern[j];
            pattern[j] = temp;
        }
    }
}

function sortPopulationByFitness(population) {
    population.sort((a, b) => calcFitness(a) - calcFitness(b));
}

function drawLineThroughPoints(ctx, dots) {
    if (dots.length < 2) {
        return;
    }

    // Перемещаем ручку в первую точку
    ctx.beginPath();
    ctx.moveTo(dots[0][0] - 8, dots[0][1] - 8);

    // Рисуем линию до каждой последующей точки
    for (let i = 1; i < dots.length; i++) {
        ctx.lineTo(dots[i][0] - 8, dots[i][1] - 8);
    }
    // Закрываем путь, чтобы соединить последнюю точку с первой точкой
    ctx.closePath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    // Обводим путь
    ctx.stroke();
}

function drawPoints(ctx, dots) {
    ctx.fillStyle = 'black';
    ctx.moveTo(dots[0][0], dots[0][1]);
    for (let i = 0; i < dots.length; i++) {
        const x = dots[i][0];
        const y = dots[i][1];
        ctx.beginPath();
        ctx.arc(x - 8, y - 8, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawPath(ctx, path) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawLineThroughPoints(ctx, path)
    drawPoints(ctx, points);
}
function animatepath(context, path) {
    // Анимация
    let animationFrame = 0;
    const maxFrames = 100;

    // Запускаем цикл анимаций
    const animationLoop = setInterval(() => {
        drawPath(context, path);
        // Проверяем, завершилась ли анимация
        if (++animationFrame >= maxFrames) {
            // Останавливаем цикл анимаций
            clearInterval(animationLoop);
        }
    }, 1000 / 60);
}

function start() {
    mutationRate = document.getElementById("mutationRate").value;
    populationSize = document.getElementById("populationSize").value;
    maxGenerations = document.getElementById("maxGenerations").value;

    let pop = createPopulation(populationSize, points);
    let generationCount = 0;
    let convergance = 0;
    let bestPathever = points;
    sortPopulationByFitness(pop);
    while (generationCount < maxGenerations && convergance < maxGenerations / 2) {
        let parents = [];
        let i = 0, j = i + 1;

        while (parents.length < populationSize) {
            for (let i = populationSize - 1; i > populationSize / 2; i--) {
                parents.push(pop[i])
            }
            if (populationSize - 1 - i === 0) {
                break;
            }
            if (populationSize - 1 - j === 0) {
                i++;
                j = i + 1;
            }
            let offspring = crossover(pop[populationSize - 1 - i], pop[populationSize - 1 - j]);
            if (offspring.length === points.length) {
                parents.push(offspring);
            }
            j++;
        }
        sortPopulationByFitness(parents);
        for (let i = 0; i < parents.length / 2; i++) {
            mutate(parents[i]);
        }
        sortPopulationByFitness(parents);
        pop = parents;
        let bestPathG = pop[populationSize - 1];
        if (calcFitness(bestPathG) - calcFitness(bestPathever) > 0) {
            bestPathever = bestPathG;
            convergance = 0;
        }
        convergance++;
        generationCount++;
        if (generationCount % 100 === 0) {
            animatepath(context, bestPathever);
            console.log(calcFitness(bestPathever));
        }
    }
}

function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
}