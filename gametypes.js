/// Blackjack
function Blackjack() {
}
Utility.extend(Blackjack, Game);

Blackjack.prototype.friendlyName = "Blackjack";
Blackjack.prototype.time = 1;
Blackjack.prototype.difficulty = 3;
Blackjack.prototype.skill = 1;
Blackjack.prototype.successPercent = 49;

Blackjack.prototype.setUp = function() {
    Game.prototype.setUp.call(this, []); 
    this.tableHeight = 3.8;
    this.tableWidth = 5.6;
    
    this.gameComplete = false;
    this.availableMessages = ["HIT", "STAY", "RESTART"];

    this.dealerDeck = GameObjectFactory.createCardDeck("deck", HelpMessage.stock);
    this.dealer.fillDeck(this.dealerDeck, 1, false);
    this.dealer.shuffle(this.dealerDeck);
    
    var dealerHand = GameObjectFactory.createCardDeck("DealerHand", HelpMessage.blackjackDealer);
    dealerHand.visibleSize = -1;
    dealerHand.orientation = Orientation.horizontal;
    dealerHand.setLocation(0.1, 0.1);
    dealerHand.dragFromConstraint = new FailureConstraint();
    dealerHand.dragToConstraint = new FailureConstraint();
    this.table.addDeck(dealerHand);

    var playerHand = GameObjectFactory.createCardDeck("PlayerHand", HelpMessage.blackjackPlayer);
    playerHand.visibleSize = -1;
    playerHand.orientation = Orientation.horizontal;
    playerHand.setLocation(0.1, 1.7);
    playerHand.dragFromConstraint = new FailureConstraint();
    playerHand.dragToConstraint = new FailureConstraint();
    this.table.addDeck(playerHand);

    this.dealer.dealCard(this.dealerDeck, playerHand, Visibility.faceUp);
    this.dealer.dealCard(this.dealerDeck, dealerHand, Visibility.faceDown);
    this.dealer.dealCard(this.dealerDeck, playerHand, Visibility.faceUp);
    this.dealer.dealCard(this.dealerDeck, dealerHand, Visibility.faceUp);

    dealerHand.caption = "Dealer<br/>?";
    
    var playerScore = this.getTotal(playerHand);
    playerHand.caption = "Player<br/>" + playerScore;
}

Blackjack.prototype.processMessage = function(message) {
    switch(message) {
    case "HIT":
        var playerHand = this.table.getDeck("PlayerHand");
        this.dealer.dealCard(this.dealerDeck, playerHand, Visibility.faceUp);
        var playerScore = this.getTotal(playerHand);
        playerHand.caption = "Player<br/>" + playerScore;
        playerHand.update();
        if(playerScore > 21) {
            this.gameComplete = true;
        }
        break;
    case "STAY":
        var dealerHand = this.table.getDeck("DealerHand");
        dealerHand.cards[0].visibility=Visibility.faceUp;
        dealerHand.update();
        var dealerScore = this.getTotal(dealerHand);
        var playerScore = this.getTotal(this.table.getDeck("PlayerHand"));
        if(dealerScore < playerScore) {
            while (dealerScore < 17) {
                this.dealer.dealCard(this.dealerDeck, this.table.getDeck("DealerHand"), Visibility.faceUp);
                dealerScore = this.getTotal(dealerHand);
            }
        }
        this.gameComplete = true;
        break;
    default:
        Game.prototype.processMessage.call(this, message);
        break;
    }
    this.moveCompleted();
}

Blackjack.prototype.getGameStatus = function() {
    var dealerHand = this.table.getDeck("DealerHand");
    var dealerScore = this.getTotal(dealerHand);
    
    var playerHand = this.table.getDeck("PlayerHand");
    var playerScore = this.getTotal(playerHand);
    playerHand.caption = "Player<br/>" + playerScore;
    
    if(this.gameComplete == true) {
        dealerHand.caption = "Dealer<br/>" + dealerScore;
        dealerHand.cards[0].visibility=Visibility.faceUp;
        dealerHand.update();
        if((dealerScore > 21 && playerScore < 22) || (dealerScore < playerScore && playerScore < 22)) {
            return GameStatus.win;
        } else {
            return GameStatus.loss;
        }
    }
    return GameStatus.indeterminate;
}

