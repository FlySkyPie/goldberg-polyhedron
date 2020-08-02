import * as glMatrix from 'gl-matrix';
import vec3 = glMatrix.vec3;

import {Vertex} from './Vertex';
import {Face} from './Face';
import {Edge} from './Edge';
import {Polygon} from './Polygon';

export class GoldbergPolyhedron {
    private polygons: Array<Polygon>;
    private vertices: Array<any>;
    private faces: Array<any>;
    private geosidicFace: Array<any>;
    private edges: Array<any>;
    constructor() {
        this.polygons = [];
        this.vertices = [];
        this.faces = [];
        this.geosidicFace = [];
        this.edges = [];
    }

    private initDodecahedron() {
        let phi = (1 + Math.sqrt(5.0)) / 2.0;
        let pts = [1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,
            -1.0, 1.0, 1.0, // pts[4]
            -1.0, -1.0, 1.0,
            -1.0, 1.0, -1.0,
            -1.0, -1.0, -1.0,
            0, 1.0 / phi, phi, // pts[8]
            0, -1.0 / phi, phi,
            0, 1.0 / phi, -phi,
            0, -1.0 / phi, -phi,
            1.0 / phi, phi, 0, // pts[12]
            -1.0 / phi, phi, 0,
            1.0 / phi, -phi, 0,
            -1.0 / phi, -phi, 0,
            phi, 0, 1.0 / phi, //pts[16]
            phi, 0, -1.0 / phi,
            -phi, 0, 1.0 / phi,
            -phi, 0, -1.0 / phi];
        let indx = [15, 14, 3, 11, 7,
            14, 3, 17, 16, 1,
            17, 16, 0, 12, 2,
            3, 17, 2, 10, 11,
            7, 11, 10, 6, 19,
            10, 2, 12, 13, 6,
            1, 9, 8, 0, 16,
            9, 5, 18, 4, 8,
            8, 4, 13, 12, 0,
            5, 15, 7, 19, 18,
            4, 18, 19, 6, 13,
            15, 5, 9, 1, 14];
        for (let i = 0; i < indx.length / 5; i++) {
            let locPt = [];
            for (let j = 0; j < 5; j++) {
                let k = indx[i * 5 + j];
                locPt.push(pts[3 * k]);
                locPt.push(pts[3 * k + 1]);
                locPt.push(pts[3 * k + 2]);
            }
            this.polygons.push(new Polygon(locPt));
        }
    }

    private initIcosahedron() {
        this.vertices = [];
        this.faces = [];
        this.edges = [];
        let phi = (1 + Math.sqrt(5.0)) / 2.0;
        let pts: Array<number> = [0, 1, phi,
            0, -1, phi,
            0, 1, -phi,
            0, -1, -phi,
            1, phi, 0,
            -1, phi, 0,
            1, -phi, 0,
            -1, -phi, 0,
            phi, 0, 1,
            -phi, 0, 1,
            phi, 0, -1,
            -phi, 0, -1];
        let indx = [0, 8, 1, 0, 1, 9, 0, 4, 8, 0, 5, 4,
            0, 9, 5, 2, 11, 3, 2, 5, 11, 2, 4, 5,
            2, 10, 4, 2, 3, 10, 1, 7, 9, 1, 6, 7,
            1, 8, 6, 3, 6, 10, 3, 7, 6, 3, 11, 7,
            4, 10, 8, 5, 9, 11, 6, 8, 10, 7, 11, 9];

        for (let i = 0; i < pts.length / 3; i++) {
            this.vertices.push(new Vertex(pts[3 * i], pts[3 * i + 1], pts[3 * i + 2]));
        }


        for (let i = 0; i < indx.length / 3; i++) {
            let locPt = [];
            let locVert = [];
            for (let j = 0; j < 3; j++) {
                let k = indx[i * 3 + j];
                locPt.push(pts[3 * k]);
                locPt.push(pts[3 * k + 1]);
                locPt.push(pts[3 * k + 2]);
                locVert.push(this.vertices[k]);
            }
            // this.polygons.push(new Polygon(locPt));
            let f = new Face(locVert);
            this.faces.push(f);
            let newE;
            for (let j = 0; j < 3; j++) {
                newE = new Edge(locVert[j], locVert[(j + 1) % 3]);
                newE.face.push(f);
                let found = false;
                for (let k in this.edges) {
                    if (newE.equals(this.edges[k])) {
                        newE = this.edges[k];
                        newE.face.push(f);
                        found = true;
                        break;
                    }
                }
                if (!found)
                    this.edges.push(newE);
                f.edge.push(newE);
            }
        }

        /*  debugging output
         for(let i in faces) {
         document.write("<br>Face #"+i+":");
         for(let j in faces[i].edge) {
         let edgeI = -1;
         for(let k in edges)
         if(faces[i].edge[j].equals(edges[k]))
         edgeI = k;
         document.write("<br>&nbsp &nbsp edge #"+edgeI+":&nbsp");
         let ptI = -1;
         for(let k in vertices)
         if(faces[i].edge[j].vertex[0].equals(vertices[k]))
         ptI = k;
         document.write(ptI + ", ");
         for(let k in vertices)
         if(faces[i].edge[j].vertex[1].equals(vertices[k]))
         ptI = k;
         document.write("" + ptI);
         if(faces[i].edge[j].face[1].equals(faces[i]))
         document.write(" (-1)");
         }
         }
         */
    }

