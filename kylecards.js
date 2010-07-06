/*
 *  Configuration
 */
var Config = {
    cardFullWidth : 71,
    cardCoveredWidth : parseInt(71/6),
    cardFullHeight : 96,
    cardCoveredHeight : parseInt(96 / 6),
    cardImage : "basic.gif",
    cardBackIndex : 0,
    
    selectedGame : "Klondike",

    mouseDragSensitivity : 5,
    showSelectedCards : false,
    tableColor : "#009900",
    
    showHelp : true
}

/*
 * Utility functions
 */
var Utility = {

    log : function(str) {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        var timeValue = "[" + ((hours >12) ? hours -12 :hours);
        if (timeValue == "0") timeValue = 12;
        timeValue += ((minutes < 10) ? ":0" : ":") + minutes;
        //timeValue += ((seconds < 10) ? ":0" : ":") + seconds;
        timeValue += (hours >= 12) ? "p" : "a";
        timeValue += "] ";
        str = timeValue + str;
        if(typeof GUI == "undefined") {
            alert(str);
        } else {
            GUI.writeLog(str);
        }
    },

    debug : function(str) {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        var timeValue = "[" + ((hours >12) ? hours -12 :hours);
        if (timeValue == "0") timeValue = 12;
        timeValue += ((minutes < 10) ? ":0" : ":") + minutes;
        timeValue += ((seconds < 10) ? ":0" : ":") + seconds;
        timeValue += (hours >= 12) ? "p" : "a";
        timeValue += "] ";
        str = timeValue + str;
        if(!this.debugPanelDiv) {
            this.debugPanelDiv = document.getElementById('debugPanel');
            if(!this.debugPanelDiv) {
                alert("Logging Error. Message: " + str);
            }
        }
        var logDiv = document.createElement("div");
        logDiv.innerHTML = str;
        logDiv.style.padding = "2px";
        this.debugPanelDiv.appendChild(logDiv);
        
    },

    persistPreferences : function() {
        //Utility.debug("Preferences Saved");
        for(var configName in Config) {
            var tempCookie = configName + "=" + Config[configName] + ";";
            if(tempCookie.indexOf("undefined") == -1 ) {
                document.cookie = tempCookie;
            }
        }
    },
    
    loadPreferences : function() {
        var cookies = document.cookie.split(';');
        for(var i = 0; i < cookies.length; i++) {
            var splitCookie = cookies[i].split('=');
            if(splitCookie[0].length > 0) {
                eval("Config." + splitCookie[0] + " = (parseInt(splitCookie[1]) > -1 ? parseInt(splitCookie[1]) : (splitCookie[1] == \"false\" ? false : splitCookie[1])) ");
            }
        }
        if(cookies.length) {
            Utility.debug("Preferences Loaded");
        }
    },
    
    extend : function(newClass, baseClass) {
        newClass.prototype = new baseClass();
        newClass.prototype.constructor = newClass;
    },
    
    getNewGameInstance : function(g) {
        return eval("new " + g + "();");
    },
    
    normalizeEvent : function(e) {
        if (typeof e == 'undefined') {
            e = window.event;
        }
        if (typeof e.layerX == 'undefined') {
            e.layerX = e.offsetX;
        }    
        if (typeof e.layerY == 'undefined') {
            e.layerY = e.offsetY;
        }

        return e;
    },
    
    getRealCoordinates : function(x, y) {
        var ret = new Object();
        ret.x = x * Config.cardFullWidth;
        ret.y = y * Config.cardFullHeight;
        return ret;
    },
    
    processMessage : function(msg) {
        if(GameObjectFactory.currentGame != null) {
            GameObjectFactory.currentGame.processMessage(msg);
        }
    },

    getCardValueName : function(cardValue) {
        switch(cardValue) {
        case 1:
            return "ace";
        case 2:
            return "two";
        case 3:
            return "three";
        case 4:
            return "four";
        case 5:
            return "five";
        case 6:
            return "six";
        case 7:
            return "seven";
        case 8:
            return "eight";
        case 9:
            return "nine";
        case 10:
            return "ten";
        case 11:
            return "jack";
        case 12:
            return "queen";
        case 13:
            return "king";
        default:
            return "ERROR";
        }
    },

    getSuitName : function(suit) {
        switch(suit) {
        case 1:
            return "hearts";
        case 2:
            return "spades";
        case 3:
            return "diamonds";
        case 4:
            return "clubs";
        default:
            return "ERROR";
        }
    }
} 

