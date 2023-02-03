Plug-ins to use in https://github.com/nomi-san/league-loader

# How to install the plug-ins/themes

First of all, everything in the `utils (MANDATORY)` folder is mandatory. You install it the same way you install plug-ins, which is described below.

In League-Loader you have two folders : `plugins` / `assets`

Each folder in this repository represent either a plugin or a theme. Take the one you want, copy `everything` in the plugins folder inside it, paste it in your League-Loader plugins folder. Then copy everything from the `assets` folder and paste it in your League-Loader assets folder.

Sometime, you will notice a `config` folder in the `plugins` folder in this repository. You can safely merge them with any other config folder present in your League-Loader plugins folder.

# Display Back Summoner Names Plugin

If you are to use that plug-in, you have to edit the content of config.cfg file inside your League Loader folder, and put the following:
```
[Main]
LeaguePath=C:\Riot Games\League of Legends
DisableWebSecurity=1
IgnoreCertificateErrors=1
RemoteDebuggingPort=8888
```
