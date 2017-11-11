const function_params = require('../../script/function/params'),
      import_codes = require('../../script/imports'),
      require_codes = require('../../script/requires'),
      config_codes = require('../../script/configs'),
      extend_code = require('../../script/extend'),
      {
          apply
      } = require('../../../template');

module.exports = (sourceCode , template , {
    ...data
} = {}) =>{

    let {
        fullName,
        code,
        meta,
    } = sourceCode,
    {
        imports,
        configs,
        extend,
        requires,
    } = meta;

    return apply(template , {
        fullName,
        code,
        imports:import_codes(imports),
        requires:require_codes(requires),
        configs:config_codes(configs),
        extend:extend_code(extend),
        ...data
    }) ;
}