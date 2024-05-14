import {assert, describe, it} from 'vitest';
import {Parser} from "../src/parser";
import {Builder} from "../src/builder";

const parser = new Parser();
const builder = new Builder();

describe('simple tests', () => {
	it('convert simple xml', async () => {
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

	it('convert simple xml with attributes', async () => {
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

	it('convert simple xml with escaped characters', async () => {
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
	it('convert simple xml with cdata', async () => {
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
});
