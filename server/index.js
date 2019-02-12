#!/usr/bin/env node

const express = require('express');
const process = require("process");
const tree    = require("./tree");
const args    = require("args");

// parse commandline flags and run server:
args
	.option("port", "The port to run the server on", 8080)
	.option("path", "The path to serve static files from", "client");

serveApp(args.parse(process.argv));

// wrap successes in a standard format:
function success(res, out){
	setTimeout(() => {
		json(res,{
			data: out,
			error: null
		});
	}, delayFor(out));
}

// wrap errors in a standard format:
function error(res, message){
	json(res,{
		data: null,
		error: message
	});
}

//send pretty JSON for easy inspection:
function json(res, out){
	res.set("Content-Type", "application/json");
	res.send(JSON.stringify(out,null,"\t"));
}

// introduce a delay to simulate work done:
function delayFor(out){
	let multiplier = Math.sqrt(Math.random()) * 0.8 + 0.2;
	return JSON.stringify(out).length / (50 * multiplier);
}

// run this with the below options to start the server:
// { staticPath: string }
function serveApp(opts){

	let app = express();

	// get top level item IDs:
	app.get("/api/top/childids", (req, res) => {

		let children = tree.childIds(null);

		if(children){
			success(res, children);
		} else {
			res.status(404);
			error(res, "ITEM_NOT_FOUND");
		}

	});

	// get top level child details:
	app.get("/api/top/children", (req, res) => {

		let children = tree.children(null);

		if(children){
			success(res, children);
		} else {
			res.status(404);
			error(res, "ITEM_NOT_FOUND");
		}

	});

	// returns the child IDs for the item ID provided:
	app.get("/api/item/:id/childids", (req, res) => {

		let children = tree.childIds(req.params.id);

		if(children){
			success(res, children);
		} else {
			res.status(404);
			error(res, "ITEM_NOT_FOUND");
		}

	});

	// returns the children for the item ID provided:
	app.get("/api/item/:id/children", (req, res) => {

		let children = tree.children(req.params.id);

		if(children){
			success(res, children);
		} else {
			res.status(404);
			error(res, "ITEM_NOT_FOUND");
		}

	});

	// returns an item given the ID provided:
	app.get("/api/item/:id", (req, res) => {

		let item = tree.get(req.params.id);

		if(item){
			success(res, item);
		} else {
			res.status(404);
			error(res, "ITEM_NOT_FOUND");
		}

	});

	// all other API routes will fail.
	app.get("/api/*", (req, res) => {
		res.status(404);
		error(res, "INVALID_API_ROUTE");
	});

	// anything else redirects to the "client"
	// folder to serve static content:
	app.get('/*', express.static(opts.path));

	// kick off our application:
	console.log("starting server on port:     "+opts.port);
	console.log("serving static content from: "+opts.path);
	app.listen(opts.port);

}