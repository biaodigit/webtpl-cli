const fs = require('fs')
const path = require('path')
const Metalsmith = require("metalsmith");
const Handlebars = require('handlebars')
const rm = require("rimraf").sync;

module.exports = ({ metadata, src, dest }) => {
    return new Promise((resolve, reject) => {
        const metalsmith = Metalsmith(process.cwd())
            .metadata(metadata)
            .clean(false)
            .source(src)
            .destination(dest)

        const ignoreFile = path.join(src, './template.ignore')
        if (fs.existsSync(ignoreFile)) {
            metalsmith.use((files, metalsmith, done) => {
                const meta = metalsmith.metadata()
                const ignores = Handlebars.compile(fs.readFileSync(ignoreFile).toString())(meta)
                    .split('\n').filter(item => !!item.length)

                Object.keys(files).forEach(fileName => {
                    ignores.forEach(ignore => {
                        if (fileName.indexOf(ignore) > -1) delete files[fileName]
                    })
                })
                done()
            })
        }
        metalsmith.use((files, metalsmith, done) => {
            const meta = metalsmith.metadata()
            Object.keys(files).forEach(fileName => {
                if ((/\.git\//.test(fileName))) {
                    delete files[fileName];
                } else {
                    const t = files[fileName].contents.toString()
                    const n = Handlebars.compile(fileName)(meta)
                    delete files[fileName];
                    files[n] = { contents: Buffer.from(Handlebars.compile(t)(meta)) }
                }
            })
            done()
        })
        .build((err) => {
            rm(src)
            err ? reject(`build error: ${err}`) : resolve()
        })
    })
}