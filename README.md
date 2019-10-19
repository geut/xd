# xd :laughing:

[![Build Status](https://travis-ci.com/geut/xd.svg?branch=master)](https://travis-ci.com/geut/xd)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Run your lint and formatter in a single fast daemon.

This project is based on [eslint_d](https://github.com/mantoni/eslint_d.js).

## How it works

xd is a tool that detects your local lint and starts a daemon server so your next lint/format operations would run faster.

xd support eslint compatible engines.

We support the next engines:
  - `standard`
  - `standard + prettier`
  - `eslint`

## <a name="install"></a> Install

```
$ npm install -g @geut/xd
```

## <a name="usage"></a> Usage

### standard

Start by adding your lint dependencies locally:

```
$ npm install --save-dev standard
```

That's it, try to execute `xd` in your project:

```
$ xd *.js
```

To fix your file:

```
$ xd *.js --fix
```

### standard + prettier

We include a prettier configuration for your standard lint that performs as a linter and formatter.

Prettier will run by:
- Binary `xd-prettier index.js`
- Option `xd --prettier index.js`
- ENV variable `PRETTIER=1 xd index.js`
- Detecting the presence of a `.prettierrc` config file in your project.

xd uses prettierx so you can use any of the next configuration files for your prettier:

- .prettierrc
- .editorconfig

### eslint

xd will check your local binary eslint and configuration or it will use a fallback binary that we include.

## No Server

Exists special cases where maybe you need to use `xd` without running a server.

You can use the binary: `xd-ns` or `xd --no-server`.

## Help

```
$ xd --help
```

## IDE Support

### vim/nvim using ALE

```vim
let g:ale_javascript_eslint_use_global = 1
let g:ale_javascript_eslint_executable = 'xd'
let g:ale_linters = {
  \ 'javascript': ['eslint']
\}
let g:ale_fixers = {
  \ 'javascript': ['eslint']
\}
```

## <a name="issues"></a> Issues

:bug: If you found an issue we encourage you to report it on [github](https://github.com/geut/xd/issues). Please specify your OS and the actions to reproduce it.

## <a name="contribute"></a> Contributing

:busts_in_silhouette: Ideas and contributions to the project are welcome. You must follow this [guideline](https://github.com/geut/xd/blob/master/CONTRIBUTING.md).

## License

MIT © A [**GEUT**](http://geutstudio.com/) project
