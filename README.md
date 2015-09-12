PinCer
======
**P**.in**C**.er stands for "**P**uny **S**erver". Yes, I know.

PinCer is a recursive static file server that serves content-types correctly
and logs nicely that runs on Node.js.

Its primary purpose is iteratively developing and debugging entirely static
websites.

(**Don't use PinCer in production environments.**).

Usage Examples
--------------
Serve the current directory @ `localhost:8000`:

	$ pincer

Serve the directory `WEBROOT` @ `localhost:8000`:

	$ pincer [WEBROOT]

Serve the directory `/var/www` @ `0.0.0.0:8080`:

	$ CWDP=/var/www HOSTP=0.0.0.0 PORTP=8080 pincer

`CWDP` defaults to the current directory.

`HOSTP` defaults to `localhost`.

`PORTP` defaults to `8000`.

N.B.: The `WEBROOT` argument takes precedence over the `CWDP` environment
variable, if both are specified.

Show pincer's help message:

	$ pincer [ --help | -h | --h ]

Show the current version of pincer:

	$ pincer [ --version | -v | --v ]

Install
-------
    $ sudo npm install -g pincer

Why does this exist?
--------------------
Because I was tired of writing the same static file server over and over again.
Serving static files with express.js is nice, but it's like killing a bug with
a forest fire.

pincer ins one-file small (~100 lines, excluding dependencies) and has super
sane defaults.

Features
--------
- Recursive static file serving.
- Serves Content-Types based on file extension (defaulting to `text/plain` if
  non-existent, or unknown)
- Logs requested server route, and the correspondingly served file.
	- Logs file serving errors as well (non-existent file, etc.).
- Serves files with the `utf-8` charset.
- One-file (~100 lines, excluding dependencies) small, so super extensible.
