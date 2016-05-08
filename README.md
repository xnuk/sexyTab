# It's just a tab switcher.

## How to build
```bash
npm install -g jpm

npm install --save-dev
npm run build

jpm xpi
```

## How to install
1. Download xpi file from [releases](https://github.com/xnuk/todo/releases)
2. In `about:config`, set `xpinstall.signatures.required` to false.
3. Check whether or not you can trust this program.
4. Drop `@sexytab-0.*.*.xpi` to Firefox.
5. Make sure you trust the program and me.
6. Click install.
7. Go to "`about:addons` -> Extensions panel -> Sexy tab switcher -> Options" and choose a backup folder which you will use.
8. Press Alt+\`.
9. Have fun!

## What are all these files
```
┌ .editorconfig             # EditorConfig is awesome: https://EditorConfig.org
├ index.js                  # The main script
├ package.json              # jpm taste package.json + npm taste dependencies
├ webpack.config.js         # webpack configuration
├ LICENSE                   # This repo uses zlib license.
├ README.md
├ .gitignore
├ src
　 ├ panel.js                # The main panel's script
　 ├ panel.styl              # The main panel's stylesheet
　 └ entry.js                # Packing two things above.
└ data
　 ├ 1px_transparent.png     # Really. It has only 1px and it's transparent.
　 ├ panel.html              # The main panel's layout
　 └ icon                    # Icons for ActionButton
　 　 ├ 16.png
　 　 ├ 32.png
　 　 └ 64.png
```
