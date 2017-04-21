import {
    window,
    commands,
    ExtensionContext,
    Range,
} from 'vscode';

const _ = require('lodash');

const STRING_FUNCTIONS = {
    camelCase: _.camelCase,
    capitalize: _.capitalize,
    constantCase: s => _.toUpper(_.snakeCase(s)),
    deburr: _.deburr,
    dotCase: s => _.replace(_.kebabCase(s), '-', '.'),
    escape: _.escape,
    escapeRegExp: _.escapeRegExp,
    kebabCase: _.kebabCase,
    lowerCase: _.lowerCase,
    lowerFirst: _.lowerFirst,
    pad: _.pad,
    padEnd: _.padEnd,
    padStart: _.padStart,
    parseInt: _.parseInt,
    pascalCase: s => _.upperFirst(_.camelCase(s)),
    pathCase: s => _.replace(_.kebabCase(s), '-', '/'),
    repeat: _.repeat,
    replace: _.replace,
    snakeCase: _.snakeCase,
    spaceCase: s => _.replace(_.kebabCase(s), '-', ' '),
    split: _.split,
    startCase: _.startCase,
    toLower: _.toLower,
    toUpper: _.toUpper,
    trim: _.trim,
    trimEnd: _.trimEnd,
    trimStart: _.trimStart,
    unescape: _.unescape,
    upperCase: _.upperCase,
    upperFirst: _.upperFirst,
    words: _.words,
};

const GET_PARAM_FUNCTION = {
    pad: resolve => {
        window.showInputBox({prompt: 'Length'})
        .then(p => {
            window.showInputBox({prompt: 'Chars'})
            .then(r => {
                resolve([p, r || " "]);
            })
        });
    },
    padEnd: resolve => {
        window.showInputBox({prompt: 'Length'})
        .then(p => {
            window.showInputBox({prompt: 'Chars'})
            .then(r => {
                resolve([p, r || " "]);
            })
        });
    },
    padStart: resolve => {
        window.showInputBox({prompt: 'Length'})
        .then(p => {
            window.showInputBox({prompt: 'Chars'})
            .then(r => {
                resolve([p, r || " "]);
            })
        });
    },
    repeat: resolve => {
        window.showInputBox({prompt: 'n'})
        .then(n => {
            resolve([n]);
        });
    },
    replace: resolve => {
        window.showInputBox({prompt: 'Pattern'})
        .then(p => {
            window.showInputBox({prompt: 'Replacement'})
            .then(r => {
                resolve([p, r]);
            })
        });
    },
    split: resolve => {
        window.showInputBox({prompt: 'Separator'})
        .then(s => {
            resolve([s]);
        });
    }
};

const GET_PARAMS = function(name) {
    let r;
    let p = new Promise(resolve => {
        r = params => {
            resolve(params);
        };
    });

    if (!GET_PARAM_FUNCTION[name]) {
        r([]);
    } else {
        GET_PARAM_FUNCTION[name](r);
    }

    return p;
};

const CONVERT_STRINGS = function(name) {
    const editor = window.activeTextEditor;

    if (!editor) return;

    GET_PARAMS(name)
    .then((params) => {
        editor.edit(editBuilder => {
            _.each(editor.selections, selection => {
                editBuilder.replace(
                    selection,
                    STRING_FUNCTIONS[name](editor.document.getText(new Range(selection.start, selection.end)), ...[].concat(params)).toString()
                );
            });
        });
    });
};

export function activate(context: ExtensionContext) {
    _.each(STRING_FUNCTIONS, (fn, name) => {
        context.subscriptions.push(
            commands.registerCommand(name, _.partial(CONVERT_STRINGS, name))
        );
    });
}

export function deactivate() {}
