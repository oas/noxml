import * as FileSystem from "fs";
import * as Path from "path";

export function readResource(name: string): string {
	return FileSystem.readFileSync(Path.join(__dirname, "resources", name), "utf8");
}
