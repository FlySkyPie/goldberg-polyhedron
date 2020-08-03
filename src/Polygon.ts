import * as glMatrix from 'gl-matrix';
import vec3 = glMatrix.vec3;

import {Vertex} from './Vertex';
import {Vec3Factory} from './Vec3Factory';

export class Polygon {
    nor: any;
    selected: number | boolean;
    neighbours: Array<any>;
    centroid: vec3;
    vertexPoints: Array<number>;  // (3 point) * (5 or 6 vertices)
    constructor(vertexPoints: Array<number>) {
        this.vertexPoints = vertexPoints;
        this.nor = vec3.create();
        this.selected = 0;
        this.neighbours = [];

        this.centroid = vec3.create();
        var k = 0;
        for (var i = 0; i < vertexPoints.length / 3; i++) {
            this.centroid[0] += vertexPoints[k++];
            this.centroid[1] += vertexPoints[k++];
            this.centroid[2] += vertexPoints[k++];
        }
        this.centroid[0] /= vertexPoints.length / 3;
        this.centroid[1] /= vertexPoints.length / 3;
        this.centroid[2] /= vertexPoints.length / 3;

        vec3.normalize(this.centroid, this.nor);

        var c = new Vertex(this.centroid[0], this.centroid[1], this.centroid[2]);
        var n = new Vertex(this.nor[0], this.nor[1], this.nor[2]);
        var d = c.dot(n);
        if (d < 0) {
            // alert("normal pointing the wrong way!");
            // document.write("<br>normal pointing the wrong way!<br>");
        }
    }

    contains(p: any) {
        var sides = this.vertexPoints.length / 3;
        for (var i = 0; i < sides; i++) {
            var p1 = Vec3Factory.create([this.vertexPoints[i * 3], this.vertexPoints[i * 3 + 1], this.vertexPoints[i * 3 + 2]]);
            var p2 = Vec3Factory.create([this.vertexPoints[(i + 1) % sides * 3], this.vertexPoints[(i + 1) % sides * 3 + 1], this.vertexPoints[(i + 1) % sides * 3 + 2]]);
            var cross = vec3.create();
            vec3.subtract(p2, p2, p1);
            vec3.subtract(p1, p1, p);
            vec3.scale(p1, p1, -1.0);
            vec3.cross(cross, p2, p1);
            if (vec3.dot(cross, this.nor) < 0)
                return false;
        }
        return true;
    }

    setSelected(n: any) {
        this.selected = n;
        for (var i in this.neighbours)
            if (this.neighbours[i].selected < n - 1)
                this.neighbours[i].setSelected(n - 1);
    }

    private toJsonString() {
        let points: Array<object> = [];

        var k = 0;
        for (var i = 0; i < this.vertexPoints.length / 3; i++) {
            let x, y, z;
            x = this.vertexPoints[k++];
            y = this.vertexPoints[k++];
            z = this.vertexPoints[k++];
            points.push({
                x: x, y: y, z: z
            });
        }

        return JSON.stringify(points);
    }

    public toString() {
        return this.toJsonString();
    }

    public getPoints() {
        let points: Array<object> = [];

        var k = 0;
        for (var i = 0; i < this.vertexPoints.length / 3; i++) {
            let x, y, z;
            x = this.vertexPoints[k++];
            y = this.vertexPoints[k++];
            z = this.vertexPoints[k++];
            points.push({
                x: x, y: y, z: z
            });
        }

        return points;
    }
}