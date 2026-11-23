# A Little Birthday Surprise — React

A responsive birthday microsite built with React + Vite.

## Run locally
1. Install Node.js (18+ recommended).
2. Extract this folder and open it in VS Code.
3. In the terminal, run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed by Vite.

## Personalise it
- Open `src/main.jsx`.
- The greeting is already personalised for Sneha.
- Edit the birthday note inside the `.message` paragraph.
- Edit the final surprise inside the `.surprise-note` paragraph.
- Optional: replace the wording in the three wish cards with your own inside jokes or personal wishes.

## Build for deployment
Run `npm run build`. The production site will be generated in the `dist` folder.

## Add Sneha's photos
Create a folder named `public/photos` and add three photos:
- `sneha-1.jpg`
- `sneha-2.jpg`
- `sneha-3.jpg`

The gallery is already wired to these filenames. You can use `.png` or `.webp` too, but update the matching image paths in `src/main.jsx`.

The page is personalised for Sneha's 23rd birthday and includes subtle entrance, floating, candle-flame, hover, and confetti animations.\n