/*
 *  Enumerations
 */
var CardValue = {
    ace : 1,
    two : 2,
    three : 3,
    four : 4,
    five : 5,
    six : 6,
    seven : 7,
    eight : 8,
    nine : 9,
    ten : 10,
    jack : 11,
    queen : 12,
    king : 13
}

var Color = {
    red : 1,
    black : 2
};

var Suit = {
    heart : 1,
    spade : 2,
    diamond : 3,
    club : 4
};

var GameStatus = {
    loss : -1,
    indeterminate : 0,
    win:1
};

var Visibility = {
    faceDown : -1,
    preserveVisibility : 0,
    faceUp : 1
}

var Orientation = {
    vertical : 0,
    horizontal : 1
}

var SortOrder = {
    random : 0,
    sequentialTop : 1,
    sequentialBottom : 2
}

var MessageTypeLabel = {
    UNDO : "Undo",
    REDO : "Redo",
    HIT  : "Hit",
    STAY : "Stay",
    RESTART : "Deal Again",
    TEST : "Test Action Name"
}

var GameTypes = ["FreeCell", "Golf", "Klondike", "KlondikeOneCard", "Nestor", "TrustyTwelve"];

var SuitGlyph = {
    heart : "<font color='red'>&hearts;</font>",
    spade : "<font color='black'>&spades;</font>",
    diamond : "<font color='red'>&diams;</font>",
    club : "<font color='black'>&clubs;</font>"
}

var HelpMessage = {
    blackjackDealer : "blackjackDealer",
    blackjackPlayer : "blackjackPlayer",
    foundation : "Build up, Ace-to-King, same suit (Example: 6" + SuitGlyph.heart + " on 5" + SuitGlyph.heart + ").<br/>Any Ace may be played if no other cards are present.",
    foundationAnySuit : "Build up, Ace-to-King, any suit (Example: 6" + SuitGlyph.heart + " on 5" + SuitGlyph.diamond + ").<br/>Any Ace may be played if no other cards are present.",
    foundationAnySuitAscDesc : "Build up or down, Ace-to-King, any suit (Example: 6" + SuitGlyph.heart + " on 5" + SuitGlyph.diamond + ").",
    free : "Can hold any one card, which can be played anywhere.",
    pair : "Drag any pair of cards together to discard them.",
    fillEmpty : "Click to deal cards to all empty workspaces.",
    reference : "No cards are available for play.",
    stock : "Click to turn over one card.",
    stock3 : "Click to turn over three cards.",
    topCard : "The top card is available for play.",
    workspace : "Build down, King-to-Ace, alternating suits (Example: 5" + SuitGlyph.heart + " on 6" + SuitGlyph.spade + ").",
    workspaceAnySuitTopCardOnly : "Build down, King-to-Ace, any suit. (Example: 5" + SuitGlyph.club + " on 6" + SuitGlyph.spade + ").<br/>Only top card may be played.",
    xxxTemp : "temp"
}

/*
 *  Action class
 */
function Action() {
    this.sourceDeck = null;
    this.targetDeck = null;
    this.visibility = null;
    this.cardIndex = null;
}

Action.prototype.setSourceDeck = function(sourceDeck) {
    this.sourceDeck = sourceDeck;
}
Action.prototype.setTargetDeck = function(targetDeck) {
    this.targetDeck = targetDeck;
}
Action.prototype.setVisibility = function(visibility) {
    this.visibility = visibility;
}
Action.prototype.setCardIndex = function(cardIndex) {
    this.cardIndex = cardIndex;
}