Blackjack.prototype.getTotal = function(cardDeck) {
    var ret = 0;
    var aceCount = 0;
    for(var i = 0; i < cardDeck.cards.length; i++) {
        var card = cardDeck.cards[i];
        if(card.cardValue == CardValue.ace) {
            aceCount++;
            ret += 11;
        } else if(card.cardValue < CardValue.ten) {
            ret += card.cardValue;
        } else {
            ret += 10;
        }
    }
    while(ret > 21 && aceCount > 0) {
        ret -= 10;
        aceCount--;
    }
    return ret;
}

/// FreeCell
function FreeCell() {
}
Utility.extend(FreeCell, Game);

FreeCell.prototype.friendlyName = "FreeCell";
FreeCell.prototype.about = "Move all the cards to the home cells, using the free cells as placeholders. To win, make four stacks of cards on the home cells, one for each suit, stacked in order of rank, from lowest (ace) to highest (king).";
FreeCell.prototype.time = 4;
FreeCell.prototype.difficulty = 5;
FreeCell.prototype.skill = 7;
FreeCell.prototype.successPercent = 33;

FreeCell.prototype.setUp = function() {
    Game.prototype.setUp.call(this, []); 
    this.tableHeight = 4.4;
    this.tableWidth = 8.9;
    
    var deck = GameObjectFactory.createCardDeck("deck", HelpMessage.stock);
    this.dealer.fillDeck(deck, 1, false);
    this.dealer.shuffle(deck);

    for(var i = 1; i < 5; i++) {
        var tempDeck = GameObjectFactory.createCardDeck("HomeStable" + i, HelpMessage.foundation);
        tempDeck.visibleSize = 1;
        tempDeck.setLocation(4.5 + (i - 1) * 1.1, 0.1);
        tempDeck.dragFromConstraint = new FailureConstraint();
        tempDeck.dragToConstraint = GameTypeHelper.getFoundationConstraint();
        this.table.addDeck(tempDeck);
    }

    for(var i = 1; i < 5; i++) {
        var tempDeck = GameObjectFactory.createCardDeck("FreeStable" + i, HelpMessage.free);
        tempDeck.visibleSize = 1;
        tempDeck.setLocation(0.1 + (i - 1) * 1.1, 0.1);
        tempDeck.dragFromConstraint = new TopCardConstraint();
        tempDeck.dragToConstraint = new TargetDeckEmptyConstraint();
        this.table.addDeck(tempDeck);
    }

    for(var i = 1; i < 9; i++) {
        var tempDeck = GameObjectFactory.createCardDeck("Workspace" + i, HelpMessage.workspace);
        tempDeck.visibleSize = -1;
        tempDeck.setLocation(0.1 + (i - 1) * 1.1, 1.3);
        tempDeck.dragFromConstraint = new TopCardConstraint();
        tempDeck.dragToConstraint = GameTypeHelper.getWorkspaceConstraint();
        this.table.addDeck(tempDeck);
        this.dealer.dealCards(i >= 5 ? 6 : 7, deck, tempDeck, Visibility.faceUp);
    }
}

FreeCell.prototype.getGameStatus = function() {
    if(false) {
        return GameStatus.loss;
    }
    if(this.table.getDeck("HomeStable1").cards.length == 13 && this.table.getDeck("HomeStable2").cards.length == 13 && this.table.getDeck("HomeStable3").cards.length == 13 && this.table.getDeck("HomeStable4").cards.length == 13) {
        return GameStatus.win;
    }
    return GameStatus.indeterminate;
}

/// Golf
function Golf() {
}
Utility.extend(Golf, Game);

Golf.prototype.friendlyName = "Golf";
Golf.prototype.about = "Build the bottom pile up or down regardless of suit. Ranking of cards is not continuous: an Ace may be built only on a 2, a King only on a Queen."
Golf.prototype.time = 2;
Golf.prototype.difficulty = 1;
Golf.prototype.skill = 2;
Golf.prototype.successPercent = 4;

