# surge(.sh)

> Publish web apps to a CDN with a single command and no setup required.

[![NPM](https://nodei.co/npm/surge.png?global=true)](https://nodei.co/npm/surge/)

This is the CLI client for the surge.sh hosted service. It’s what gets installed when you run `npm install -g surge`.

This CLI library manages access tokens locally and handles the upload and subsequent reporting when you publish a project using surge.

## Usage

It’s easier to show than tell so let’s get to it! The following command will deploy the current working directory to the surge servers where the application will be available at sintaxi.com.

    $ surge ./ sintaxi.com

Run `surge --help` to see the following overview of the `surge` command...

```

  Surge – Single-command web publishing. (v0.20.3)

  Usage:
    surge <project> <domain>

  Options:
    -a, --add           adds user to list of collaborators (email address)
    -r, --remove        removes user from list of collaborators (email address)
    -V, --version 