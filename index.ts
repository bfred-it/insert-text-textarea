declare global {
	interface InputEventInit {
	// Wait for https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33903
		inputType: string;
	}

	interface Window {
		InputEvent: typeof InputEvent;
	}
}

// Replace selection with text, with Firefox support
function insertText(textarea: HTMLTextAreaElement, text: string): void {
	const document = textarea.ownerDocument!;
	const window = document.defaultView!;

	textarea.focus(); // The passed `textarea` may not be focused

	if (document.execCommand('insertText', false, text)) {
		return;
	}

	// Found on https://www.everythingfrontend.com/posts/insert-text-into-textarea-at-cursor-position.html 🎈
	textarea.setRangeText(
		text,
		textarea.selectionStart,
		textarea.selectionEnd,
		'end' // Without this, the cursor is either at the beginning or `text` remains selected
	);

	textarea.dispatchEvent(new window.InputEvent('input', {
		data: text,
		inputType: 'insertText',
		isComposing: false // TODO: fix @types/jsdom, this shouldn't be required
	}));
}

export = insertText;