Golf.prototype.objective = "Move all cards to the Score Deck (Lower Left).";
Golf.prototype.layout = "Golf Layout";
Golf.prototype.rules = "Golf Rules";

Golf.prototype.setUp = function() {
    Game.prototype.setUp.call(this, []); 
    
    this.tableHeight = 4.0;
    this.tableWidth = 8.0;
    
    var deck = GameObjectFactory.createCardDeck("deck", HelpMessage.stock);
    deck.orientation = Orientation.horizontal;
    deck.setLocation(4.5, 1.8);
    deck.dragFromConstraint = new FailureConstraint();
    deck.dragToConstraint = new FailureConstraint();
    deck.selectConstraint = new TopCardConstraint();
    this.dealer.fillDeck(deck, 1, false);
    this.dealer.shuffle(deck);
    this.table.addDeck(deck);

    var usedDeck = GameObjectFactory.createCardDeck("usedDeck", HelpMessage.foundationAnySuitAscDesc);
    usedDeck.orientation = Orientation.horizontal;
    usedDeck.setLocation(0.1, 1.8);
    usedDeck.visibleSize = 22;
    usedDeck.dragFromConstraint = new FailureConstraint();
    
    var dragToConstraint = new AggregateConstraint();
    dragToConstraint.addConstraint(new ValueOffByOneConstraint());
    usedDeck.dragToConstraint = dragToConstraint;
    
    usedDeck.dragToAction = new DrawSelectedCardsToDeckAction();

    usedDeck.selectConstraint = new FailureConstraint();
    this.dealer.dealCard(deck, usedDeck, Visibility.faceUp);
    this.table.addDeck(usedDeck);

    var moveCardToUsedAction = new DrawSelectedCardsToDeckAction();
    moveCardToUsedAction.setTargetDeck(usedDeck);
    moveCardToUsedAction.setVisibility(Visibility.faceUp);
    deck.selectAction = moveCardToUsedAction;

    for(var i = 1; i < 8; i++) {
        var workspaceDeck = GameObjectFactory.createCardDeck("Workspace" + i, HelpMessage.topCard);
        workspaceDeck.setLocation(0.1 + (i - 1) * 1.1, 0.1);
        workspaceDeck.dragFromConstraint = new TopCardConstraint();
        workspaceDeck.dragToConstraint = new FailureConstraint();
        var selectConstraint = new AggregateConstraint();
        selectConstraint.addConstraint(new TopCardConstraint());
        selectConstraint.addConstraint(new ValueOffByOneConstraint());
        workspaceDeck.selectConstraint = selectConstraint;
        moveCardToUsedAction = new DrawSelectedCardsToDeckAction();
        moveCardToUsedAction.setTargetDeck(usedDeck);
        workspaceDeck.selectAction = moveCardToUsedAction;
        this.dealer.dealCards(5, deck, workspaceDeck, Visibility.faceUp);
        this.table.addDeck(workspaceDeck);
    }
}

Golf.prototype.getGameStatus = function() {
    if(this.table.getDeck("usedDeck").cards.length == 52) {
        return GameStatus.win;
    }
    var movesLeft = true;
    
    if(!movesLeft) {
        return GameStatus.loss;
    }
    return GameStatus.indeterminate;
}

///Klondike
function Klondike() {
}
Utility.extend(Klondike, Game);

Klondike.prototype.friendlyName = "Solitaire";
Klondike.prototype.about = "Your OS came with this game. If you don't know how to play, use those help files.";
Klondike.prototype.time = 4;
Klondike.prototype.difficulty = 2;
Klondike.prototype.skill = 5;
Klondike.prototype.successPercent = 12;

