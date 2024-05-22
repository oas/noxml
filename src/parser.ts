import {parser as createParser, SAXParser} from "sax";

export class Parser {
	private _parser: SAXParser;

	constructor() {
		this._parser = createParser(true, {
			trim: true,
			normalize: false,
			lowercase: false,
			xmlns: true,
		});
	}

	parse(xml: string): Promise<any> {
		return new Promise((resolve, reject) => {
			const scope: any = [];
			let index = 0;

			this._parser.onerror = function (e) {
				reject(e);
			};
			this._parser.ontext = function (text) {
				const last = scope[scope.length - 1];
				if (last["#"] === undefined) {
					last["#"] = "";
				}
				last["#"] += text;
			};
			this._parser.onopentagstart = function (node) {
				const element = {"@": index++};

				if (scope.length > 0) {
					const last = scope[scope.length - 1];
					if (last[node.name] === undefined) {
						last[node.name] = element;
					}
					else {
						if (Array.isArray(last[node.name])) {
							last[node.name].push(element);
						}
						else {
							last[node.name] = [last[node.name], element];
						}
					}

					scope.push(element);
				}
				else {
					scope.push({[node.name]: element});
					scope.push(element);
				}
			};
			this._parser.onclosetag = function () {
				scope.pop();
			}
			this._parser.onattribute = function (attribute) {
				const last = scope[scope.length - 1];
				if (last._ === undefined) {
					last._ = {};
				}
				last._[attribute.name] = attribute.value;
			};
			this._parser.onopencdata = function () {
				const last = scope[scope.length - 1];
				if (last["#"] === undefined) {
					last["#"] = "";
				}
				last["#"] += "<![CDATA["
			}
			this._parser.oncdata = function (cdata) {
				const last = scope[scope.length - 1];
				last["#"] += cdata;
			}
			this._parser.onclosecdata = function () {
				const last = scope[scope.length - 1];
				last["#"] += "]]>"
			}
			this._parser.onend = function () {
				resolve(scope[0]);
			};

			this._parser.write(xml).close();
		});
	}
}
