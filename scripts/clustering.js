import { Field, Position } from "../modules/drawning.js"

const colors = ["#f08080", "#a0c4ff", "#60d394", "#ffd97d", "#A5A5A5", "#f46036", "#0f7173", "#6c5b7b", "#a01a7d", "#d5ac4e"];

class Point {
    constructor (position, weight) {
        this.position = position;
        this.weight = weight;
        this.clusters = {
            "k-means": null
        };
    }
}

class Cluster {
    constructor (position, name, color) {
        this.position = position;
        this.name = name;
        this.color = color;
    }
}

let clear_field_button = document.getElementById("clear_field_button");
let export_button = document.getElementById("export_button");
let set_point_radio = document.getElementById("set_point");
let remove_point_radio = document.getElementById("remove_point");
let explore_radio = document.getElementById("explore_field");
let cluster_count_range = document.getElementById("cluster_count");
let radius_range = document.getElementById("point_radius");
let set_scale_range = document.getElementById("set_scale");
let point_radius_label = document.getElementById("point_radius_label");
let cluster_count_label = document.getElementById("cluster_count_label");
let clusterize_button = document.getElementById("clusterize_button");
let import_file = document.getElementById("import_button");

let cluster_count = cluster_count_range.value;
let radius = radius_range.value;
let scale = 1;
let points = new Array();
let mode = "Set";

let translating = false;
let last_x = 0;
let last_y = 0;

let field = new Field("field");
field.canvas.style.cursor = "none";

function k_means() {
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

    for (let i = 0; i < 10000; i++) {
        for (let point of points) {
            let minDistance = 100000;
            for (let cluster of clusters) {
                let currentDistance = field.getPointsDistance(point.position, cluster.position) - point.weight;

                if (currentDistance < minDistance) {
                    minDistance = currentDistance;
                    point.clusters["k-means"] = cluster;
                }
            }
        }

        for (let cluster of clusters) {
            let count = 0;
            let sumX = 0;
            let sumY = 0;
            for (let point of points) {
                if (point.clusters["k-means"].name == cluster.name) {
                    count++;
                    sumX += point.position.x;
                    sumY += point.position.y;
                }
            }

            cluster.position.x = parseInt(sumX / count);
            cluster.position.y = parseInt(sumY / count);
        }
    }

}

function changeClusterColor(cluster_name, algorithm, new_color) {
    for (let i = 0; i < points.length; i++) {
        if (points[i].clusters[algorithm].name == cluster_name) {
            points[i].clusters[algorithm].color = new_color
        }
    }

    sync_points_and_objects();
}

function sync_points_and_objects() {
    for (let i = 0; i < points.length; i++) {
        let point_colors = [];
        for (let cluster in points[i].clusters) {
            point_colors.push(points[i].clusters[cluster].color);
        }
        field.objects[i].colors = point_colors;
        // field.objects[i].position = points[i].position;
        field.objects[i].size = points[i].weight;
    }

    field.display()
}

function import_txt(file) {
    reset();
    const reader = new FileReader();
    reader.onload = function () {
        let lines = reader.result.split("\n");
        for (let i = 0; i < lines.length - 1; i++) {
            let x = parseFloat(lines[i].split(" ")[0]);
            let y = parseFloat(lines[i].split(" ")[1]);
            let weight = parseFloat(lines[i].split(" ")[2]);
            console.log(x, y, weight);
            if (x != NaN && y != NaN && weight != NaN) {
                let position = new Position(x, y);

                let point = new Point(position, weight, ["None"]);
                points.push(point);

                field.createObject(position, "Circle", ["black"], weight);
            }
            
            field.display();
        }
    };
    reader.readAsText(file);
}

function export_txt() {
    let content = "";
    for (let point of points) {
        console.log(point);
        content += `${point.position.x} ${point.position.y} ${point.weight}\n`;
    }

    let a = document.createElement("a");
    var data = new Blob([content], {type: 'text/plain'});
    var url = URL.createObjectURL(data);
    a.href = url;
    a.download = "points.txt";
    a.click();
}

function reset() {
    document.getElementById("set_point").checked = true;
    document.getElementById("point_radius").value = 10;
    document.getElementById("cluster_count").value = 2;
    field.clear();
    points = [];
    radius = radius_range.value;
    point_radius_label.innerText = "Point radius: " + radius.toString();
    cluster_count = cluster_count_range.value;
    cluster_count_label.innerText = "Clusters count: " + cluster_count.toString();
    field.canvas.style.cursor = "none";
    mode = "Set";
    
    scale = 1;
    field.scale = scale;
    document.getElementById("set_scale_label").innerText = `Scale: ${scale}`;

    field.transform_x = 0;
    field.transform_y = 0;

    reset_sidebar();

}

function reset_sidebar() {
    let last_div = document.getElementById("point_config");
    last_div.remove();

    let div_point_config = document.createElement("div")
    document.body.appendChild(div_point_config);
    div_point_config.id = "point_config";
    // <p id="info_p">Select "Explore field" mode to view point configurations.</p>

    let point_configuration_header = document.createElement("h1");
    point_configuration_header.innerText = "Point configuration";
    div_point_config.appendChild(point_configuration_header);

    let info_p = document.createElement("p");
    info_p.innerText = 'Select "Explore field" mode to view point configurations.';
    info_p.id = "info_p";
    div_point_config.appendChild(info_p);
}

