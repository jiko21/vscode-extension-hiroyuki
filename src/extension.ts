// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


function refreshDiagnostics(doc: vscode.TextDocument, hiroyukiDiagnostics: vscode.DiagnosticCollection): void {
	const diagnostics = vscode.languages.getDiagnostics();
	let uris: vscode.Uri[] = [];
	let newDiagnostics: vscode.Diagnostic[][] = [];
	diagnostics.forEach((diagnostic) => {
		uris.push(diagnostic[0]);
		let newDiagnostic: vscode.Diagnostic[] = [];
		diagnostic[1].forEach(i => {
			if (!i.message.match('なんだろう')) {
				newDiagnostic.push(
					{
						...i,
						message: `なんだろう、${i.message}なおしてもらってもいいっすか？`,
					}
				);
			}
		});
		newDiagnostics.push(newDiagnostic);
	});
	for (let i = 0; i < uris.length; ++i) {
		hiroyukiDiagnostics.set(uris[i], newDiagnostics[i] as vscode.Diagnostic[]);
	}
}

// function refreshDiagnostics(doc: vscode.TextDocument, hiroyukiDiagnostics: vscode.DiagnosticCollection): void {
// 	const diagnostics: vscode.Diagnostic[] = [];

// 	for (let lineIndex = 0; lineIndex < doc.lineCount; lineIndex++) {
// 		const lineOfText = doc.lineAt(lineIndex);
// 		if (lineOfText.text.includes("明らかに")) {
// 			diagnostics.push(createDiagnostic(doc, lineOfText, lineIndex));
// 		}
// 		if (lineOfText.text.includes("確実に")) {
// 			diagnostics.push(createDiagnosticKakujitsu(doc, lineOfText, lineIndex));
// 		}
// 	}

// 	hiroyukiDiagnostics.set(doc.uri, diagnostics);
// }

function createDiagnostic(doc: vscode.TextDocument, lineOfText: vscode.TextLine, lineIndex: number): vscode.Diagnostic {
	const index = lineOfText.text.indexOf("明らかに");

	const range = new vscode.Range(lineIndex, index, lineIndex, index + '明らかに'.length);

	const diagnostic = new vscode.Diagnostic(range, '明らかにって、それってあなたの感想ですよね', vscode.DiagnosticSeverity.Error);
	diagnostic.code = 'akiraka_mention';
	return diagnostic;
}

function createDiagnosticKakujitsu(doc: vscode.TextDocument, lineOfText: vscode.TextLine, lineIndex: number): vscode.Diagnostic {
	const index = lineOfText.text.indexOf("確実に");

	const range = new vscode.Range(lineIndex, index, lineIndex, index + '確実に'.length);

	const diagnostic = new vscode.Diagnostic(range, 'なんだろう、ウソつくのやめてもらってもいいっすか？', vscode.DiagnosticSeverity.Error);
	diagnostic.code = 'kakujitsu_mention';
	return diagnostic;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const hiroyukiDiagnostics = vscode.languages.createDiagnosticCollection('hrioyuki');
	context.subscriptions.push(hiroyukiDiagnostics);

	if (vscode.window.activeTextEditor) {
		console.log('aaa');
		refreshDiagnostics(vscode.window.activeTextEditor.document, hiroyukiDiagnostics);
	}
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor) {
			refreshDiagnostics(editor.document, hiroyukiDiagnostics);
		}
	}));
		console.log('Congratulations, your extension "hiroyuki" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('hiroyuki.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from hiroyuki!');
	});

	context.subscriptions.push(disposable);

	context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, hiroyukiDiagnostics)));
	context.subscriptions.push(vscode.workspace.onDidCloseTextDocument(doc => hiroyukiDiagnostics.delete(doc.uri)));
}

// this method is called when your extension is deactivated
export function deactivate() {}
