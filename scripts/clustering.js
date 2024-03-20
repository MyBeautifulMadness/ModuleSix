import { Field, Position } from "../modules/drawning.js"

class Point {
    constructor (position, weight, clusters) {
        this.position = position;
        this.weight = weight;
        this.clusters = clusters;
    }
}

class Cluster {
    constructor (position, name, color) {
        this.position = position;
        this.name = name;
        this.color = color;
    }
}

const colors = ["#f08080", "#a0c4ff", "#60d394", "#ffd97d", "#A5A5A5", "#f46036", "#0f7173", "#6c5b7b", "#a01a7d", "#d5ac4e"];
let div = document.getElementById("visualisation_field");
let canvas = document.getElementById("field");
canvas.width = div.offsetWidth;
canvas.height = div.offsetHeight;

let radius_range = document.getElementById("point_radius");
let set_point_radio = document.getElementById("set_point");
let remove_point_radio = document.getElementById("remove_point");
let explore_radio = document.getElementById("explore_field");
let clear_field_button = document.getElementById("clear_field_button");
let cluster_count_range = document.getElementById("cluster_count");
let point_radius_label = document.getElementById("point_radius_label");
let cluster_count_label = document.getElementById("cluster_count_label");
let clusterize_button = document.getElementById("clusterize_button");

let points = new Array();
let radius = radius_range.value;
let cluster_count = cluster_count_range.value;
let mode = "Draw";

let field = new Field("field");
field.canvas.style.cursor = "none";

clusterize_button.addEventListener("click", function(event) {
    let clusters = new Array(cluster_count);
    let checked = new Array(points.length).fill(false);
    let index;
    for (let i = 0; i < cluster_count; i++) {
        index = parseInt(Math.random() * points.length);
        while (checked[index]) {
            index = parseInt(Math.random() * points.length);
        }
        checked[index] = true;
        let position = new Position(points[index].position.x, points[index].position.y)
        let cluster = new Cluster(position, i + 1, colors[i]);
        clusters[i] = cluster;
    }

    console.log(clusters);

    for (let i = 0; i < 10000; i++) {
        for (let point of points) {
            let minDistance = 100000;
            for (let cluster of clusters) {
                let currentDistance = field.getPointsDistance(point.position, cluster.position) - point.weight;

                if (currentDistance < minDistance) {
                    minDistance = currentDistance;
                    point.clusters = [cluster.name];
                }
            }
        }

        for (let cluster of clusters) {
            let count = 0;
            let sumX = 0;
            let sumY = 0;
            for (let point of points) {
                if (point.clusters[0] == cluster.name) {
                    count++;
                    sumX += point.position.x;
                    sumY += point.position.y;
                }
            }

            cluster.position.x = parseInt(sumX / count);
            cluster.position.y = parseInt(sumY / count);
        }
    }

    for (let i = 0; i < points.length; i++) {
        field.objects[i].colors = [colors[points[i].clusters[0]]];
        console.log([colors[points[i].clusters[0]]]);
    }

    field.display();
});

field.canvas.addEventListener("mousemove", function(event) {
    if (mode =="Draw") {
        field.display();
    
        const rectangle = field.canvas.getBoundingClientRect();
        let x = event.clientX - rectangle.left;
        let y = event.clientY - rectangle.top;

        field.context.beginPath();
        field.context.strokeStyle = "gray";
        field.context.fillStyle = "gray";
        field.context.arc(x, y, radius, 0, 2 * Math.PI);
        field.context.stroke();
    }
});

field.canvas.addEventListener("mousedown", function(event) {
    switch (mode) {
        case "Draw":
            let position = field.getUserClickPosition(event);

            let point = new Point(position, radius, ["None"]);
            points.push(point);

            field.createObject(position, "Circle", ["black"], radius);
            break;

        case "Remove":
            let index = field.removeObject(field.getUserClickPosition(event));
            points = points.slice(0, index).concat(points.slice(index + 1));
            break;
        
        case "Explore":
            // Todo
            break;
    }
    field.display();
});

radius_range.addEventListener("input", function() {
    radius = radius_range.value;
    point_radius_label.innerText = "Point radius: " + radius.toString();
});

cluster_count_range.addEventListener("input", function() {
    cluster_count = cluster_count_range.value;
    cluster_count_label.innerText = "Clusters count: " + cluster_count.toString();
});

set_point_radio.addEventListener("input", function() {
    field.canvas.style.cursor = "none";
    mode = "Draw";
});

remove_point_radio.addEventListener("input", function() {
    mode = "Remove";
    field.canvas.style.cursor = "default";
    field.display();
});

explore_radio.addEventListener("input", function() {
    mode = "Explore";
    field.canvas.style.cursor = "default";
    field.display();
});

clear_field_button.addEventListener("click", function() {
    field.clear();
    points = [];
});
