# Run Nova Locally

**Always `cd` into this repo (`nova-1`) before `npm run dev`.** If you run dev from another project folder, you will start that other app instead.

This project uses a **fixed dev port (3010)** so it does not clash with other apps on 3000.

## Quick start

```bash
cd /Users/user/nova-1
npm run dev:fresh
```

When you see `✓ Ready`, open **http://127.0.0.1:3010** (a banner prints this when the server starts).

## If port 3010 is in use

```bash
lsof -ti :3010 | xargs kill -9
```

Then run `npm run dev` again from **this** folder.

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

Then open http://localhost:3000 (production `next start` defaults to port 3000 unless you set `PORT`).