Klondike.prototype.setUp = function() {
    Game.prototype.setUp.call(this, []); 
    
    this.tableHeight = 5.4;
    this.tableWidth = 7.85;

    var deck = GameObjectFactory.createCardDeck("deck", HelpMessage.stock3);
    deck.setLocation(0.1, 0.1);
    deck.visibleSize = 1;
    
    var usedDeck = GameObjectFactory.createCardDeck("usedDeck", HelpMessage.topCard);
    usedDeck.orientation = Orientation.horizontal;
    usedDeck.setLocation(1.2, 0.1);
    usedDeck.visibleSize = 3;
    
    var deckSelectAction = GameTypeHelper.getStockAction(3);
    deckSelectAction.setTargetDeck(usedDeck);
    deck.selectAction = deckSelectAction;
    deck.selectConstraint = new SuccessConstraint();
    deck.dragFromConstraint = new FailureConstraint();
    deck.dragToConstraint = new FailureConstraint();
    usedDeck.dragFromConstraint = new TopCardConstraint();
    usedDeck.dragToConstraint = new FailureConstraint();
    this.dealer.fillDeck(deck, 1, false);
    this.dealer.shuffle(deck);
    this.table.addDeck(deck);
    this.table.addDeck(usedDeck);


    for(var i = 1; i < 5; i++) {
        stableDeck = GameObjectFactory.createCardDeck("Stable" + i, HelpMessage.foundation);
        stableDeck.dragFromConstraint = new TopCardConstraint();
        stableDeck.dragToConstraint = GameTypeHelper.getFoundationConstraint();
        stableDeck.visibleSize = 1;
        stableDeck.setLocation(i * 1.1 + 2.3, 0.1);
        this.table.addDeck(stableDeck);
    }

    for(var i = 1; i < 8; i++) {
        var workspaceDeck = GameObjectFactory.createCardDeck("Workspace" + i, HelpMessage.workspace);
        workspaceDeck.dragToConstraint = GameTypeHelper.getWorkspaceConstraint();
        workspaceDeck.dragFromConstraint = new CardVisibleConstraint();
        workspaceDeck.selectAction = new MakeTopCardVisibleAction();
        workspaceDeck.selectConstraint = new TopCardConstraint();
        workspaceDeck.visibleSize = -1;
        workspaceDeck.setLocation(0.1 + (i - 1) * 1.1, 1.3);
        this.table.addDeck(workspaceDeck);
        this.dealer.dealCards(i - 1, deck, workspaceDeck, Visibility.faceDown);
        this.dealer.dealCard(deck, workspaceDeck, Visibility.faceUp);
    }

};

Klondike.prototype.getGameStatus = function() {
    if(false) {
        return GameStatus.loss;
    }
    if(this.table.getDeck("Stable1").cards.length == 13 && this.table.getDeck("Stable2").cards.length == 13 && this.table.getDeck("Stable3").cards.length == 13 && this.table.getDeck("Stable4").cards.length == 13) {
        return GameStatus.win;
    }
    return GameStatus.indeterminate;
}

///KlondikeOneCard
function KlondikeOneCard() {
}
Utility.extend(KlondikeOneCard, Klondike);

KlondikeOneCard.prototype.friendlyName = "Solitaire (1 Card)";
KlondikeOneCard.prototype.successPercent = 20;

KlondikeOneCard.prototype.setUp = function() {
    Klondike.prototype.setUp.call(this, []); 

    var deckSelectAction = GameTypeHelper.getStockAction(1);
    deckSelectAction.setTargetDeck(this.table.getDeck("usedDeck"));
    var stock = this.table.getDeck("deck");
    stock.type = HelpMessage.stock;
    stock.selectAction = deckSelectAction;
};

//Nestor
function Nestor() {
}
Utility.extend(Nestor, Game);

Nestor.prototype.friendlyName = "Nestor";
Nestor.prototype.about = "Discard any pair of cards of the same rank, regardless of suit (for example, two Aces, two Fives, two Kings, etc.). Only the top cards are available for play. Spaces can't be filled.";
Nestor.prototype.time = 4;
Nestor.prototype.difficulty = 1;
Nestor.prototype.skill = 2;
Nestor.prototype.successPercent = 8;

