packagecmp
==========

Compare installed Node modules with package.json.

The CLI throws exit code 1 if a module is missing or it encounters a version mismatch.


### Installation

`npm install -g packagecmp`


### Usage


#### CLI

`packagecmp [PATH]`


#### NodeJS

```js

var packagecmp = require('packagecmp');

packagecmp('/root/path/to/package', function(err, modules) {
});

```