    private makeGeosidic(n: number, m: number) {
        this.geosidicFace = [];
        // make sure n is always the biggest number
        if (n < m) {
            let tmp = m;
            m = n;
            n = tmp;
        }
        if (m == 0) { // paralell type subdivision
            for (let i in this.edges) {
                for (let t = 1; t < n; t++) {
                    let p1 = this.edges[i].vertex[0].mult(1.0 * (n - t) / n);
                    let p2 = this.edges[i].vertex[1].mult(1.0 * (t) / n);
                    let p = p1.add(p2);
                    this.edges[i].intVertices.push(p);
                    this.vertices.push(p);
                }
            }
            for (let i in this.faces) {
                for (let t = 1; t < n - 1; t++) {
                    for (let s = 1; s < n - t; s++) {
                        let z1 = 1.0 * t / n;
                        let z2 = 1.0 * s / n;
                        let z3 = 1.0 - z1 - z2;
                        let p1 = this.faces[i].vertices[0].mult(z1);
                        let p2 = this.faces[i].vertices[1].mult(z2);
                        let p3 = this.faces[i].vertices[2].mult(z3);
                        let pp = p1.add(p2);
                        let p = pp.add(p3); // p = z1*p1 + z2*p2 + z3*p3
                        this.faces[i].intVertices.push(p);
                        this.vertices.push(p);
                    }
                }
                let e1 = this.faces[i].edge[0];
                let e2 = this.faces[i].edge[1];
                let e3 = this.faces[i].edge[2];
                let e1Reverse = e1.face[1].equals(this.faces[i]);
                let e2Reverse = e2.face[1].equals(this.faces[i]);
                let e3Reverse = e3.face[1].equals(this.faces[i]);

                let locSize = n + 1;
                let locVertices = [this.faces[i].vertices[2]];
                for (let j = 0; j < n - 1; j++)
                    locVertices.push(e2.intVertices[(e2Reverse) ? j : (n - j - 2)]);
                locVertices.push(this.faces[i].vertices[1])
                for (let j = 0; j < n - 1; j++) {
                    let locI = ((locSize + 1) * locSize - (locSize - j) * (locSize - j - 1)) / 2;
                    locVertices[locI] = e3.intVertices[(e3Reverse) ? (n - j - 2) : j];
                }
                let locI = 2 * locSize - 2;
                for (let j = 0; j < n - 1; j++) {
                    locVertices[locI] = e1.intVertices[(e1Reverse) ? j : (n - j - 2)];
                    locI += locSize - j - 2;
                }
                locI = locSize + 1;
                let st = 0;
                for (let j = 1; j < locSize - 2; j++) {
                    for (let k = 1; k < locSize - 1 - j; k++) {
                        locVertices[locI] = this.faces[i].intVertices[st++];
                        locI++;
                    }
                    locI += 2;
                }
                locVertices.push(this.faces[i].vertices[0]);

                st = 0;
                for (let j = 0; j < locSize - 1; j++) {
                    for (let k = 0; k < locSize - 1 - j; k++) {
                        this.geosidicFace.push(new Face([locVertices[st],
                        locVertices[st + (locSize - j)],
                        locVertices[st + 1]]));
                        st++;
                    }
                    st++;
                }
                st = locSize;
                for (let j = 1; j < locSize; j++) {
                    for (let k = 0; k < locSize - 1 - j; k++) {
                        this.geosidicFace.push(new Face([locVertices[st],
                        locVertices[st + 1],
                        locVertices[st - locSize + j]]));
                        st++;
                    }
                    st++;
                }
            }

            // this.polygons = [];
            // for(let i in geosidicFace)
            // this.polygons.push(new Polygon(geosidicFace[i].getVertexList()));
        } else if (m == n) { // reflexible type
        } else { // chirall patterns
        }
    }
    private projectSphere() {
        for (let i in this.vertices) {
            this.vertices[i].normalize();
            // document.write("<br>vertex #" + i + " has lenght " + vertices[i].len());
        }
        // this.polygons = [];
        // for(let i in geosidicFace)
        // this.polygons.push(new Polygon(geosidicFace[i].getVertexList()));
    }

    private makeDualMesh() {
        let finalVert = [];
        let finalFace = [];

        // list all vertices face neighbours (dual mesh face circumference)
        for (let i in this.geosidicFace) {
            for (let j in this.geosidicFace[i].vertices)
                this.geosidicFace[i].vertices[j].addFace(i);
            finalVert.push(this.geosidicFace[i].getCentroid());
        }
        // list all vertex-vertex neighbours (dual mesh polygon-connectivity)
        for (let i in this.vertices)
            this.vertices[i].index = i;
        for (let i in this.geosidicFace) {
            for (let j = 0; j < this.geosidicFace[i].vertices.length; j++) {
                for (let k = j + 1; k < this.geosidicFace[i].vertices.length; k++) {
                    let v1 = this.geosidicFace[i].vertices[j];
                    let v2 = this.geosidicFace[i].vertices[k];
                    v1.addVertex(v2.index);
                    v2.addVertex(v1.index);
                }
            }
        }

        // make this.polygons of all vertices
        for (let i in this.vertices) {
            let locVert = [];
            for (let j in this.vertices[i].face)
                locVert.push(finalVert[this.vertices[i].face[j]]);
            if (locVert.length > 2) {
                let newF = new Face(locVert);
                newF.reorganizePoints();
                finalFace.push(newF);
            }
        }
        this.polygons = [];
        for (let i in finalFace)
            this.polygons.push(new Polygon(finalFace[i].getVertexList()));
        for (let i in this.vertices)
            for (let j in this.vertices[i].vertex)
                this.polygons[i].neighbours.push(this.polygons[this.vertices[i].vertex[j]]);
    }

    public createJsonString(n: number) {
        this.initIcosahedron();
        this.makeGeosidic(2, 0);
        this.projectSphere();
        this.makeDualMesh();
        this.polygons.toString();
    }
}