Action.prototype.reverseVisibility = function() {
    if(visibility == Visibility.faceDown) {
        return Visibility.faceUp;
    } else if(visibility == Visibility.faceUp) {
        return Visibility.faceDown;
    } else {
        return visibility;
    }
}

Action.prototype.copyBaseActionParameters = function(newAction) {
    newAction.setSourceDeck(this.sourceDeck);
    newAction.setTargetDeck(this.targetDeck);
    newAction.setCardIndex(this.cardIndex);
    newAction.setVisibility(this.visibility);
}

Action.prototype.perform = function() {};
Action.prototype.clone = function() {};
Action.prototype.undo = function() {};



/*
 * Constraint
 */
function Constraint() {
    
}
Constraint.prototype.check = function(sourceDeck, targetDeck, cardIndex) {
    
};

/*
 *  Card class
 */
function Card(suit, cardValue) {
    this.suit = suit ? suit : Suit.heart;
    this.cardValue = cardValue ? cardValue : CardValue.ace;
    this.visibility = Visibility.faceUp;
}
Card.prototype.toString = function() { 
    var ret = "";
    ret += Utility.getCardValueName(this.cardValue);
    ret += " of ";
    ret += Utility.getSuitName(this.suit); 
    return ret;
}

Card.prototype.getColor = function() {
    if(this.suit == Suit.heart || this.suit == Suit.diamond) {
        return Color.red;
    } else {
        return Color.black;
    }
}

/*
 *  CardDeck class
 */
function CardDeck(game, deckName) {
    this.cards = new Array();
    this.game = game;
    this.deckName = deckName;

    this.locationX = 0.0;
    this.locationY = 0.0;

    this.orientation = Orientation.vertical;

    this.dragFromConstraint = null;
    
    this.dragToAction = null;
    this.dragToConstraint = null;

    this.selectAction = null;
    this.selectConstraint = null;

    this.visibleSize = -1;
    this.selectedCardIndex = -1;

    if(!(deckName == "selection")) {
        var a = new DrawSelectedCardsToDeckAction();
        a.visibility = Visibility.faceUp;
        this.dragToAction = a;
	}
	
	//GUI Code
	this.div = null;
	
}

CardDeck.prototype.clear = function() {
    this.cards = new Array();
    this.update();
}

CardDeck.prototype.setLocation = function(x, y) {
    this.locationX = x;
    this.locationY = y;
    this.update();
}

CardDeck.prototype.setSelectedCardIndex = function(i) {
    this.selectedCardIndex = i;
    if(i == -1) {
        this.game.selectionDeck.clear();
    } else {
        for(var deckIndex = i; deckIndex < this.cards.length; deckIndex++) {
            this.game.selectionDeck.addCard(this.cards[deckIndex]);
        }
    }
}

CardDeck.prototype.addCard = function(card) {
    this.cards.push(card);
    this.update();
}

CardDeck.prototype.addCards = function(cardsToAdd) {
    this.cards = this.cards.concat(cardsToAdd);
    this.update();
}

CardDeck.prototype.drawCardsFromTop = function(numCards) {
    var startingIndex = this.cards.length - numCards;
    var ret = this.cards.splice(startingIndex, numCards);
    this.update();
    return ret;
}

CardDeck.prototype.drawCard = function(sortOrder) {
    var ret = null;
    switch(sortOrder) {
        case SortOrder.sequentialTop:
            ret = this.drawCardByIndex(this.cards.length - 1);
            break;
        case SortOrder.sequentialBottom:
            ret = this.drawCardByIndex(0);
            break;
        case SortOrder.random:
            ret = this.drawCardByIndex(this.game.dealer.randomInt(this.cards.length));
            break;
        default:
            ret = null;
            break;
    }
    return ret;
}

