import {assert, describe, it} from 'vitest';
import {Parser} from "../src/parser";
import {Builder} from "../src/builder";

const parser = new Parser();
const builder = new Builder();

describe('end to end tests', () => {
	it('convert simple example', async () => {
		const expected =
			'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
			'<xml>\n' +
			'\t<foo>1</foo>\n' +
			'\t<bar>2</bar>\n' +
			'</xml>';
		let json = await parser.parse(expected);
		const actual = builder.build(json);

		assert.strictEqual(actual, expected);
	});

	it('convert simple example with attributes', async () => {
		const expected =
			'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
			'<xml>\n' +
			'\t<foo bool="true">1</foo>\n' +
			'\t<bar num="2">2</bar>\n' +
			'</xml>';
		let json = await parser.parse(expected);
		const actual = builder.build(json);

		assert.strictEqual(actual, expected);
	});

	it('convert simple example with escaped characters', async () => {
		const expected =
			'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
			'<xml>\n' +
			'\t<data>a &lt; b</data>\n' +
			'</xml>'
		let json = await parser.parse(expected);
		const actual = builder.build(json);

		assert.strictEqual(actual, expected);
	});

	/*
	it('convert simple example with cdata', async () => {
		const expected =
			'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
			'<xml>\n' +
			'\t<data><![CDATA[a < b]]></data>\n' +
			'</xml>'
		let json = await parser.parse(expected);

		console.info(json)
		const actual = builder.build(json);

		assert.strictEqual(actual, expected);
	});
	 */

	it('convert simple example while keeping the order', async () => {
		const expected =
			'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
			'<xml>\n' +
			'\t<foo>1</foo>\n' +
			'\t<bar>2</bar>\n' +
			'\t<foo bool="true">3</foo>\n' +
			'</xml>';
		let json = await parser.parse(expected);
		const actual = builder.build(json);

		assert.strictEqual(actual, expected);
	});

	it('convert nested example while keeping the order', async () => {
		const expected =
			'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
			'<xml>\n' +
			'\t<foo>1</foo>\n' +
			'\t<foo bool="true">2</foo>\n' +
			'\t<bar>3</bar>\n' +
			'\t<baz number="2">\n' +
			'\t\t<child1>1</child1>\n' +
			'\t\t<child2>2</child2>\n' +
			'\t\t<child1>3</child1>\n' +
			'\t</baz>\n' +
			'</xml>';
		let json = await parser.parse(expected);
		console.info(JSON.stringify(json, null, 2));

		const actual = builder.build(json);

		assert.strictEqual(actual, expected);
	});
});
