var Variables = require('./variables');

function Shot(position, angle, speed, map) {
    this.id = undefined;
    this.position = position;
    this.angle = angle;
    this.speed = speed;
    this.normalVelocity = [
        Math.sin(this.angle * Math.PI/128),
        -Math.cos(this.angle * Math.PI/128)
    ];
    this.velocity = [
        this.speed * this.normalVelocity[0],
        this.speed * this.normalVelocity[1]
    ];
    this.time = Variables.SHOT_TIME;
    this.map = map;
}

Shot.prototype.update = function(clients) {
    for (var i = 0; i < this.speed; i++) {
        this.position[0] += this.normalVelocity[0];
        this.position[1] += this.normalVelocity[1];
        if (this.position[0] > this.map.properties.size[0]) {
            this.position[0] = 2*this.map.properties.size[0] - this.position[0];
            this.normalVelocity[0] = -this.normalVelocity[0];
        }
        if (this.position[0] < -this.map.properties.size[0]) {
            this.position[0] = -2*this.map.properties.size[0] - this.position[0];
            this.normalVelocity[0] = -this.normalVelocity[0];
        }
        if (this.position[1] > this.map.properties.size[1]) {
            this.position[1] = 2*this.map.properties.size[1] - this.position[1];
            this.normalVelocity[1] = -this.normalVelocity[1];
        }
        if (this.position[1] < -this.map.properties.size[1]) {
            this.position[1] = -2*this.map.properties.size[1] - this.position[1];
            this.normalVelocity[1] = -this.normalVelocity[1];
        }

        for (var c in clients) {
            if (clients[c].player.contains(this.position)) {
                clients[c].player.spawn();
                this.time = -1;
                return;
            }
        }

        for (var r in this.map.rectangles) {
            if (this.map.rectangles[r].contains(this.position)) {
                this.time = -1;
                break;
            }
        }
    }

    this.time--;
}

Shot.prototype.kill = function(id, clients) {
    var msg = new Buffer(3);
    msg[0] = 0x04;
    msg[1] = id;
    msg[2] = this.id;
    for (var c in clients) {
        clients[c].send(msg);
    }
}

exports.Shot = Shot;
