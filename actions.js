/**
 *  Actions.js
 *  
 *  This file defines specific actions.
 *
 */


/*
 * AggregateAction
 */
function AggregateAction() {
    this.actions = new Array()
    this.performedActions = new Array()
}
Utility.extend(AggregateAction, Action);

AggregateAction.prototype.addAction = function(action) {
    this.actions.push(action);
}

AggregateAction.prototype.setSourceDeck = function(sourceDeck) {
    this.sourceDeck = sourceDeck;
    for(var i = 0; i < this.actions.length; i++) {
        var action = this.actions[i];
        action.setSourceDeck(sourceDeck);
    }
}

AggregateAction.prototype.setTargetDeck = function(targetDeck) {
    this.targetDeck = targetDeck;
    for(var i = 0; i < this.actions.length; i++) {
        var action = this.actions[i];
        action.setTargetDeck(targetDeck);
    }
}

AggregateAction.prototype.setVisibility = function(visibility) {
    this.visibility = visibility;
    for(var i = 0; i < this.actions.length; i++) {
        var action = this.actions[i];
        action.setVisibility(visibility);
    }
}

AggregateAction.prototype.setCardIndex = function(cardIndex) {
    this.cardIndex = cardIndex;
    for(var i = 0; i < this.actions.length; i++) {
        var action = this.actions[i];
        action.setCardIndex(cardIndex);
    }
}

AggregateAction.prototype.perform = function() {
    this.performedActions = new Array();
    for(var i = 0; i < this.actions.length; i++) {
        var action = this.actions[i];
        if(action.perform()) {
            this.performedActions.push(action);
        }
    }
    return this.performedActions.length > 0;
}


AggregateAction.prototype.clone = function() {
    var newAction = new AggregateAction();
    this.copyBaseActionParameters(newAction);
    for(var i = 0; i < this.actions.length; i++) {
        var action = this.actions[i];
        newAction.addAction(action.clone());
    }
    newAction.performedActions = this.performedActions.slice(0);
    return newAction;
}

AggregateAction.prototype.undo = function() {
    for(var i = this.performedActions.length; i > 0; i--) {
        var action = this.performedActions[i-1]; 
        action.undo();
    }
}

/*
 *  ConditionalAction
 *
 */
function ConditionalAction() {
    this.trueAction = null;
    this.falseAction = null;
    this.condition = null;
    
    this.conditionResult = null;
}
Utility.extend(ConditionalAction, Action);

ConditionalAction.prototype.setSourceDeck = function(sourceDeck) {
    this.sourceDeck = sourceDeck;
    if(this.trueAction != null) {
        this.trueAction.setSourceDeck(sourceDeck);
    }
    if(this.falseAction != null) {
        this.falseAction.setSourceDeck(sourceDeck);
    }
}

ConditionalAction.prototype.setTargetDeck = function(targetDeck) {
    this.targetDeck = targetDeck;
    if(this.trueAction != null) {
        this.trueAction.setTargetDeck(targetDeck);
    }
    if(this.falseAction != null) {
        this.falseAction.setTargetDeck(targetDeck);
    }
}

ConditionalAction.prototype.setVisibility = function(visibility) {
    this.visibility = visibility;
    if(this.trueAction != null) {
        this.trueAction.setVisibility(visibility);
    }
    if(this.falseAction != null) {
        this.falseAction.setVisibility(visibility);
    }
}

ConditionalAction.prototype.setCardIndex = function(cardIndex) {
    this.cardIndex = cardIndex;
    if(this.trueAction != null) {
        this.trueAction.setCardIndex(cardIndex);
    }
    if(this.falseAction != null) {
        this.falseAction.setCardIndex(cardIndex);
    }
}

ConditionalAction.prototype.perform = function() {
    if(this.condition.check(this.sourceDeck, this.targetDeck, this.cardIndex)) {
        if(this.trueAction == null) {
            return false;
        }
        this.usedAction = true;
        return this.trueAction.perform();
    } else {
        if(this.falseAction == null) {
            return false;
        }
        this.usedAction = false;
        return this.falseAction.perform();
    }
}

ConditionalAction.prototype.clone = function() {
    var newAction = new ConditionalAction();
    this.copyBaseActionParameters(newAction);
    newAction.usedAction = this.usedAction;
    newAction.condition = this.condition;
    if(this.trueAction != null) {
        newAction.trueAction = this.trueAction.clone();
    }
    if(this.falseAction != null) {
        newAction.falseAction = this.falseAction.clone();
    }
    return newAction;
}

