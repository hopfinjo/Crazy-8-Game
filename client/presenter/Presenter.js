/**
 * Main logic for the game Crazy Eights between a human and the computer.
 */
class Presenter {
    /** 
     * Initialize game by creating instance variables reprsenting the
     * deck, the discard pile, the View object (which will be
     * responsible for managing the user interface), and the human and
     * computer player instance variables.  Also create an instance
     * variable for recording the human's most recently selected card
     * (useful when an 8 is selected).
     */
    constructor() {
	this.deck = new Deck();
	this.pile = new Pile();
	this.view = new View(this);
	this.human = new HumanPlayer(this.deck, this.pile, this.view);
	this.computer = new ComputerPlayer(this.deck, this.pile, this.view);
	this.cardString = "";
    }

    /**
     * Begin play of the game by requesting server to initialize and
     * return player and computer hands and the top card of the pile.
     */
    play() {
	this.request("initialize");
    }

    /**
     * Send the specified type of request (initialize, etc.) to the
     * server, receive back JSON data, parse this data into a
     * JavaScript object, and pass this object as an argument to this
     * Presenter object's <code>receiver()</code> method.  The
     * <code>receiver()</code> method will then load the data into the
     * client-side model and display the current state of the game.
     *
     * @param type {string} The type of request to be made to the
     *        server.  The string includes any necessary parameters.
     *        Example <code>type</code> values are <code>initialize</code> and 
     *        <code>playNormalCard?card=9h</code> .
     */



    async request(type) {
	try {

	    // *** YOUR CODE BELOW ***
        let response = await fetch(`http://localhost:3000/${type}`);
        let json = await response.json();
        this.receiver(json);
        
	}
	catch (ex) {
	    console.log(ex);
	}
    }
    /**
     * Receive JSON response from server and use to update
     * appropriate data structures.  Then display the game.
     */
    receiver(response) {
	let humanList = [];
	response.human.forEach(
	    card =>
		{ humanList.push(new Card(card.suit, card.value)); } );
	this.human.replace(humanList);
	let topPileCard = new Card(response.pile.suit, response.pile.value);
	this.pile.acceptACard(topPileCard);
	this.pile.setAnnouncedSuit(response.announcedSuit);
	let computerList = [];
	for (let i = 1; i <= response.computer; i++) {
	    computerList.push(new Card("b", "b"));
	}
	this.computer.replace(computerList);

	this.display();
    }

    /**
     * Update display and announce a winner if there is one.
     */
    display() {
	this.view.displayComputerHand(this.computer.getHandCopy());
	this.view.displayPileTopCard(this.pile.getTopCard());
	this.view.displayHumanHand(this.human.getHandCopy());
	if (this.computer.isHandEmpty()) {
	    this.view.announceComputerWinner();
	}
	else if (this.human.isHandEmpty()) {
	    this.view.announceHumanWinner();
	}
    }
    /**
     * Record the card selected from the player's hand.  If this
     * selection completes player's turn (as indicated by "true"
     * return value from HumanPlayer), notify the server that this
     * card is being played.
     * @param {string} cardString - Card selected by the player from their hand.
     */
    cardSelected(cardString) {
	this.cardString = cardString; // Store to later pass with suitPicked
	if (this.human.cardSelected(cardString)) {
	    this.request(`playNormalCard?card=${cardString}`);
	}
    }
    /**
     * Tell server that human has picked a card from the deck.
     */
    cardPicked() {
	this.request("pickCardFromDeck");
    }
    /**
     * Turn off the suit picker.  Then tell server which
     * card (an 8) the user has selected (as recorded by cardSelected) 
     * and what suit it should represent.
     * @param {string} suit - The suit chosen: 'c', 'd', 'h', or 's'
     */
    suitPicked(suit) {
        this.view.undisplaySuitPicker();
	this.request(`play8?card=${this.cardString}&suit=${suit}`);
    }
}
