import {create} from "xmlbuilder2";
import {XMLBuilder} from "xmlbuilder2/lib/interfaces";

export class Builder {
	constructor() {
	}

	build(json: string): string {
		const root = create({version: '1.0', encoding: 'UTF-8', standalone: true});

		function build(parent: XMLBuilder, node: any) {
			let unorderedChildren: { i: number, parent: XMLBuilder, key: string, node: any }[] = [];
			for (const key in node) {
				if (key === "#") {
					parent.txt(node[key]);
				} else if (key === "_") {
					for (const attr in node[key]) {
						parent.att(attr, node[key][attr]);
					}
				} else if (key === "@") {
					// ignore
				} else {
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
					} else {
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
			// TODO: Children without an index should be placed at the end. Is this the case?
			unorderedChildren.sort((a, b) => a.i - b.i);

			for (const unorderedChild of unorderedChildren) {
				const el = unorderedChild.parent.ele(unorderedChild.key);
				build(el, unorderedChild.node);
			}
		}

		build(root, json);

		return root.end({prettyPrint: true, indent: "\t"});
	}
}
