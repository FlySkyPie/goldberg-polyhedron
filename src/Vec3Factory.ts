import * as glMatrix from 'gl-matrix';
import vec3 = glMatrix.vec3;

export class Vec3Factory {

    public static create(values: [number, number, number]): vec3 {
        let newVec3 = vec3.create();
        vec3.set(newVec3, values[0], values[1], values[2]);
        return newVec3;
    }
}