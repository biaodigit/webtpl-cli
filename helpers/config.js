exports.getQuestions = (path) => {
    return [
        {
            type: 'text',
            name: 'name',
            message: '模板名称(默认 )',
            initial: path,
            validate: function (val) {
                return true;
            }
        },
        {
            type: 'text',
            name: 'description',
            message: '模板描述',
            validate: function (val) {
                if (!val) {
                    return '模板不为空'
                } else {
                    return true;
                }
            }
        },
        {
            type: 'text',
            name: 'framework',
            message: '框架模版',
            validate: function (val) {
                if (!val) {
                    return '模板不为空'
                } else {
                    return true;
                }
            }
        }
    ]
}