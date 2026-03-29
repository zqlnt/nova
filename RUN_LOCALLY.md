# Run Nova Locally

## Quick start

```bash
cd /Users/user/nova-1
npm run dev:fresh
```

When you see `✓ Ready`, open the URL shown in the terminal (usually **http://localhost:3000** or **http://localhost:3001** if 3000 is in use).

## If port is in use

If you see `Port 3000 is in use, trying 3001 instead`, use the URL the terminal shows (e.g. http://localhost:3001).

To free port 3000:
```bash
lsof -ti :3000 | xargs kill -9
```

Then run `npm run dev` again.

## If build fails with _document error

Clear the cache and rebuild:
```bash
rm -rf .next
npm run build
npm start
```

## Production build

```bash
npm run build
npm start
```

Then open http://localhost:3000
