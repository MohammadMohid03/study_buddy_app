# GitHub Actions APK Build Setup

This GitHub Action will automatically build your Android APK using EAS Build on GitHub's servers.

## Setup Steps:

### 1. Get your Expo Access Token
Run this command in your terminal:
```powershell
eas whoami
```

If you're logged in, run:
```powershell
eas token:create
```

Copy the token that's generated (starts with `eas_...`).

### 2. Add the token to GitHub Secrets

1. Go to your GitHub repository: https://github.com/MohammadMohid03/study_buddy_app
2. Click **Settings** (top right)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Name: `EXPO_TOKEN`
6. Value: Paste your token from step 1
7. Click **Add secret**

### 3. Trigger the Build

**Option A - Manual Trigger:**
1. Go to **Actions** tab in your GitHub repo
2. Click **Build Android APK** workflow
3. Click **Run workflow** button
4. Select `main` branch
5. Click **Run workflow**

**Option B - Automatic Trigger:**
The workflow will automatically run when you push changes to the `study_buddy_app` folder.

### 4. Download the APK

1. Wait for the build to complete (5-10 minutes)
2. Go to the workflow run
3. Scroll down to **Artifacts**
4. Download **app-release.apk**

## Notes:
- The APK will be available for 30 days after the build
- You can trigger builds manually anytime from the Actions tab
- The build uses the `preview` profile from your `eas.json`
