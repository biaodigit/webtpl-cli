const basePrompt = (name) => ([
    {
        name: 'name',
        message: '项目的名称',
        default: name
    }, {
        name: 'version',
        message: '项目的版本号',
        default: '1.0.0'
    }, {
        name: 'description',
        message: '项目的简介',
        default: `${name} project`
    }
])

const reactPrompt = [
    {
        type: "confirm",
        message: "使用typescript?",
        name: "typescript"
    },
    {
        type: "confirm",
        message: "使用redux?",
        name: "redux"
    },
    {
        type: "confirm",
        message: "使用react-router?",
        name: "react_router"
    },
    {
        type: "confirm",
        message: "使用预处理器?",
        name: "use_csspre",
    },
    {
        type: "list",
        message: "请选择 CSS 预处理器(Sass/Less/Stylus)",
        name: "css_pre",
        choices: [
            { name: "Sass", value: "sass" },
            { name: "Less", value: "less" },
            { name: "Stylus", value: "stylus" }
        ],
        when: (res) => Boolean(res.use_csspre)
    }
]

const vuePrompt = []

const rollupPrompt = [
    {
        type: "confirm",
        message: "使用typescript?",
        name: "typescript"
    }
]

const promptMap = new Map([
    ['react', reactPrompt],
    ['vue', vuePrompt],
    ['rollup', rollupPrompt]
])

module.exports = (name, type) => {
    const customizePrompt = promptMap.get(type.replace(/template-/, ''))
    return [...basePrompt(name), ...customizePrompt]
}