CardDeck.prototype.drawCardByIndex = function(index) {
    var card;
    if(index < 0 || index >= this.cards.length) {
        return null;
    }
    card = this.cards[index];
    this.cards.splice(index, 1);
    this.update();
    return card;
}

CardDeck.prototype.getCardAtPoint = function(x, y) {
    var selectedCard;
    if(this.orientation == Orientation.vertical) {
        selectedCard = (y + 1) / Config.cardCoveredHeight;
    } else {
        selectedCard = (x + 1) / Config.cardCoveredWidth;
    }
    if(this.visibleSize != -1 && selectedCard > this.visibleSize - 1) {
        selectedCard = this.visibleSize - 1;
    }
    if(selectedCard > this.cards.length - 1) {
        selectedCard = this.cards.length - 1;
    }
    if(this.visibleSize != -1 && this.cards.length > this.visibleSize) {
        selectedCard += this.cards.length - this.visibleSize;
    }
    return parseInt(selectedCard, 10);
}

CardDeck.prototype.reverseCards = function() {
    this.cards.reverse();
    this.update();
}

CardDeck.prototype.actionAllowed = function(cardIndex, action, sourceDeck, targetDeck, constraint) {
    if(action == null) {
        return false;
    } else if(action != null && constraint == null) {
        return true;
    } else {
        var ret = constraint.check(sourceDeck, targetDeck, cardIndex);
        return ret;
    }
}

CardDeck.prototype.onDragCancel = function() {
    this.game.dragFromDeck = null;
    this.game.dragFromDeckIndex = -1;
    this.setSelectedCardIndex(-1);
    this.update();
}

CardDeck.prototype.canDragFrom = function(cardIndex) {
    return (this.dragFromConstraint == null) ? true : this.dragFromConstraint.check(this, null, cardIndex);
}

CardDeck.prototype.onDragFrom = function(cardIndex) {
    if( this.canDragFrom(cardIndex) ) {
        this.game.dragFromDeck = this;
        this.game.dragFromDeckIndex = cardIndex;
        this.setSelectedCardIndex(cardIndex);
        this.update();
        return true;
    } else {
        return false;
    }
}

CardDeck.prototype.onDragTo = function() {
    if( this.actionAllowed(this.game.dragFromDeckIndex, this.dragToAction, this.game.dragFromDeck, this, this.dragToConstraint) ) {
        this.dragToAction.setCardIndex(this.game.dragFromDeckIndex);
        this.dragToAction.setSourceDeck(this.game.dragFromDeck);
        this.dragToAction.setTargetDeck(this);
        var actionResult = this.dragToAction.perform();
        if(actionResult) {
            UndoManager.addAction(this.dragToAction.clone());
            this.game.moveCompleted();
        }
        if(this.game.dragFromDeck != null) {
            this.game.dragFromDeckIndex = -1;
            this.game.dragFromDeck.setSelectedCardIndex(-1);
            this.game.dragFromDeck = null;
        }
        return true;
    } else {
        return false;
    }
}

CardDeck.prototype.onSelect = function(cardIndex) {
    if( this.actionAllowed(cardIndex, this.selectAction, this, this.selectAction == null ? null : this.selectAction.targetDeck, this.selectConstraint) ) {
        this.selectAction.setCardIndex(cardIndex);
        this.selectAction.setSourceDeck(this);
        var actionResult = this.selectAction.perform();
        if(actionResult) {
            UndoManager.addAction(this.selectAction.clone());
            this.game.moveCompleted();
            this.update();
        }
        return actionResult;
    } else {
        return false;
    }
}

CardDeck.prototype.dragToAny = function() {
    var success = false;
    if(this.canDragFrom(DragDropSupport.cardIndex)) {
        this.onDragFrom(DragDropSupport.cardIndex);
        var decks = this.game.table.decks;
        for(var deckName in decks) {
            var deck = decks[deckName];
            if(deck.deckName != this.deckName && deck.deckName != "selection") {
                var canDrag = deck.actionAllowed(DragDropSupport.cardIndex, deck.dragToAction, this, deck, deck.dragToConstraint);
                if(canDrag) {
                    deck.onDragTo();
                    break;
                }
            }
            
        }
        if(!success) {
            this.onDragCancel();
        }
    }
}

