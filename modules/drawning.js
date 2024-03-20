const Types = {
    Circle: 'Circle',
    Square: 'Square'
};

export class Position {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }
}

export class Object {
    constructor (position, type, colors, size) {
        this.position = position;
        this.type = type;
        this.colors = colors;
        this.size = size;
    }
}

export class Field {
    constructor (canvasID) {
        this.canvas = document.getElementById(canvasID);
        this.context = this.canvas.getContext('2d');

        this.objects = new Array();
    }

    getUserClickPosition (event) {
        const rectangle = this.canvas.getBoundingClientRect();
        let x = event.clientX - rectangle.left;
        let y = event.clientY - rectangle.top;

        let position = new Position(x, y);
        return position;
    }

    getPointsDistance (positionA, positionB) {
        return Math.sqrt(Math.pow(positionA.x - positionB.x, 2) + Math.pow(positionA.y - positionB.y, 2));
    }

    createObject (cursorPosition, type, colors, size) {
        let position = cursorPosition;
        let object = new Object(position, type, colors, size);
        this.objects.push(object);
    }

    appendObject(position, type, colors, size) {
        this.objects.push(new Object(position, type, colors, size));
    }

    removeObject (cursorPosition) {
        for (let i = 0; i < this.objects.length; i++) {
            let objectPosition = this.objects[i].position;
            if (this.objects[i].type == Types.Circle) {
                if (this.getPointsDistance(cursorPosition, objectPosition) <= this.objects[i].size) {
                    this.objects = this.objects.slice(0, i).concat(this.objects.slice(i + 1));
                    return i;
                } 
            }
        }
    }

    display () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let object of this.objects) {
            if (object.type == Types.Circle) {
                let n = object.colors.length;
                for (let i = 0; i < n; i++) {
                    this.context.fillStyle = object.colors[i];

                    this.context.beginPath();
                    this.context.moveTo(object.position.x, object.position.y);
                    this.context.arc(object.position.x, object.position.y, object.size, 2 * Math.PI / n * i, 2 * Math.PI / n * i + 2 * Math.PI / n);
                    this.context.closePath();
                    this.context.fill();
                }
            }
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.objects = [];
    }
}