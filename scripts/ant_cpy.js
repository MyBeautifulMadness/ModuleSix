import { Circle, Field, Position, Rectangle } from "../modules/drawning_r.js"

const set_point_range = document.getElementById("set_point")
const remove_point_range = document.getElementById("remove_point")

const CELL_TYPE = {
    WALL: "Wall",
    SPACE: "Space"
}

const CELL_COLORS = {
    "Wall": "black",
    "Space": "white"
}

const MODE = {
    Ant: "ant",
    Food: "food",
    Wall: "wall",
    Rubber: "rubber"
}

let colony;
let food;
let mode = MODE.Wall;
let draw = false;

class Ant {
    constructor (pheromone) {
        this.way = [];
        this.pheromone = pheromone;
    }
}

class Cell extends Rectangle {
    constructor(position, type, width, height) {
        super(position, CELL_COLORS[type], width, height);
        this.type = type
    }

    setType(type) {
        this.type = type;
        this.color = CELL_COLORS[this.type];
    }
}

class Food extends Rectangle {
    constructor(position, nutrition) {
        super(position, "green", 20, 20);
        this.nutrition = nutrition;
    }
}

class AntsColony extends Rectangle {
    constructor(position, population) {
        super(position, "red", 20, 20);
        this.population = population;
        this.ants = [];
    }
}

const field = new Field("field");
const cell_size = 5;

init()

function init() {
    for (let x = 0; x < field.canvas.width; x += cell_size) {
        for (let y = 0; y < field.canvas.height; y += cell_size) {
            field.appendObject(new Cell(new Position(x, y), CELL_TYPE.SPACE, cell_size, cell_size));
        }
    }
    field.display()
}

function getUserClickPosition (event) {
    const rectangle = field.canvas.getBoundingClientRect();
    let x = event.clientX - rectangle.left;
    let y = event.clientY - rectangle.top;

    let position = new Position(x, y);
    return position;
}

field.canvas.addEventListener("mousedown", () => {
    draw = true;
});

field.canvas.addEventListener("mouseup", () => {
    draw = false;
});

field.canvas.addEventListener("mousemove", (event) => {
    if (!draw) {
        return;
    }

    let position = getUserClickPosition(event);
    let object = field.findByPosition(position);
    
    object.setType(CELL_TYPE.WALL)

    field.display();
})

set_ants_range.addEventListener("input", () => { mode = MODE.Ant })
set_food_range.addEventListener("input", () => { mode = MODE.Food })
set_wall_range.addEventListener("input", () => { mode = MODE.Wall })
set_rubber_range.addEventListener("input", () => { mode = MODE.Rubber })