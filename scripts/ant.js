import { Circle, Field, Position} from "../modules/drawning_r.js"

class Point extends Circle {
    constructor(position) {
        super(position, "black", 8);
    }
}

class Graph {
    constructor(points) {
        this.edges = [];
        for (let i = 0; i < points.length; i++) {
            for (let j = 0; j < points.length)ж
        }
    }

    add_edge(source, destination) {
        this.edges[source].push(destination)
    }
}

const set_point_range = document.getElementById("set_point")
const remove_point_range = document.getElementById("remove_point")

const field = new Field("field");

const MODES = {
    Set: "set",
    Remove: "remove"
};

let mode = MODES.Set;

function getUserClickPosition (event) {
    const rectangle = field.canvas.getBoundingClientRect();
    let x = event.clientX - rectangle.left;
    let y = event.clientY - rectangle.top;

    let position = new Position(x, y);
    return position;
}

field.canvas.addEventListener("click", (event) => {
    let position = getUserClickPosition(event);
    
    if (mode === MODES.Set) {
        let point = new Point(position);
        field.appendObject(point);
    }
    else if (mode === MODES.Remove) {
        let index = field.findIndexByPosition(position);
        field.removeObject(index);
    }
    field.display();
    console.log(field.objects)
})

set_point_range.addEventListener("input", () => { mode = MODES.Set });
remove_point_range.addEventListener("input", () => { mode = MODES.Remove});