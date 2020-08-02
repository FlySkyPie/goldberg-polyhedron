
class Vertex {
    x: [number, number, number];
    face: Array<any>;
    vertex: Array<any>;
    index: Array<any>;

    constructor(x: number, y: number, z: number) {
        // class variables
        this.x = [x, y, z];
        this.face = [];
        this.vertex = [];
        this.index = [];
    }

    add(p: Vertex) {
        return new Vertex(this.x[0] + p.x[0], this.x[1] + p.x[1], this.x[2] + p.x[2]);
    }

    sub(p: Vertex) {
        return new Vertex(this.x[0] - p.x[0], this.x[1] - p.x[1], this.x[2] - p.x[2]);
    }

    mult(a: any) {
        return new Vertex(this.x[0] * a, this.x[1] * a, this.x[2] * a);
    }

    scale(a: any) {
        this.x[0] *= a;
        this.x[1] *= a;
        this.x[2] *= a;
    }

    normalize() {
        var d = this.len();
        this.x[0] /= d;
        this.x[1] /= d;
        this.x[2] /= d;
    }

    dot(p: any) {
        var result = 0.0;
        for (var i = 0; i < 3; i++)
            result += this.x[i] * p.x[i];
        return result;
    }

    len() {
        return Math.sqrt(this.dot(this));
    }

    dist(p: any) {
        var subP = this.sub(p);
        return subP.len();
    }

    cross(p: any) {
        return new Vertex(this.x[1] * p.x[2] - this.x[2] * p.x[1],
            this.x[2] * p.x[0] - this.x[0] * p.x[2],
            this.x[0] * p.x[1] - this.x[1] * p.x[0]);
    }

    addFace(f: any) {
        for (var i in this.face)
            if (this.face[i] == f)
                return;
        this.face.push(f);
    }

    addVertex(v: any) {
        for (var i in this.vertex)
            if (this.vertex[i] == v)
                return;
        this.vertex.push(v);
    }

    equals(p: any) {
        for (var i in this.x)
            if (Math.abs(this.x[i] - p.x[i]) > 1e-10)
                return false;
        return true;
    }

    copy() {
        return new Vertex(this.x[0], this.x[1], this.x[2]);
    }

    toString() {
        return "(" + this.x[0] + ", " + this.x[1] + ", " + this.x[2] + ")";
    }
}

export default Vertex;