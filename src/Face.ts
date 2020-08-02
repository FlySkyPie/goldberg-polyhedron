import {Vertex} from './Vertex';

export class Face {
    vertices: Array<Vertex>;
    edge: Array<any>;
    intVertices: Array<any>;
    constructor(vertices: Array<Vertex>) {
        // class variables
        this.vertices = vertices;
        this.edge = [];
        this.intVertices = [];
    }

    reorganizePoints() {
        for (var j = 0; j < this.vertices.length - 2; j++) {
            var minLen = 1e100;
            var minI = -1;
            for (var i = j + 1; i < this.vertices.length; i++) {
                var d = this.vertices[i].dist(this.vertices[j]);
                if (d < minLen) {
                    minLen = d;
                    minI = i;
                }
            }
            var tmp = this.vertices[j + 1];
            this.vertices[j + 1] = this.vertices[minI];
            this.vertices[minI] = tmp;
        }
        var u = this.vertices[1].sub(this.vertices[0]);
        var v = this.vertices[2].sub(this.vertices[1]);
        var n = u.cross(v);
        var c = this.getCentroid();
        if (c.dot(n) < 0) { // clockwise ordering... need to swap
            let tmp = [];
            for (var i = this.vertices.length; i-- > 0;)
                tmp.push(this.vertices[i]);
            this.vertices = tmp;
        }
    }

    equals(f: Face) {
        for (var i in this.vertices)
            if (!this.vertices[i].equals(f.vertices[i]))
                return false;
        return true;
    }

    getCentroid() {
        var p = [0, 0, 0];
        for (var i in this.vertices) {
            p[0] += this.vertices[i].x[0];
            p[1] += this.vertices[i].x[1];
            p[2] += this.vertices[i].x[2];
        }
        p[0] /= this.vertices.length;
        p[1] /= this.vertices.length;
        p[2] /= this.vertices.length;
        return new Vertex(p[0], p[1], p[2]);
    }

    getVertexList() {
        var result = []
        for (var i in this.vertices)
            for (var j in this.vertices[i].x)
                result.push(this.vertices[i].x[j]);
        return result;
    }

    toString() {
        var result = "";
        for (var i in this.vertices)
            // result = result + "(";
            result = result + "(" + this.vertices[i] + ") - ";
        return result;
    }
}