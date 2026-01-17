# bicepjai.github.io

Personal website for [bicepjai](https://github.com/bicepjai).

Built with [SvelteKit 5](https://svelte.dev/). Designed with [Claude](https://claude.ai/).

## Development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Submodule Setup

Blog posts and images are stored in a private submodule (`my-blog-posts`). This requires GitHub Actions secrets for automated deployments.

### Required Tokens

Create a fine-grained PAT named `PRIVATE_CONTENT_TOKEN` with:
- **Repository access**: Both `bicepjai.github.io` and `my-blog-posts`
- **Permissions**: Contents (Read and write)

### Secrets Configuration

Add `PRIVATE_CONTENT_TOKEN` to both repositories:
- https://github.com/bicepjai/bicepjai.github.io/settings/secrets/actions
- https://github.com/bicepjai/my-blog-posts/settings/secrets/actions

### How It Works

1. Push to `my-blog-posts` triggers its workflow
2. That workflow sends a `repository_dispatch` event to `bicepjai.github.io`
3. `bicepjai.github.io` workflow clones the submodule and builds the site

### Writing Posts

Edit files in `my-blog-posts/posts/` and commit:
```sh
cd my-blog-posts
# edit/add posts
git add . && git commit -m "New post" && git push
```
The site will automatically rebuild and deploy.

### Local Development

After cloning, initialize the submodule then run dev server:
```sh
git submodule update --init
npm install
npm run dev
```

Edits to markdown files should auto-reload in the browser. If not, restart the dev server.