Nestor.prototype.setUp = function() {
    Game.prototype.setUp.call(this, []); 
    this.tableHeight = 3.4;
    this.tableWidth = 8.9;
    var deck = GameObjectFactory.createCardDeck("deck", HelpMessage.stock);
    this.dealer.fillDeck(deck, 1, false);
    this.dealer.shuffle(deck);

    var scoreDeck = GameObjectFactory.createCardDeck("scoreDeck", HelpMessage.reference);
    scoreDeck.dragFromConstraint = new FailureConstraint();
    scoreDeck.dragToConstraint = new FailureConstraint();
    scoreDeck.selectConstraint = new FailureConstraint();
    scoreDeck.setLocation(-1000, -1000);
    scoreDeck.visibleSize = 26;
    this.table.addDeck(scoreDeck);
    for(var i = 0; i < 12; i++) {
        var tempDeck = GameTypeHelper.getNestorDeck(GameObjectFactory.createCardDeck("workspace" + i, HelpMessage.pair));
        if(i < 8)
            this.dealer.dealCards(6, deck, tempDeck, Visibility.faceUp);
        else
            this.dealer.dealCards(1, deck, tempDeck, Visibility.faceUp);
        var tempY = 0.0;
        if(parseInt(i / 8) == 0) {
            tempDeck.setLocation(1.1 * (i % 8) + 0.1, 0.1);
        } else {
            tempDeck.setLocation(1.1 * (i % 8) + 2.3, 2.1);
        }        
        this.table.addDeck(tempDeck);
    }
}

Nestor.prototype.getGameStatus = function() {
    if(this.table.getDeck("scoreDeck").cards.length == 52) {
        return GameStatus.loss;
    }
    if(false) {
        return GameStatus.win;
    }
    return GameStatus.indeterminate;
}


//TrustyTwelve
function TrustyTwelve() {
}
Utility.extend(TrustyTwelve, Game);

TrustyTwelve.prototype.friendlyName = "Trusty Twelve";
TrustyTwelve.prototype.about = "Build the decks down, regardless of suit. Clicking the face down pile will deal cards to any empty spaces. Once you've dealt all the face down cards, you win.";
TrustyTwelve.prototype.time = 4;
TrustyTwelve.prototype.difficulty = 2;
TrustyTwelve.prototype.skill = 4;
TrustyTwelve.prototype.successPercent = 60;

TrustyTwelve.prototype.setUp = function() {
    Game.prototype.setUp.call(this, []); 
    this.tableHeight = 3.7;
    this.tableWidth = 6.8;
    var deck = GameObjectFactory.createCardDeck("deck", HelpMessage.fillEmpty);
    this.dealer.fillDeck(deck, 1, false);
    this.dealer.shuffle(deck);
    deck.orientation = Orientation.horizontal;
    deck.dragToConstraint = new FailureConstraint();
    deck.dragFromConstraint = new FailureConstraint();
    deck.setLocation(0.1, 0.1);
    deck.visibleSize = 36;

    for(var i = 1; i < 13; i++) {
        var tempDeck = GameObjectFactory.createCardDeck("Workspace" + i, HelpMessage.workspaceAnySuitTopCardOnly);
        tempDeck.visibleSize = -1;
        var horizontalOffset = (i - 1) % 6;
        var verticalOffset = parseInt((i - 1) / 6);
        tempDeck.setLocation(0.1 + ((horizontalOffset) * 1.1), 1.3 + (verticalOffset * 1.2));
        tempDeck.dragFromConstraint = new TopCardConstraint();
        tempDeck.dragToConstraint = new PreviousValueLoopingConstraint();
        tempDeck.visibleSize = 2;
        this.table.addDeck(tempDeck);
        this.dealer.dealCard(deck, tempDeck, Visibility.faceUp);
    }

    var action = new AggregateAction();
    for(var j = 1; j < 13; j++) {
        var workspaceAction = new ConditionalAction();
        workspaceAction.trueAction = new DrawTopCardToDeckAction();
        workspaceAction.trueAction.setVisibility(Visibility.faceUp);
        workspaceAction.falseAction = null;
        workspaceAction.condition = new TargetDeckEmptyConstraint();
        workspaceAction.setTargetDeck(this.table.getDeck("Workspace" + j));
        action.addAction(workspaceAction);
    }
    deck.selectAction = action;

    this.table.addDeck(deck);
}

