// The module 'vscode' contains the VS Code extensibility API
// Import the necessary extensibility types to use in your code below
import {
    window,
    commands,
    ExtensionContext,
    Range,
} from 'vscode';

const _ = require('lodash');

const stringFunctions = [
    _.camelCase,
    _.capitalize,
    _.deburr,
    _.escape,
    _.escapeRegExp,
    _.kebabCase,
    _.lowerCase,
    _.lowerFirst,
    // _.pad,
    // _.padEnd,
    // _.padStart,
    _.parseInt,
    // _.repeat,
    // _.replace,
    _.snakeCase,
    // _.split,
    _.startCase,
    _.toLower,
    _.toUpper,
    _.trim,
    _.trimEnd,
    _.trimStart,
    _.unescape,
    _.upperCase,
    _.upperFirst,
    // _.words,
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
    _.each(stringFunctions, fn => {
        context.subscriptions.push(
            commands.registerCommand(fn, convertStrings.bind(null, fn))
        );
    });
}

export function deactivate() {}
