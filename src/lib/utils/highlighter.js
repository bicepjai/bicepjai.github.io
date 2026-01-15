import { createHighlighter } from 'shiki';

let highlighter;

export async function getHighlighter() {
	if (!highlighter) {
		highlighter = await createHighlighter({
			themes: ['vitesse-dark'],
			langs: [
				'javascript',
				'typescript',
				'python',
				'bash',
				'json',
				'html',
				'css',
				'markdown',
				'yaml',
				'shell'
			]
		});
	}
	return highlighter;
}

export async function highlight(code, lang) {
	const h = await getHighlighter();
	const validLang = h.getLoadedLanguages().includes(lang) ? lang : 'text';
	return h.codeToHtml(code, {
		lang: validLang,
		theme: 'vitesse-dark'
	});
}
