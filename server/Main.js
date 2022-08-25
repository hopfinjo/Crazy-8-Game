"use strict";

/**
 * The object that represents the current state of the game.
 */

var presenter;

// *** YOUR CODE BELOW ***

const Presenter = require('./presenter/Presenter');
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
const baseURL = `http://${hostname}:${port}/`;

function main() {
    try {
	
	// Create the server.
	const server = http.createServer(handleRequest);
	
    // start server
	server.listen(port, hostname, () => {
	    console.log(`Server running at ${baseURL}`);
	});
    }
    catch (ex) {
	console.log("Exception in main:");
	console.log(ex);
    }
}

function handleRequest(req, res) {
    let thisURL = new URL(req.url, baseURL);
    console.log(thisURL);
    if(thisURL.pathname == '/initialize'){
        presenter = new Presenter();
    }
    else if(thisURL.pathname == '/pickCardFromDeck'){
        presenter.cardPicked();
    }
    else if(thisURL.pathname == '/playNormalCard'){
        const card = thisURL.searchParams.get('card');
        presenter.cardSelected(card);
    }
    else if(thisURL.pathname == '/play8'){
        const card = thisURL.searchParams.get('card');
        const suit = thisURL.searchParams.get('suit');
        presenter.cardSelected(card);
        presenter.suitPicked(suit);
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    let response_body = JSON.stringify(
        {
         human: presenter.human.getHandCopy(),
         computer: presenter.computer.getHandCopy().length,
         pile: presenter.pile.getTopCard(),
         announcedSuit: presenter.pile.announcedSuit
        } );
    res.end(response_body);    
}

main();