CardDeck.prototype.peekCard = function(cardIndex) {
    if(cardIndex >= this.cards.length) {
        return null;
    }
    return this.cards[cardIndex];
}

CardDeck.prototype.peekTopCard = function() {
    return this.peekCard(this.cards.length - 1);
}

CardDeck.prototype.update = function() {
    if(this.game.running && this.game.table.getDeck(this.deckName) != null) {
        if(!this.div) {
            this.div = document.createElement("div");
            this.div.className = "CardDeck";
            this.div.id = "cardDeck-" + this.deckName;
            this.div.style.position = "absolute";
            this.div.style.backgroundColor = "Transparent";
            this.game.table.div.appendChild(this.div);
            if(this.deckName == "selection") {
                this.div.style.zIndex = "10000";
            }
            this.div.onmouseover = DragDropSupport.mouseOver;
            this.div.onmouseout = DragDropSupport.mouseOut;
        
        }
        
        this.div.innerHTML = "";
        
        //size
        if(this.cards.length) {
            if(this.visibleSize == -1) {
                if(this.orientation == Orientation.vertical) {
                    this.div.style.height = ((this.cards.length - 1) * Config.cardCoveredHeight + Config.cardFullHeight) + "px";
                    this.div.style.width = (Config.cardFullWidth) + "px";
                } else {
                    this.div.style.height = (Config.cardFullHeight) + "px";
                    this.div.style.width = ((this.cards.length - 1) * Config.cardCoveredWidth + Config.cardFullWidth) + "px";
                }
            } else {
                var shownCards = (this.cards.length < this.visibleSize) ? this.cards.length : this.visibleSize;
                if(this.orientation == Orientation.vertical) {
                    this.div.style.height = ((shownCards < 1 ? 0 : shownCards - 1) * Config.cardCoveredHeight) + Config.cardFullHeight;
                    this.div.style.width = Config.cardFullWidth;
                } else {
                    this.div.style.height = Config.cardFullHeight;
                    this.div.style.width = ((shownCards < 1 ? 0 : shownCards - 1) * Config.cardCoveredWidth) + Config.cardFullWidth;
                }
            }
        } else {
            this.div.style.height = Config.cardFullHeight;
            this.div.style.width = Config.cardFullWidth;
        }

        //location
        if(this.name != "selection") {
            var coord = Utility.getRealCoordinates(this.locationX, this.locationY);
            this.div.style.left = coord.x;
            this.div.style.top = coord.y;
        }

        //caption
        if(this.caption != null && this.caption.length > 0) {
            if(this.captionDiv == null) {
                this.captionDiv = document.createElement("div");
                
                this.captionDiv.id = this.deckName + "Caption";
                this.captionDiv.style.position = "absolute";
                this.captionDiv.style.left = this.div.style.left
                this.captionDiv.style.top = parseInt(this.div.style.top) + parseInt(this.div.style.height);
                this.captionDiv.style.fontSize = "24px";
                this.captionDiv.style.backgroundColor = "transparent";
                
                this.captionDiv.style.cursor = "default";
                this.captionDiv.onmousedown = function(){return false;};
                
                this.game.table.div.appendChild(this.captionDiv);
            }
            this.captionDiv.style.left = this.div.style.left
            this.captionDiv.style.top = parseInt(this.div.style.top) + parseInt(this.div.style.height);
            this.captionDiv.innerHTML = this.caption;

        }
        

        //images
        var cardIndex = 0;
        if (this.visibleSize != -1 && this.visibleSize < this.cards.length) {
            cardIndex = this.cards.length - this.visibleSize;
        }

        var displaySelectedCards = Config.showSelectedCards;
        var numSelectedCardsToDraw = this.selectedCardIndex == -1 ? 0 : this.cards.length - this.selectedCardIndex;
        var numCardsToDraw = (this.visibleSize == -1 ? this.cards.length : (this.visibleSize < this.cards.length ? this.visibleSize : this.cards.length)) - numSelectedCardsToDraw;
        var originalCardIndex = cardIndex;
        
        for(var i = 0; i < numCardsToDraw; i++) {
            var card = this.cards[cardIndex];
            var div = null;
            if(cardIndex == this.cards.length - 1 || (!displaySelectedCards && cardIndex == this.cards.length - 1 - numSelectedCardsToDraw)) {
                div = this.getFullCardDiv(card, (cardIndex - originalCardIndex));
            } else {
                div = this.getPartialCardDiv(card, (cardIndex - originalCardIndex));
            }
            if(this.deckName == "selection") {
                //div.style.MozOpacity = "0.80";
            }
            this.div.appendChild(div);
            
            cardIndex++;
        }
        
        if(displaySelectedCards) {
            for(var i = 0; i < numSelectedCardsToDraw; i++) {
                var card = this.cards[cardIndex];
                var div = null;
                if(cardIndex == this.cards.length - 1) {
                    div = this.getFullCardDiv(card, (cardIndex - originalCardIndex));
                } else {
                    div = this.getPartialCardDiv(card, (cardIndex - originalCardIndex));
                }
                //div.style.MozOpacity = "0.80";
                this.div.appendChild(div);
                
                var div2 = GameObjectFactory.createImageDiv(5,2);
                div2.style.top = div.style.top;
                div2.style.left = div.style.left;
                
                this.div.appendChild(div2);
                
                cardIndex++;
            }
        }

        if(numCardsToDraw == 0 && numSelectedCardsToDraw == 0 || (!displaySelectedCards && numCardsToDraw == 0)) {
            if(this.deckName != "selection") {
                var emptyDiv = GameObjectFactory.createImageDiv(5, 1);
                emptyDiv.onmousedown = DragDropSupport.mouseDown;
                emptyDiv.deck = this;
                this.div.appendChild(emptyDiv);
            }            
        }
    }
}

