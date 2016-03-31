## Now Assistant for Desktop

### Migration to nwjs v0.13
- gulpfile and package.json files are updated to use nwjs v0.13
- project now uses nw-builder instead of node-webkit-builder
- nw-builder is not yet updated to correctly build for nwjs v0.13
- one has to manually apply a patch to make nw-builder work correctly

#### Patching nw-builder
- project uses gulp-nw-builder for nw-builder related tasks
- navigate to `<project-folder>/node-modules/gulp-nw-builder/node-modules/nw-builder/lib`
- open `platform.js` file
- apply [this pull request](https://github.com/nwjs/nw-builder/pull/301/files)
- this pull requests updates nw-builder to correctly build with nwjs v0.13

### How to install

1. download nw.js version 0.12.3 from [here](http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-win-ia32.zip). Extract the archive to the folder of your choice. We call this `nwjsFolder`
* install gulp from command line/terminal
      npm install -g gulp
* clone the Now Assistant [repository](https://github.com/IntranetFactory/nwjsAppTest) to the folder of your choice. We call this `naFolder`
* using command line / terminal, navigate to `naFolder`. In that folder you will find `gulpfile.coffee` file
* in `naFolder` run
      npm install
to install dependencies for the project

### How to run
1. using command line navigate to `naFolder` and then navigate to `src/` subfolder
* in command line type
      osprompt\naFolder\src>nsjsFolder\nw.exe .
* Please note the . (dot) at the end. It is important. Please type it.

### How to build
1. using command line navigate to `naFolder`
* in command line type
      osprompt\naFolder>gulp clean
to `clean` the previuos build, and
      osprompt\naFolder>gulp build:win32
to `create` a new win32 build
* read the `gulpfile.coffee` to find out what are the names of other available gulp tasks

### How to debug
1. right click the Now Assistant window and launch dev tools
* dev tools behave the same way as in browser

### How to test
To be written ...

### Tips
* **wine**: If you're on OS X/Linux and want to build for Windows, you need [Wine](http://winehq.org/) installed. Wine is required in order
to set the correct icon for the exe. If you don't have Wine, you can comment out the `winIco` field in `gulpfile`.
* **makensis**: Required by the `pack:win32` task in `gulpfile` to create the Windows installer.
* [**fpm**](https://github.com/jordansissel/fpm): Required by the `pack:linux{32|64}:deb` tasks in `gulpfile` to create the linux installers.

Quick install on OS X:

    brew install wine makensis
    sudo gem install fpm

### OS X: pack the app in a .dmg

    gulp pack:osx64

### Windows: create the installer

    gulp pack:win32

### Linux 32/64-bit: pack the app in a .deb

    gulp pack:linux{32|64}:deb

The output is in `./dist`. Take a look in `gulpfile.coffee` for additional tasks.

**TIP**: use the `--toolbar` parameter to quickly build the app with the toolbar on. E.g. `gulp build:win32 --toolbar`.

**TIP**: use `gulp build:win32 --noicon` to quickly build the Windows app without the icon.

**TIP**: for OS X, use the `run:osx64` task to build the app and run it immediately.