ConditionalAction.prototype.undo = function() {
    if(this.usedAction) {
        this.trueAction.undo();
    } else {
        this.falseAction.undo();
    }
}

/*
 *  DrawSelectedCardsToDeckAction
 *    SourceDeck - Deck to draw cards from
 *    TargetDeck - Deck to draw cards to
 *    CardIndex  - (cards.length - CardIndex) = Number of cards to draw
 */
function DrawSelectedCardsToDeckAction() {
    this.numCardsMoved = 0;
    this.originalVisibility = null;
}
Utility.extend(DrawSelectedCardsToDeckAction, Action);

DrawSelectedCardsToDeckAction.prototype.perform = function() {
    this.numCardsMoved = this.sourceDeck.cards.length - this.cardIndex;
    this.originalVisibility = this.sourceDeck.peekTopCard().visibility;
    this.sourceDeck.game.dealer.dealCards(this.numCardsMoved, this.sourceDeck, this.targetDeck, this.visibility);
    return true;
}

DrawSelectedCardsToDeckAction.prototype.clone = function() {
    var newAction = new DrawSelectedCardsToDeckAction();
    this.copyBaseActionParameters(newAction);
    newAction.originalVisibility = this.originalVisibility;
    newAction.numCardsMoved = this.numCardsMoved;
    return newAction;
}

DrawSelectedCardsToDeckAction.prototype.undo = function() {
    this.sourceDeck.game.dealer.dealCards(this.numCardsMoved, this.targetDeck, this.sourceDeck, this.originalVisibility);
}

/*
 *  DrawTopCardFromDeckAction
 *    SourceDeck - 
 *    TargetDeck - 
 *    CardIndex  - 
 */
function DrawTopCardFromDeckAction() {
    this.originalVisibility = null;
}
Utility.extend(DrawTopCardFromDeckAction, Action);

DrawTopCardFromDeckAction.prototype.perform = function() {
    if(this.targetDeck.cards.length > 0) {
        this.originalVisibility = this.targetDeck.peekTopCard().visibility;
        this.sourceDeck.game.dealer.dealCard(this.targetDeck, this.sourceDeck, this.visibility);
        return true;
    } else {
        return false;
    }
}

DrawTopCardFromDeckAction.prototype.clone = function() {
    var newAction = new DrawTopCardToDeckAction();
    this.copyBaseActionParameters(newAction);
    newAction.originalVisibility = this.originalVisibility;
    return newAction;
}

DrawTopCardFromDeckAction.prototype.undo = function() {
    this.sourceDeck.game.dealer.dealCard(this.sourceDeck, this.targetDeck, this.originalVisibility);
}

/*
 *  DrawTopCardToDeckAction
 *    SourceDeck - 
 *    TargetDeck - 
 *    CardIndex  - 
 */
function DrawTopCardToDeckAction() {
    this.originalVisibility = null;
}
Utility.extend(DrawTopCardToDeckAction, Action);

DrawTopCardToDeckAction.prototype.perform = function() {
    if(this.sourceDeck.cards.length > 0) {
        this.originalVisibility = this.sourceDeck.peekTopCard().visibility;
        this.sourceDeck.game.dealer.dealCard(this.sourceDeck, this.targetDeck, this.visibility);
        return true;
    } else {
        return false;
    }
}

DrawTopCardToDeckAction.prototype.clone = function() {
    var newAction = new DrawTopCardToDeckAction();
    this.copyBaseActionParameters(newAction);
    newAction.originalVisibility = this.originalVisibility;
    return newAction;
}

DrawTopCardToDeckAction.prototype.undo = function() {
    this.sourceDeck.game.dealer.dealCard(this.targetDeck, this.sourceDeck, this.originalVisibility);
}

/*
 *  MakeTopCardVisibleAction
 *    SourceDeck - 
 *    TargetDeck - 
 *    CardIndex  - 
 */
function MakeTopCardVisibleAction() {
    this.originalVisibility = null;
}
Utility.extend(MakeTopCardVisibleAction, Action);

MakeTopCardVisibleAction.prototype.perform = function() {
    if(this.sourceDeck.cards.length > 0 && this.sourceDeck.peekTopCard().visibility != Visibility.faceUp) {
        originalVisibility = this.sourceDeck.peekTopCard().visibility;
        this.sourceDeck.peekTopCard().visibility = Visibility.faceUp;
        this.sourceDeck.update();
        return true;
    } else {
        return false;
    }
}

