const function_params = require('../../script/function/params'),
      import_codes = require('../../script/imports'),
      require_codes = require('../../script/requires'),
      config_codes = require('../../script/configs'),
      extend_code = require('../../script/function/extend'),
      {
          apply
      } = require('../../../template');

module.exports = (sourceCode , template) =>{

    let {
        fullName,
        code,
        meta,
    } = sourceCode,
    {
        scoped,
        params,
        imports,
        configs,
        extend,
        requires,
    } = meta;

    return apply(template , {
        fullName,
        code,
        params:function_params(params),
        imports:import_codes(imports),
        requires:require_codes(requires),
        configs:config_codes(configs),
        extend:extend_code(extend)
    }) ;
}