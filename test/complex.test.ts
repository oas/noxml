import {assert, describe, it} from 'vitest';
import {Builder, Parser} from "../src";
import {readResource} from "./runtime";

const parser = new Parser();
const builder = new Builder();

describe('end to end tests', () => {
	it('parsing simple example, checking the correct order', async () => {
		const before =
			'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
			'<xml>\n' +
			'\t<foo>1</foo>\n' +
			'\t<bar>2</bar>\n' +
			'\t<foo bool="true">3</foo>\n' +
			'</xml>';
		let json = await parser.parse(before);
		assert.strictEqual(Array.isArray(json.xml.foo), true);
		assert.strictEqual(json.xml.foo.length, 2);
		assert.strictEqual(json.xml.foo[0]["#"], '1');
		assert.strictEqual(json.xml.foo[1]["#"], '3');
		assert.strictEqual(json.xml.foo[0]["@"] < json.xml.foo[1]["@"], true); // The first foo should be before the second foo.

		assert.strictEqual(Array.isArray(json.xml.bar), false);
		assert.strictEqual(json.xml.bar["#"], '2');

		json.xml.foo.push({"#": "4"});

		const actual = builder.build(json);
		const expected =
			'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
			'<xml>\n' +
			'\t<foo>1</foo>\n' +
			'\t<bar>2</bar>\n' +
			'\t<foo bool="true">3</foo>\n' +
			'\t<foo>4</foo>\n' +
			'</xml>';

		assert.strictEqual(actual, expected);
	});

	it('parsing a dmn model', async () => {
		const content = readResource("0003-input-data-string-allowed-values.dmn");

		const model = await parser.parse(content);
		const output = builder.build(model);
		assert.strictEqual(output, content);
	});
});