CardDeck.prototype.getFullCardDiv = function(card, offset) {
    card.div = GameObjectFactory.createCardDiv(card);
    card.div.deck = this;
    if(this.orientation == Orientation.vertical) {
        card.div.style.top = offset * Config.cardCoveredHeight;
    } else {
        card.div.style.left = offset * Config.cardCoveredWidth;
    }
    return card.div;
}

CardDeck.prototype.getPartialCardDiv = function(card, offset) {
    var cardDiv = this.getFullCardDiv(card, offset);
    if(this.orientation == Orientation.vertical) {
        cardDiv.style.height = Config.cardCoveredHeight + 2;
    } else {
        cardDiv.style.width = Config.cardCoveredWidth + 2;
    }
    return cardDiv;
}

CardDeck.prototype.toString = function() {
    var ret = this.deckName + " ";
    if(this.cards == null || this.cards.length == 0) {
        ret += "{ empty }";
    } else {
        ret += "(" + this.cards.length + " cards) {\n";
        for(var i = 0; i < this.cards.length; i++) {
            ret += "    ";
            ret += this.cards[i].toString();
            ret += "\n";
        }
        ret += "  }"
    }
    return ret;
}

/*
 * Dealer class
 */
function Dealer(game) {
    this.game = game;
}

Dealer.prototype.randomInt = function(maxExclusive) {
    return parseInt(Math.random() * (maxExclusive - 1));
}

Dealer.prototype.fillDeck = function(deck, numDecks, faceUp) {
    numDecks = (null == numDecks ? 1 : numDecks);
    faceUp = (null == faceUp ? false : faceUp);
    
    for(var itr = 0; itr < numDecks; itr++) {
        for(var suit in Suit) {
            for(var val in CardValue) {
                var card = GameObjectFactory.createCard(Suit[suit], CardValue[val]);
                card.visibility = (faceUp ? Visibility.faceUp : Visibility.faceDown);
                deck.addCard(card);
            }
        }

    }
}

