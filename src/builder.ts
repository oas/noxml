import {create} from "xmlbuilder2";
import {XMLBuilder} from "xmlbuilder2/lib/interfaces";

export class Builder {
	constructor() {
	}

	build(json: any): string {
		const root = create({version: '1.0', encoding: 'UTF-8', standalone: true});

		function build(parent: XMLBuilder, node: any) {
			let unorderedChildren: {i: number, parent: XMLBuilder, key: string, node: any}[] = [];
			for (const key in node) {
				if (key === "#") {
					parent.txt(node[key]);
				}
				else if (key === "_") {
					for (const attr in node[key]) {
						parent.att(attr, node[key][attr]);
					}
				}
				else if (key === "@") {
					// ignore
				}
				else {
					const child: any | any[] = node[key];
					if (Array.isArray(child)) {
						for (const element of child) {
							unorderedChildren.push({
								i: element["@"],
								parent: parent,
								key: key,
								node: element,
							});
						}
					}
					else {
						unorderedChildren.push({
							i: child["@"],
							parent: parent,
							key: key,
							node: child,
						});
					}
				}
			}

			// We want to restore the original order of the children by sorting them by their index.
			unorderedChildren.sort((a, b) => {
				if (a.i === undefined && b.i === undefined) {
					return 0;
				}
				else if (a.i === undefined) {
					return 1;
				}
				else if (b.i === undefined) {
					return -1;
				}

				return a.i - b.i;
			});

			for (const unorderedChild of unorderedChildren) {
				const el = unorderedChild.parent.ele(unorderedChild.key);
				build(el, unorderedChild.node);
			}
		}

		build(root, json);

		return root.end({prettyPrint: true, indent: "\t"});
	}
}
