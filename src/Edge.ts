import Vertex from './Vertex';

class Edge {
    vertex: [Vertex, Vertex];
    face: Array<any>;
    nextFaceVertex: Array<any>;
    intVertices: Array<any>;
    constructor(start: Vertex, stop: Vertex) {
        // class variables
        this.vertex = [start, stop];
        this.face = [];
        this.nextFaceVertex = [];
        this.intVertices = [];
    }

    equals(l: Edge) {
        return (this.vertex[0].equals(l.vertex[0]) && this.vertex[1].equals(l.vertex[1])) ||
            (this.vertex[0].equals(l.vertex[1]) && this.vertex[1].equals(l.vertex[0]));
    }

    toString() {
        return "(" + this.vertex[0].toString() + ") -> (" + this.vertex[1].toString() + ")";
    }
}

export default Edge;