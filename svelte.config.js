import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';

const theme = 'vitesse-dark';
const highlighter = await createHighlighter({
	themes: [theme],
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
		'shell',
		'text'
	]
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		mdsvex({
			extensions: ['.md'],
			highlight: {
				highlighter: (code, lang) => {
					const validLang = highlighter.getLoadedLanguages().includes(lang) ? lang : 'text';
					const html = highlighter.codeToHtml(code, { lang: validLang, theme });
					return `{@html \`${html.replace(/`/g, '\\`')}\`}`;
				}
			}
		})
	],
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		paths: {
			base: ''
		}
	}
};

export default config;
