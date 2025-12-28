# GitHub Pages Setup Instructions

This repository is now configured for GitHub Pages deployment. Follow these steps to enable it:

## Automatic Deployment (Recommended)

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Click on **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically deploy on the next push to `main` or `master` branch

Once deployed, your calculator will be available at:
**https://markevanrozeboom.github.io/alpha_facilities_calculator/**

## Manual Deployment (Alternative)

If you prefer not to use GitHub Actions:

1. Go to **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select branch: `main` (or `master`)
4. Select folder: `/ (root)`
5. Click **Save**

GitHub will automatically build and deploy your site within a few minutes.

## Verification

After deployment:
1. Visit the URL: https://markevanrozeboom.github.io/alpha_facilities_calculator/
2. The calculator should load and be fully functional
3. You can share this link with others!

## Troubleshooting

- **404 Error**: Wait a few minutes for initial deployment, or check that GitHub Pages is enabled
- **Blank Page**: Check browser console for errors; the app should work in all modern browsers
- **Not Updating**: Changes pushed to the repository may take 1-2 minutes to appear on the live site

## Notes

- The `.nojekyll` file prevents Jekyll processing (needed for proper GitHub Pages deployment)
- The `pages.yml` workflow automatically deploys changes when you push to main/master
- No build process is needed - the HTML file runs directly in the browser
