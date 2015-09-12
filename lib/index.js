#!/usr/bin/node
'use strict';

process.argv.forEach(function argParser(arg) {
	if (arg === '--help' || arg === '-h' || arg === '--h') {
		console.log(
			'\n' +
			'pincer - recursive static file server\n' +
			'\n' +
			'Usage Examples:\n' +
			'\n' +
			'Serve the current directory @ localhost:8000:\n' +
			'\n' +
			'	$ pincer\n' +
			'\n' +
			'Serve the directory WEBROOT @ localhost:8000:\n' +
			'\n' +
			'	$ pincer [WEBROOT]\n' +
			'\n' +
			'Serve the directory "/var/www" @ 0.0.0.0:8080:\n' +
			'\n' +
			'	$ CWDP=/var/www HOSTP=0.0.0.0 PORTP=8080 pincer\n' +
			'\n' +
			'CWDP defaults to the current directory.\n' +
			'HOSTP defaults to "localhost".\n' +
			'PORTP defaults to "8000".\n' +
			'N.B.: The WEBROOT argument takes precedence over the CWDP environment variable, if both are specified.\n' +
			'\n' +
			'Show pincer\'s help message:\n' +
			'\n' +
			'	$ pincer [ --help | -h | --h ]\n' +
			'\n' +
			'Show the current version of pincer:\n' +
			'\n' +
			'	$ pincer [ --version | -v | --v ]\n'
		);
		return process.exit(0);
	}

	if (arg === '--version' || arg === '-v' || arg === '--v') {
		var VERSION = require('../package.json').version;
		console.log('pincer version %s', VERSION);
		return process.exit(0);
	}
});

var fs   = require('fs');
var http = require('http');
var path = require('path');
var url  = require('url');
var util = require('util');

var mime = require('mime');

mime.default_type = mime.lookup('txt');

var ENOENT            = 'ENOENT';
var TEXT_CONTENT_TYPE = {'Content-Type': mime.lookup('txt') + '; charset=utf-8'};

var cwd  = process.env.CWDP  || process.argv[2] || process.cwd();
var host = process.env.HOSTP || 'localhost';
var port = process.env.PORTP || 8000;

var server = http.createServer(function handler(request, response) {
	response.sendResponse = function sendResponse(code, header, body) {
		this.writeHead(code, header);
		return this.end(body);
	}

	var pathname = url.parse(request.url).pathname;
	var file = path.join(cwd, pathname.substring(1));

	console.log('Request for "%s" ===>  Mapped to "%s".', request.url, file);

	fs.stat(file, function stat(err, stat) {
		if (err) {
			if (err.code === ENOENT) {
				console.log('\tFile "%s" does not exist.', file);
				return response.sendResponse(404, TEXT_CONTENT_TYPE, 'File "' + file + '" does not exist.');
			}

			console.log('\tSome error occured when trying to find file "%s".',
				file);
			return response.sendResponse(500, TEXT_CONTENT_TYPE,
				'Some error occured when trying to find file "' + file + '". The error is as follows:\n' +
				util.inspect(err, {depth: null}));
		}

		if (stat.isDirectory()) {
			fs.readdir(file, function readdir(err, files) {
				if (err) {
					console.log('\tSome error occured when trying to list directory contents of  "%s".', file);
					return response.sendResponse(500, TEXT_CONTENT_TYPE,
						'Some error occured when trying to list directory contents of "' +  file + '". The error is as follows:\n' +
						util.inspect(err, {depth: null}));
				}

				console.log('\tListing directory contents of "%s".', file);
				var fileInDir;
				files.forEach(function link(file) {
					fileInDir = path.join(pathname, file);
					response.write(fileInDir.link(fileInDir) + '<br>\n');
				});
				return response.end();
			});
		} else {
			response.writeHead(200,
				{'Content-Type': mime.lookup(file) + '; charset=utf-8'});
			return fs.createReadStream(file).pipe(response);
		}
	});
});

server.listen(port, host, function listener() {
	console.log('Server listening @ %s:%d with webroot as "%s".',
		host, port, cwd);
});
