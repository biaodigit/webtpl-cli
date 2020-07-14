const fs = require('fs')
const path = require('path')
const Metalsmith = require("metalsmith");
const Handlebars = require('handlebars')
const rm = require("rimraf").sync;

module.exports = ({ metadata, src, dest }) => {
    return new Promise((resolve, reject) => {
        const metalsmith = Metalsmith(process.cwd()) // 以当前工作目录初始化
            .metadata(metadata)
            .clean(false)
            .source(src)    // 读取全部模版代码
            .destination(dest)  // 拷贝到目标目录

        const ignoreFile = path.join(src, './template.ignore')
        if (fs.existsSync(ignoreFile)) {
            metalsmith.use((files, metalsmith, done) => {
                // 定义一个用于移除模版忽略文件的插件
                const meta = metalsmith.metadata()
                // 使用handlebars进行模版渲染获取忽略文件列表
                const ignores = Handlebars.compile(fs.readFileSync(ignoreFile).toString())(meta)
                    .split('\n').filter(item => !!item.length)
                // 删除忽略文件
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
                // 删除.git文件
                if ((/\.git\//.test(fileName))) {
                    delete files[fileName];
                } else {
                    const t = files[fileName].contents.toString()
                    // 渲染模版后缀
                    const n = Handlebars.compile(fileName)(meta)
                    delete files[fileName];
                    // 渲染模版内容
                    files[n] = { contents: Buffer.from(Handlebars.compile(t)(meta)) }
                }
            })
            done()
        })
            .build((err) => {
                // rm(src)np
                err ? reject(`build error: ${err}`) : resolve()
            })
    })
}