# noxml

Parse XML into predictable JavaScript objects and serialize it back.

## Installation

```sh
npm install nooxml
```

Requires Node.js 20 or newer.

## Usage

```ts
import {Builder, Parser} from "noxml";

const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xml>
	<foo>1</foo>
	<bar>2</bar>
	<foo bool="true">3</foo>
</xml>`;

const parser = new Parser();
const builder = new Builder();

const json = await parser.parse(xml);
json.xml.foo.push({"#": "4"});

console.log(builder.build(json));
```

This will output:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xml>
	<foo>1</foo>
	<bar>2</bar>
	<foo bool="true">3</foo>
	<foo>4</foo>
</xml>
```

## Data Shape

```json
{
  "xml": {
    "@": 0,
    "foo": [
      {
        "@": 1,
        "_": {
          "bool": "true"
        },
        "#": "3"
      }
    ]
  }
}
```

- `@`: element order index
- `_`: attributes
- `#`: text content
- other keys: child elements

## Development

```sh
npm install
npm test
npm run build
```

## License

MIT