TrustyTwelve.prototype.getGameStatus = function() {
    if(this.table.getDeck("deck").cards.length == 0) {
        return GameStatus.win;
    }
    if(false) {
        return GameStatus.loss;
    }
    return GameStatus.indeterminate;
}

/*
 *  GameTypeHelper - provides convenience methods to reduce code repetition
 */
var GameTypeHelper = {
    getStockAction : function(numCardsToDraw) {
        var stockAction = new ConditionalAction();

        var deckEmptyAction = new AggregateAction();
        var moveAllAction = new MoveAllCardsFromDeckAction();
        moveAllAction.setVisibility(Visibility.faceDown);
        deckEmptyAction.addAction(moveAllAction);
        deckEmptyAction.addAction(new ReverseSourceDeckAction());

        var deckNotEmptyAction = new AggregateAction();
        for(var i = 0; i < numCardsToDraw; i++) {
            var drawAction = new DrawTopCardToDeckAction();
            drawAction.setVisibility(Visibility.faceUp);
            deckNotEmptyAction.addAction(drawAction);
            
        }
        deckNotEmptyAction.setVisibility(Visibility.faceUp);

        var condition = new SourceDeckEmptyConstraint();
        stockAction.condition = condition;
        stockAction.trueAction = deckEmptyAction;
        stockAction.falseAction = deckNotEmptyAction;
        return stockAction;
    },

    getFoundationConstraint : function() {
        var foundationConstraint = new ConditionalConstraint();
        var emptyDeckAggregate = new AggregateConstraint();
        emptyDeckAggregate.addConstraint(new SourceDeckSpecificValueConstraint(CardValue.ace));
        emptyDeckAggregate.addConstraint(new TopCardConstraint());
        var nonEmptyDeckAggregate = new AggregateConstraint();
        nonEmptyDeckAggregate.addConstraint(new TopCardConstraint());
        nonEmptyDeckAggregate.addConstraint(new SameSuitConstraint());
        nonEmptyDeckAggregate.addConstraint(new NextValueConstraint());
        var condition = new TargetDeckEmptyConstraint();
        foundationConstraint.condition = condition;
        foundationConstraint.trueConstraint = emptyDeckAggregate;
        foundationConstraint.falseConstraint = nonEmptyDeckAggregate;
        return foundationConstraint;
    },

    getWorkspaceConstraint : function() {
        var workspaceConstraint = new ConditionalConstraint();
        var emptyDeck = new SourceDeckSpecificValueConstraint(CardValue.king);
        var nonEmptyDeck = new AggregateConstraint();
        nonEmptyDeck.addConstraint(new DifferentColorConstraint());
        nonEmptyDeck.addConstraint(new PreviousValueConstraint());
        var condition = new TargetDeckEmptyConstraint();
        workspaceConstraint.condition = condition;
        workspaceConstraint.trueConstraint = emptyDeck;
        workspaceConstraint.falseConstraint = nonEmptyDeck;
        return workspaceConstraint;
    },

    getNestorDeck : function(deck) {
        deck.dragFromConstraint = new TopCardConstraint();
        deck.dragToConstraint = new SameValueConstraint();

        var action = new AggregateAction();
        var dragSelfToAction = new DrawTopCardFromDeckAction();
        action.addAction(dragSelfToAction);
        
        var dragToScoreAction = new DrawTopCardToDeckAction();
        dragToScoreAction.setVisibility(Visibility.faceUp);
        dragToScoreAction.setTargetDeck(deck.game.table.getDeck("scoreDeck"));
        action.addAction(new PreventTargetDeckActionWrapper(dragToScoreAction));

        dragToScoreAction = new DrawTopCardToDeckAction();
        dragToScoreAction.setVisibility(Visibility.faceUp);
        dragToScoreAction.setTargetDeck(deck.game.table.getDeck("scoreDeck"));
        action.addAction(new PreventTargetDeckActionWrapper(dragToScoreAction));
        
        deck.dragToAction = action;
        return deck;
    }
}
