import { Field, Position, Object } from "../modules/drawning.js"
const colors = ["#f08080", "#a0c4ff", "#60d394", "#ffd97d", "#A5A5A5", "#f46036", "#0f7173", "#6c5b7b", "#a01a7d", "#d5ac4e"];

let field = new Field("test");

field.appendObject(new Position(100, 100), "Circle", ["#f08080", "#a0c4ff", "#60d394"], 25);
field.appendObject(new Position(230, 230), "Circle", ["#A5A5A5", "#f46036"], 20);
field.appendObject(new Position(300, 100), "Circle", ["#f08080"], 10);

field.display();

field.canvas.addEventListener("mousemove", function(event) {
    field.display();

    let position = getUserClickPosition(event);

    field.context.beginPath();
    field.context.strokeStyle = "gray";
    field.context.fillStyle = "gray";
    field.context.arc(position.x, position.y, 10, 0, 2 * Math.PI);
    field.context.stroke();
});

field.canvas.addEventListener("click", function(event) {
    field.createObject(field.getUserClickPosition(event), "Circle", ["black"], 10);
    field.display();
});