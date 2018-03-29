import {
    window,
    commands,
    ExtensionContext,
    Range,
} from 'vscode';

import {
    // string functions
    camelCase,
    capitalize,
    deburr,
    escape,
    escapeRegExp,
    kebabCase,
    lowerCase,
    lowerFirst,
    pad,
    padEnd,
    padStart,
    parseInt,
    repeat,
    replace,
    snakeCase,
    split,
    startCase,
    toLower,
    toUpper,
    trim,
    trimEnd,
    trimStart,
    unescape,
    upperCase,
    upperFirst,
    words,

    // useful helper functions
    each,
    partial,
} from 'lodash';

const stringFunctions = {
    camelCase,
    capitalize,
    constantCase: s => toUpper(snakeCase(s)),
    deburr,
    dotCase: s => replace(kebabCase(s), '-', '.'),
    escape,
    escapeRegExp,
    kebabCase,
    lowerCase,
    lowerFirst,
    pad,
    padEnd,
    padStart,
    parseInt,
    pascalCase: s => upperFirst(camelCase(s)),
    pathCase: s => replace(kebabCase(s), '-', '/'),
    repeat,
    replace,
    snakeCase,
    spaceCase: s => replace(kebabCase(s), '-', ' '),
    split,
    startCase,
    toLower,
    toUpper,
    trim,
    trimEnd,
    trimStart,
    unescape,
    upperCase,
    upperFirst,
    words,
};

const paramFunctions = {
    pad: resolve => {
        window.showInputBox({prompt: 'Length'})
        .then(l => {
            window.showInputBox({prompt: 'Chars'})
            .then(c => {
                resolve([l, c || " "]);
            })
        });
    },
    padEnd: resolve => {
        window.showInputBox({prompt: 'Length'})
        .then(l => {
            window.showInputBox({prompt: 'Chars'})
            .then(c => {
                resolve([l, c || " "]);
            })
        });
    },
    padStart: resolve => {
        window.showInputBox({prompt: 'Length'})
        .then(l => {
            window.showInputBox({prompt: 'Chars'})
            .then(c => {
                resolve([l, c || " "]);
            })
        });
    },
    repeat: resolve => {
        window.showInputBox({prompt: 'Number of times to repeat'})
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

const getParams = function(name) {
    let res;
    const promise = new Promise(resolve => {
        res = params => {
            resolve(params);
        };
    });

    if (!paramFunctions[name]) {
        res([]);
    } else {
        paramFunctions[name](res);
    }

    return promise;
};

const convertStrings = function(name) {
    const editor = window.activeTextEditor;

    if (!editor) return;

    getParams(name)
    .then((params) => {
        editor.edit(editBuilder => {
            each(editor.selections, selection => {
                editBuilder.replace(
                    selection,
                    stringFunctions[name](
                        editor.document.getText(new Range(
                            selection.start,
                            selection.end
                        )),
                        ...[].concat(params)
                    ).toString()
                );
            });
        });
    });
};

export function activate(context: ExtensionContext) {
    each(stringFunctions, (fn, name) => {
        context.subscriptions.push(
            commands.registerCommand(name, partial(convertStrings, name))
        );
    });
}

export function deactivate() {}