Dealer.prototype.shuffle = function(deck) {
    var loops = deck.cards.length * 7;
    for(var i = 0; i < loops; i++) {
        deck.addCard(deck.drawCard(SortOrder.random));
    }
}

Dealer.prototype.dealCard = function(fromDeck, toDeck, visibility) {
    visibility = (null == visibility ? Visibility.preserveVisibility : visibility);
    
    var tempCard = fromDeck.drawCard(SortOrder.sequentialTop);
    if(tempCard != null) {
        if(visibility != Visibility.preserveVisibility) {
            tempCard.visibility = visibility;
        }
        toDeck.addCard(tempCard);
    }
}

Dealer.prototype.dealCards = function(numCards, fromDeck, toDeck, visibility) {
    var cards = fromDeck.drawCardsFromTop(numCards);
    if(visibility != Visibility.preserveVisibility) {
        for(var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.visibility = visibility;
        }
    }
    toDeck.addCards(cards);
}

/*
 * Game class
 */
function Game() {
    this.running = false;

    this.dealer = null;
    this.selectionDeck = null;
    this.victoryConstraint;
    
    this.tableHeight = 5.0;
    this.tableWidth = 5.0;
    
    this.friendlyName = "Test Game";

    this.dragFromDeck = null;
    this.dragFromDeckIndex = null;
}

Game.prototype.objective = "Work in Progress";
Game.prototype.layout = "Work in Progress";
Game.prototype.rules = "Work in Progress";

Game.prototype.setUp = function() {
    GameObjectFactory.game = this;
    this.table = GameObjectFactory.createTable();
    
    UndoManager.reset();
    this.dealer = new Dealer(this);
    this.selectionDeck = GameObjectFactory.createSelectionDeck();
    this.table.addDeck(this.selectionDeck);
    this.availableMessages = ["UNDO", "REDO", "RESTART"];
}

Game.prototype.start = function() {
    GameObjectFactory.currentGame = this;
    GUI.setAbout(this.about);
    GUI.setGameName(this.friendlyName);
    GUI.enableTable();
    Utility.log(this.friendlyName + " started.");
    this.running = true;
    this.table.resize(this.tableHeight, this.tableWidth);
    GUI.renderAvailableMessages();
    for(var deck in this.table.decks) {
        this.table.decks[deck].update();
    }
    this.moveCompleted();
}

Game.prototype.setAvailableMessages = function(msgs) {
    this.availableMessages = msgs;
    GUI.renderAvailableMessages();
}

Game.prototype.processMessage = function(message) {
    switch(message) {
    case "UNDO":
        UndoManager.undoAction();
        break;
    case "REDO":
        UndoManager.redoAction();
        break;
    case "RESTART":
        this.tearDown();
        this.setUp();
        this.start();
        break;
    default:
        alert("invalid message: " + message);
        break;
    }
    this.moveCompleted();
}

Game.prototype.moveCompleted = function() {
    var status = this.getGameStatus();
    if(status == GameStatus.win) {
        this.table.doWin();
    } else if(status == GameStatus.loss) {
        this.table.doLoss()
    } else if(status == GameStatus.indeterminate) {
        //nothing - keep truckin.
    } else {
        Utility.log("Unknown Game Status");
    }
}

Game.prototype.getGameStatus = function() {
    return GameStatus.indeterminate;
}

Game.prototype.tearDown = function() {
    this.table.removeAllDecks();
    this.running = false;
    GameObjectFactory.currentGame = null;
}

Game.prototype.toString = function() {
    return "KyleCards Card Game Instance.<br/>" + this.table.toString();
}

/*
 *  GameObjectFactory class
 */
