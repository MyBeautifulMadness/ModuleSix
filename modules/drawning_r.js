const Types = {
    Circle: 'Circle',
    Rectangle: 'Rectangle'
};

export class Position {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }
}

export class Object {
    constructor (position) {
        this.position = position;
    }

    draw(context) {};

    check_point_in_object(position) {};
}

export class Rectangle extends Object {
    constructor (position, color, width, height) {
        super(position);
        this.color = color;
        this.width = width;
        this.height = height;
    }

    draw(context) {
        context.fillStyle = this.color;
        context.beginPath();
        context.rect(this.position.x, this.position.y, this.width, this.height);
        context.fill();
        context.closePath();
    }

    check_point_in_object(position) {
        return (this.position.x <= position.x) && ((this.position.x + this.width) >= position.x) && (this.position.y <= position.y) && ((this.position.y + this.height) >= position.y)
    }
}

export class Circle extends Object {
    constructor (position, color, radius) {
        super(position);
        this.color = color;
        this.radius = radius;
    }

    draw(context) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
    }

    check_point_in_object(position) {
        return (this.position.x - position.x) ** 2 + (this.position.y - position.y) ** 2 <= this.radius ** 2;
    }
}

export class Field {
    constructor (canvasID) {
        this.canvas = document.getElementById(canvasID);
        this.context = this.canvas.getContext('2d');
        this.objects = [];
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    findByPosition(position) {
        for (let object of this.objects) {
            if (object.check_point_in_object(position)) {
                return object;
            }
        }
    }

    findIndexByPosition(position) {
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].check_point_in_object(position)) {
                return i;
            }
        }
    }

    removeObject (index) {
        this.objects = this.objects.slice(0, index).concat(this.objects.slice(index + 1));
    }

    appendObject(object) {
        this.objects.push(object);
    }

    display() {
        this.clear();
        this.objects.forEach(object => { object.draw(this.context) });
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    reset() {
        this.clear();
        this.objects = [];
    }
}