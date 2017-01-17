// The module 'vscode' contains the VS Code extensibility API
// Import the necessary extensibility types to use in your code below
import {
    window,
    commands,
    ExtensionContext,
    Range,
} from 'vscode';

const _ = require('lodash');

const stringFunctionNames = [
    'camelCase',
    'capitalize',
    'deburr',
    'escape',
    'escapeRegExp',
    'kebabCase',
    'lowerCase',
    'lowerFirst',
    // 'pad',
    // 'padEnd',
    // 'padStart',
    'parseInt',
    // 'repeat',
    // 'replace',
    'snakeCase',
    // 'split',
    'startCase',
    'toLower',
    'toUpper',
    'trim',
    'trimEnd',
    'trimStart',
    'unescape',
    'upperCase',
    'upperFirst',
    // 'words',
];

const convertStrings = function(fn) {
    const editor = window.activeTextEditor;

    if (!editor) return;

    editor.edit(editBuilder => {
        _.each(editor.selections, selection => {
            editBuilder.replace(
                selection,
                fn(editor.document.getText(new Range(selection.start, selection.end)))
            );
        });
    });
};

// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
export function activate(context: ExtensionContext) {
    _.each(stringFunctionNames, fn => {
        context.subscriptions.push(
            commands.registerCommand(fn, convertStrings.bind(null, _[fn])));
    });
}

export function deactivate() {}
