"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Y = __importStar(require("yjs"));
/*
const ydoc1 = new Y.Doc({gc: false})
const design1 = ydoc1.getMap("xml");
design1.set('text', 'Type Something');
const diff1 = Y.encodeStateAsUpdate(ydoc1, Y.encodeStateVector(ydoc1))

const ydoc2 = new Y.Doc({gc: false})
const design2 = ydoc2.getMap("xml");
Y.applyUpdate(ydoc2, diff1)
design2.set('text', 'Type Somethingelse');

console.info(ymapToJSON(design2));
*/
/*
const user1 = new Y.Doc({gc: false})
let up: Uint8Array | undefined = undefined;
user1.on('update', (update: Uint8Array) => {
    up = update;
    console.info(up);
});
const model1 = user1.getMap("modal");
const undo1 = new Y.UndoManager(model1, {captureTimeout: 0})
user1.transact(() => {
    jsonToYMap({cont: {text: 'Type Something'}}, model1);
});
console.info(ymapToJSON(model1));


const user2 = new Y.Doc({gc: false})
Y.applyUpdate(user2, up!)
const model2 = user2.getMap("modal");
const undo2 = new Y.UndoManager(model2, {captureTimeout: 0})
user2.transact(() => {
    jsonToYMap({cont: {text: 'Type Something'}}, model2);
});
console.info(ymapToJSON(model2));

user1.transact(() => {
    (model1.get('cont') as Y.Map<any>).set('text', 'Type Somethingelse');
});
console.info(ymapToJSON(model1));

const diff1 = Y.encodeStateAsUpdate(user1)
user2.transact(() => {
    Y.applyUpdate(user2, diff1)
});
console.info(ymapToJSON(model2));
*/
const doc1 = new Y.Doc();
const model1 = doc1.getArray('myarray');
const undo1 = new Y.UndoManager(model1, { captureTimeout: 0, trackedOrigins: new Set([40]) });
doc1.transact(() => {
    model1.insert(0, ['Hello doc2, you got this?']);
}, 40);
console.info(1, model1.get(0));
undo1.undo();
try {
    console.info(2, model1.get(0));
}
catch (e) {
    console.info(2, "expected ex");
}
undo1.redo();
console.info(3, model1.get(0));
const doc2 = new Y.Doc();
const model2 = doc2.getArray('myarray');
const undo2 = new Y.UndoManager(model2, { captureTimeout: 0, trackedOrigins: new Set([42]) });
doc2.transact(() => {
    model2.insert(0, ['doc2 own']);
}, 42);
console.info(4, model2.get(0));
Y.applyUpdateV2(doc2, Y.encodeStateAsUpdateV2(doc1), 40);
console.info(5, model2.get(0));
console.info(5, model2.get(1));
undo2.undo();
console.info(6, model2.get(0));
function compareYStructures(struct1, struct2) {
    let differences = {};
    if (struct1 instanceof Y.Map && struct2 instanceof Y.Map) {
        const keys1 = Array.from(struct1.keys());
        const keys2 = Array.from(struct2.keys());
        const allKeys = new Set([...keys1, ...keys2]);
        allKeys.forEach(key => {
            const value1 = struct1.get(key);
            const value2 = struct2.get(key);
            const subDiffs = compareYStructures(value1, value2);
            if (Object.keys(subDiffs).length > 0) {
                differences[key] = subDiffs;
            }
        });
    }
    else if (struct1 instanceof Y.Array && struct2 instanceof Y.Array) {
        const length = Math.max(struct1.length, struct2.length);
        for (let i = 0; i < length; i++) {
            const value1 = i < struct1.length ? struct1.get(i) : undefined;
            const value2 = i < struct2.length ? struct2.get(i) : undefined;
            const subDiffs = compareYStructures(value1, value2);
            if (Object.keys(subDiffs).length > 0) {
                differences[i] = subDiffs;
            }
        }
    }
    else if (struct1 instanceof Y.Text && struct2 instanceof Y.Text) {
        const text1 = struct1.toString();
        const text2 = struct2.toString();
        if (text1 !== text2) {
            differences = { from: text1, to: text2 };
        }
    }
    else if (struct1 !== struct2) {
        differences = { from: struct1, to: struct2 };
    }
    return differences;
}
function ymapToJSON(ymap) {
    const json = {};
    ymap.forEach((value, key) => {
        if (value instanceof Y.Map) {
            json[key] = ymapToJSON(value);
        }
        else if (value instanceof Y.Array) {
            json[key] = [];
            value.forEach((item) => {
                if (item instanceof Y.Map) {
                    json[key].push(ymapToJSON(item));
                }
                else {
                    json[key].push(item);
                }
            });
        }
        else {
            json[key] = value;
        }
    });
    return json;
}
/*
const stateVector1 = Y.encodeStateVector(ydoc1)
const stateVector2 = Y.encodeStateVector(ydoc2)
console.info(stateVector1, stateVector2);
const diff1 = Y.encodeStateAsUpdateV2(ydoc1, stateVector2)
console.info(diff1);

// @ts-ignore
const updateDecoder = new Y.UpdateDecoderV2(decoding.createDecoder(diff1));
console.info(updateDecoder);
// @ts-ignore
const lazyDecoder = new Y.LazyStructReader(updateDecoder, false)
for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
    console.info(curr)
}
*/
