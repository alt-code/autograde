//const ql = require('mkql')
//, ast = require('mkast');
const ql = require("mkql"), ast = require("mkast")

/*ast.src('Paragraph\n\n* 1\n* 2\n* 3\n\n```javascript\nvar foo;\n```')
.pipe(ql('p, ul, pre[info^=javascript]'))
.pipe(ast.stringify({indent: 2}))
.pipe(process.stdout);
*/

var example = 'Paragraph\n\n* 1\n* 2\n* 3\n\n### Header\n\n```javascript\nvar foo;\nrequire("bob")\n```';
var result  = ql.query(example, 'h3 + pre')

console.log(result[0]._literal)
