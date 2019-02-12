# Coding Challenge

Hello! This is a (hopefully) fun challenge to put your frontend skills to the test. The basic aim is to create a single page app using AngularJS that allows a user to browse a fake folder structure obtained from a small backend server.

# Hello World!

These instructions assume that you are running linux or MacOS, and may vary on a Windows machine.

To get started, you'll need NodeJS (the demo was created using v7.2.0). From a console, type `npm install` in this folder in order to install our dependencies, and then type `npm run hello_world` to start the demo implementation.

Once the server has started, you will hopefully be able to browse to 'http://localhost:8080/' in order to view the "Hello World" index.html located in the 'solutions/hello_world' subfolder. `npm run hello_world` is an alias for `node server/index.js --port 8080 --path solution/hello_world`. You can either work in this folder, add another folder, or rename it; just run the full version of the command pointed at your new path. I will refer to this path as your working directory.

Any files and folders you put in your working directory will be accessible via the server using a similar URL, so for example (assuming the working directory is 'solution/hello_world') a file at 'solution/hello_world/folder/hello.jpg' would be accessible by navigating to 'http://localhost:8080/folder/hello.jpg' (note that the working directory, in this case 'solution/hello_world', is always omitted from the URL).

The only exception to this static file serving is that any URL beginning 'http://localhost:8080/api' will be directed to the small server API instead (described later), which can be used to get information about the files and folders in our fake folder structure.

# The Rules

Create an index.html in your working directory such that the resulting page served is a small app that allows the user to browse the folder structure provided by our server API (see below).

You may use any version of AngularJS, any other technology/build process as required, and design the page any way you like. If you have build steps, for example compiling LESS/SCSS to CSS, please provide all of the original sources and build scripts as well so that we can replicate the build process ourselves.

You may add what you like to package.json (for example a new command alias, or additional packages), but please leave the code in the 'server' folder untouched (unless of course you run into a bug that needs fixing!).

If you run into any difficulties or need any clarification, please feel free to get in touch; we are happy to answer any questions!

# /api

A small API is provided under '/api' in order to allow you to obtain information about the fake folder structure we'd like you to render on the frontend. Every request under this path will return JSON that looks something like:

```
{
	"error": ERR,
	"data": DATA
}
```

Where `ERR` is either `null` or a string denoting the type of error, and `DATA` is some JSON encapsulating the request specific data, or `null` if the request failed (in which case `ERR` will always be a string).

With that in mind, below is a brief summary of the available routes and what they return. Because the routes are simple GET requests, it is easy just to enter the URLs straight into the browser and see what you get back, to help get acquainted with them. For example, navigating to "http://localhost:8080/api/top/children" will return the result of the first API call described below.

## /api/top/children

Returns data containing a JSON array of the FILEs and FOLDERs at the top level of our folder structure. Each file will look something like:

```
{
	"name": "A filename",
	"type": "FILE",
	"id": "a123",
	"parentId": "a456",
	"fileType": "JPG"
}
```

And each folder will look something like:

```
{
	"name": "A folder name",
	"type": "FOLDER",
	"id": "a123",
	"parentId": "a456",
	"numberOfChildren": 123
}
```

## /api/top/childids

If successful, returns data containing a JSON array of child IDs, for example:

```
["a1", "a34", "a45"]
```

## /api/item/ITEMID

Where `ITEMID` is the ID of the item you wish to get details for. This returns the FILE or FOLDER details corresponding to the `ITEMID` provided. If an item with the ID provided does not exist, this will return an error `"ITEM_NOT_FOUND"`.

## /api/item/ITEMID/children

Where `ITEMID` is the ID of the item you wish to get details for. If successful, this will return data containing an array of FILEs and FOLDERs that are children of the ID provided. If an item with the ID provided does not exist, or it is a FILE and so cannot have children, you'll get an `"ITEM_NOT_FOUND"` error back.

## /api/item/ITEMID/childids

Where `ITEMID` is the ID of the item you wish to get details for. If successful, this will return data containing an array of FILE and FOLDER IDs that are children of the ID provided. If an item with the ID provided does not exist, or it is a FILE and so cannot have children, you'll get an `"ITEM_NOT_FOUND"` error back.

# FAQ

## NodeJS spits out an error when trying to start the server up; what do I do?

One such common error to encounter is:

```
SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode
```

Normally, this means that your version of NodeJS is out of date. The demo was tested on NodeJS `v7.2.0`; make sure you are uptodate!