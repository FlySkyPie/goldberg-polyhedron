Goldberg Polyhedron
===

This program is extracted from: https://github.com/VikingScientist/polygon-distance,

is used to created Goldberg Polyhedron.

Install
---

```shell
npm install @flyskypie/goldberg-polyhedron
```

Usage
---

```javascript
import {GoldbergPolyhedron} from '@flyskypie/goldberg-polyhedron';

let goldbergPolyhedron = new GoldbergPolyhedron();

let jsonString = goldbergPolyhedron.createJsonString(2);

let polygons = goldbergPolyhedron.getPolygons(2);
for(let polygon of polygons){
    for(let point of polygon){
        let position = [point.x, point.y, point.z];
    }
}
```