clusterize_button.addEventListener("click", function() {
    if (points.length < cluster_count) {
        alert("There cannot be more clusters than points");
        return;
    }

    k_means();
    sync_points_and_objects();
});

field.canvas.addEventListener("mousemove", function(event) {
    let position = field.getUserClickPosition(event);
    
    if (translating && mode == "Explore") {
        field.transform_x += (position.x - last_x);
        field.transform_y += (position.y - last_y);
    
        field.display();
    }

    last_x = position.x;
    last_y = position.y;
    if (mode =="Set") {
        field.display();
    

        field.context.beginPath();
        field.context.strokeStyle = "gray";
        field.context.fillStyle = "gray";
        field.context.arc(position.x, position.y, radius * scale, 0, 2 * Math.PI);
        field.context.stroke();
    }
});

field.canvas.addEventListener("mouseup", function() {
    translating = false;
});

field.canvas.addEventListener("mousedown", function(event) {
    translating = true;
    let point;
    switch (mode) {
        case "Set":
            let position = field.getUserClickPosition(event);

            point = new Point(position, radius, ["None"]);
            points.push(point);

            field.createObject(position, "Circle", ["black"], radius);
            break;

        case "Remove":
            let index = field.removeObject(field.getUserClickPosition(event));
            points = points.slice(0, index).concat(points.slice(index + 1));
            break;
        
        case "Explore":
            point = points[field.getPointIndexByPositionOrNull(field.getUserClickPosition(event))];
            
            if (!point) {
                return;
            }

            let last_div = document.getElementById("point_config");
            last_div.remove();

            let div_point_config = document.createElement("div")
            document.body.appendChild(div_point_config);
            div_point_config.id = "point_config";

            let point_header = document.createElement("h2");
            let position_p = document.createElement("p");
            let x_p = document.createElement("p");
            let y_p = document.createElement("p");
            let weight_p = document.createElement("label");
            let weight = document.createElement("input");
            let clusters_header = document.createElement("h3");


            weight.type = "number";
            weight.min = "1";
            weight.max = "50";
            weight.value = point.weight;
            weight.addEventListener("change", function() {
                point.weight = weight.value;
                sync_points_and_objects();
            })

            div_point_config.appendChild(point_header);
            div_point_config.appendChild(position_p);
            div_point_config.appendChild(x_p);
            div_point_config.appendChild(y_p);
            div_point_config.appendChild(weight_p);
            div_point_config.appendChild(weight);
            div_point_config.appendChild(clusters_header);

            point_header.appendChild(document.createTextNode("Point configuration"));
            position_p.appendChild(document.createTextNode(`Position:`));
            x_p.appendChild(document.createTextNode(`x: ${point.position.x}`));
            y_p.appendChild(document.createTextNode(`y: ${point.position.y}`));
            weight_p.appendChild(document.createTextNode(`Weight: `));
            clusters_header.appendChild(document.createTextNode(`Clusters`));

            for (let name in point.clusters) {
                let cluster_name = document.createElement("p");
                let center = document.createElement("p");
                let x_center = document.createElement("p");
                let y_center = document.createElement("p");
                let color_text = document.createElement("p");
                let cluster_color = document.createElement("input");

                div_point_config.appendChild(cluster_name);
                div_point_config.appendChild(center);
                div_point_config.appendChild(x_center);
                div_point_config.appendChild(y_center);
                div_point_config.appendChild(color_text);
                div_point_config.appendChild(cluster_color);

                cluster_name.appendChild(document.createTextNode(`Algorithm: ${name}`));
                center.appendChild(document.createTextNode("Center:"));
                x_center.appendChild(document.createTextNode(`x: ${point.clusters[name].position.x}`));
                y_center.appendChild(document.createTextNode(`y: ${point.clusters[name].position.y}`));
                color_text.appendChild(document.createTextNode(`Cluster color: ${point.clusters[name].color}`));

                cluster_color.type = "color";
                cluster_color.value = point.clusters[name].color;
                cluster_color.addEventListener("change", function() {
                    changeClusterColor(point.clusters[name].name, name, cluster_color.value);
                    color_text.innerText = "Cluster color: " + cluster_color.value;
                });
                

            }
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

set_scale_range.addEventListener("input", function() {
    scale = set_scale_range.value;
    field.scale = scale;
    document.getElementById("set_scale_label").innerText = `Scale: ${scale}`;
    field.display();
});

set_point_radio.addEventListener("input", function() {
    field.canvas.style.cursor = "none";
    mode = "Set";
    reset_sidebar();
});

remove_point_radio.addEventListener("input", function() {
    field.canvas.style.cursor = "default";
    mode = "Remove";
    field.display();
    reset_sidebar();
});

explore_radio.addEventListener("input", function() {
    field.canvas.style.cursor = "default";
    mode = "Explore";
    field.display();
    document.getElementById("info_p").innerText = 'Click on a point to view its configuration.';
});

clear_field_button.addEventListener("click", function() {
    reset();
});

export_button.addEventListener("click", function() {
    export_txt();
});

import_button.addEventListener("change", function(event) {
    import_txt(event.target.files[0]);
});