var GameObjectFactory = {
    currentGame : null,
    
    createCard : function(suit, cardValue) {
        return new Card(suit, cardValue);
    },
    
    createCardDeck : function(name, helpMessage) {
        var ret = new CardDeck(this.game, name);
        ret.helpMessage = helpMessage;
        return ret;
    },

    createSelectionDeck : function() {
        var ret = new CardDeck(this.game, "selection");
        ret.setLocation(-1000, -1000);
        return ret;
    },

    createTable : function() {
        return new Table(this.game);
    },

    createCardDiv : function(card) {
        var div = null;
        if(card.visibility == Visibility.faceDown) {
            div = GameObjectFactory.createImageDiv(5, 3 + Config.cardBackIndex);
        } else {
            div = GameObjectFactory.createImageDiv(card.suit, card.cardValue);
        }
        div.onmousedown = DragDropSupport.mouseDown;
        div.ondblclick = DragDropSupport.doubleClick;
        return div;
    },

    createImageDiv : function(row, col) {
        var div = document.createElement("div");
        div.style.position = "absolute";
        div.style.left = "0px";
        div.style.top = "0px";
        div.style.height = Config.cardFullHeight;
        div.style.width = Config.cardFullWidth;
        div.style.backgroundImage = "url(" + Config.cardImage + ")";
        
        div.style.backgroundPosition = "-" + ((col - 1) * Config.cardFullWidth) + "px -" + ((row - 1) * Config.cardFullHeight) + "px";
        return div;
    } 
};


/*
 * Table class
 */
function Table(game) {
    this.decks = new Object();
    this.game = game;
    
    //GUI Code
    this.div = document.getElementById(GUI.tableDivId);
    this.div.innerHTML = "";
    this.div.style.cursor = "auto";
    this.div.style.position = "absolute";
    this.div.style.left = GUI.tableLeft;
    this.div.style.top = GUI.tableTop;
    this.div.style.backgroundColor = Config.tableColor;
}

Table.prototype.addDeck = function(deck) {
    this.decks[deck.deckName] = deck;
}

Table.prototype.resize = function(height, width) {
    var coord = Utility.getRealCoordinates(width, height);
    this.div.style.width = coord.x;
    this.div.style.height = coord.y;
    GUI.resizeTable();
}

Table.prototype.removeDeck = function(deckName) {
    var deck = this.decks[deckName];
    this.div.removeChild(deck.div);
    delete this.decks[deckName];
    return deck;
}

Table.prototype.removeAllDecks = function() {
    for(var deck in this.decks) {
        this.removeDeck(deck);
    }
    this.decks = new Object();
}

Table.prototype.getDeck = function(deckName) {
    return this.decks[deckName];
}

Table.prototype.toString = function() {
    var ret = "CardTable {";
    for(var entry in this.decks) {
        ret += "\n  ";
        ret += this.decks[entry].toString();
    }
    ret += "\n}";
    return ret;
}

Table.prototype.doWin = function() {
    DragDropSupport.reset();
    GUI.doWin();
}

Table.prototype.doLoss = function() {
    DragDropSupport.reset();
    GUI.doLoss();
}

/*
 *  UndoManager class (singleton)
 */
var UndoManager = {
    undoActions : new Array(),
    undoActionsIndex : -1,
    
    reset : function() {
        undoActions = new Array();
        undoActionsIndex = -1;
    },
    
    addAction : function(action) {
        if(undoActionsIndex != undoActions.length - 1) {
            undoActions.splice(undoActionsIndex + 1, undoActions.length - (undoActionsIndex + 1));
        }
        undoActions.push(action.clone());
        undoActionsIndex++;
    },

    isUndoAvailable : function() {
        return false;
    },

    undoAction : function() {
        if(undoActions && undoActions.length > 0 && undoActionsIndex != -1) {
            var action = undoActions[undoActionsIndex];
            action.undo();
            undoActionsIndex--;
        }
    },

    redoAction : function() {
        if(undoActions && undoActions.length > 0 && undoActionsIndex < (undoActions.length - 1)) {
            var action = undoActions[undoActionsIndex + 1];
            action.perform();
            undoActionsIndex++;
        }
    }
};    