MakeTopCardVisibleAction.prototype.clone = function() {
    var newAction = new MakeTopCardVisibleAction();
    this.copyBaseActionParameters(newAction);
    newAction.originalVisibility = this.originalVisibility;
    return newAction;
}

MakeTopCardVisibleAction.prototype.undo = function() {
    this.sourceDeck.peekTopCard().visibility = originalVisibility;
    this.sourceDeck.update();
}

/*
 *  MoveAllCardsFromDeckAction
 *    SourceDeck - Deck to draw cards to
 *    TargetDeck - Deck to draw cards from
 *    CardIndex  - unused
 */
function MoveAllCardsFromDeckAction() {
    this.numCardsMoved = 0;
    this.originalVisibility = Visibility.preserveVisibility;
}
Utility.extend(MoveAllCardsFromDeckAction, Action);

MoveAllCardsFromDeckAction.prototype.perform = function() {
    this.originalVisibility = this.targetDeck.peekTopCard().visibility;
    this.numCardsMoved = this.targetDeck.cards.length;
    this.sourceDeck.game.dealer.dealCards(this.targetDeck.cards.length, this.targetDeck, this.sourceDeck, this.visibility);
    return this.sourceDeck.cards.length > 0;
}

MoveAllCardsFromDeckAction.prototype.clone = function() {
    var newAction = new MoveAllCardsFromDeckAction();
    this.copyBaseActionParameters(newAction);
    newAction.originalVisibility = this.originalVisibility;
    newAction.numCardsMoved = this.numCardsMoved;
    return newAction;
}

MoveAllCardsFromDeckAction.prototype.undo = function() {
    this.sourceDeck.game.dealer.dealCards(this.numCardsMoved, this.sourceDeck, this.targetDeck, this.originalVisibility);
}

/*
 *  PreventTargetDeckActionWrapper - Prevent assignment of targetDeck to nested action.
 *    SourceDeck - 
 *    TargetDeck - 
 *    CardIndex  - 
 */
function PreventTargetDeckActionWrapper(action) {
    this.action = action;
}
Utility.extend(PreventTargetDeckActionWrapper, Action);

PreventTargetDeckActionWrapper.prototype.setSourceDeck = function(sourceDeck) {
    this.sourceDeck = sourceDeck;
    this.action.setSourceDeck(sourceDeck);
}

PreventTargetDeckActionWrapper.prototype.setTargetDeck = function(targetDeck) {
    this.targetDeck = targetDeck;
    // DO NOT action.setTargetDeck(targetDeck);
}

PreventTargetDeckActionWrapper.prototype.setVisibility = function(visibility) {
    this.visibility = visibility;
    this.action.setVisibility(visibility);
}

PreventTargetDeckActionWrapper.prototype.setCardIndex = function(cardIndex) {
    this.cardIndex = cardIndex;
    this.action.setCardIndex(cardIndex);
}

PreventTargetDeckActionWrapper.prototype.perform = function() {
    return this.action.perform();
}

PreventTargetDeckActionWrapper.prototype.clone = function() {
    var newAction = new PreventTargetDeckActionWrapper(this.action.clone());
    this.copyBaseActionParameters(newAction);
    return newAction;
}

PreventTargetDeckActionWrapper.prototype.undo = function() {
    return this.action.undo();    
}

/*
 *  ReverseSourceDeckAction
 *    SourceDeck - deck to reverse
 *    TargetDeck - not used
 *    CardIndex  - not used
 */
function ReverseSourceDeckAction() {

}
Utility.extend(ReverseSourceDeckAction, Action);

ReverseSourceDeckAction.prototype.perform = function() {
    this.sourceDeck.reverseCards();
    return this.sourceDeck.cards.length > 0;
}

ReverseSourceDeckAction.prototype.clone = function() {
    var newAction = new ReverseSourceDeckAction();
    this.copyBaseActionParameters(newAction);
    return newAction;
}

ReverseSourceDeckAction.prototype.undo = function() {
    this.sourceDeck.reverseCards();
}

/*
 *  XAction - provided as a template to create new actions
 *    SourceDeck - 
 *    TargetDeck - 
 *    CardIndex  - 
 */
function XAction() {

}
Utility.extend(XAction, Action);

XAction.prototype.perform = function() {

}

XAction.prototype.clone = function() {
    var newAction = new XAction();
    this.copyBaseActionParameters(newAction);
    return newAction;
}

XAction.prototype.undo = function() {
    
}
