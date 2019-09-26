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
    map,
    each,
    partial,
} from 'lodash';

const stringFunctions = {
    camelCase,
    capitalize,
    constantCase: s => toUpper(snakeCase(s)),
    deburr,
    dotCase: s => replace(kebabCase(s), /-/g, '.'),
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
    pathCase: s => replace(kebabCase(s), /-/g, '/'),
    repeat,
    replace,
    snakeCase,
    spaceCase: s => replace(kebabCase(s), /-/g, ' '),
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

const showTextManipulatorMenu = () => {
    const editor = window.activeTextEditor;
    const selection = editor.selections[0];
    const text = editor.document.getText(new Range(selection.start, selection.end));

    if (!editor || !text) return;

    const opts = map(stringFunctions, (fn, name) => `${name} - ${fn(text)}`);

    window.showQuickPick(opts)
        .then((option) => {
            convertStrings(option.split(' ')[0]);
        });
};

export function activate(context: ExtensionContext) {
    each(stringFunctions, (fn, name) => {
        context.subscriptions.push(
            commands.registerTextEditorCommand(name, partial(convertStrings, name))
        );
    });

    context.subscriptions.push(
        commands.registerCommand('showTextManipulatorMenu', showTextManipulatorMenu)
    );
}

export function deactivate() {}
