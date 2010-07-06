
/*
 *  AggregateConstraint returns true only when all child Constraints return true.
 */
function AggregateConstraint() {
    this.constraints = new Array();
}
Utility.extend(AggregateConstraint, Constraint);

AggregateConstraint.prototype.addConstraint = function(constraint) {
    this.constraints.push(constraint);
}

AggregateConstraint.prototype.check = function(sourceDeck, targetDeck, cardIndex) {
    for(var i = 0; i < this.constraints.length; i++) {
        var constraint = this.constraints[i];
        if(!constraint.check(sourceDeck, targetDeck, cardIndex))
            return false;
    }

    return true;
};

/*
 *  CardVisibleConstraint
 */
function CardVisibleConstraint() {

}
Utility.extend(CardVisibleConstraint, Constraint);

CardVisibleConstraint.prototype.check = function(sourceDeck, targetDeck, cardIndex) {
    if(sourceDeck.cards.length == 0) {
        return false;
    } else {
        return sourceDeck.peekCard(cardIndex).visibility == Visibility.faceUp; 
    }
};

/*
 *  ConditionalConstraint checks one of two constraints based on the reult of "condition".
 */
function ConditionalConstraint() {
    this.condition = null;
    this.trueConstraint = null;
    this.falseConstraint = null;
}
Utility.extend(ConditionalConstraint, Constraint);

ConditionalConstraint.prototype.check = function(sourceDeck, targetDeck, cardIndex) {
    if(this.condition.check(sourceDeck, targetDeck, cardIndex)) {
        return this.trueConstraint.check(sourceDeck, targetDeck, cardIndex);
    } else {
        return this.falseConstraint.check(sourceDeck, targetDeck, cardIndex);
    } 
};

/*
 *  DifferentColorConstraint.
 */
function DifferentColorConstraint() {

}
Utility.extend(DifferentColorConstraint, Constraint);

DifferentColorConstraint.prototype.check = function(sourceDeck, targetDeck, cardIndex) {
    if(sourceDeck.cards.length == 0 || targetDeck.cards.length == 0) {
        return false;
    }
    return sourceDeck.peekCard(sourceDeck.selectedCardIndex).getColor() != targetDeck.peekTopCard().getColor();    
};

/*
 *  FailureConstraint always returns false.
 */
function FailureConstraint() {

}
Utility.extend(FailureConstraint, Constraint);

FailureConstraint.prototype.check = function(sourceDeck, targetDeck, cardIndex) {
    return false;    
};

/*
 *  NextValueConstraint always returns false.
 */
function NextValueConstraint() {

}
Utility.extend(NextValueConstraint, Constraint);

NextValueConstraint.prototype.check = function(sourceDeck, targetDeck, cardIndex) {
    if(sourceDeck.cards.length == 0 || targetDeck.cards.length == 0) {
        return false;
    }
    return sourceDeck.peekCard(sourceDeck.selectedCardIndex).cardValue == targetDeck.peekTopCard().cardValue + 1;   
};

/*
 *  PreviousValueConstraint.
 */
function PreviousValueConstraint() {

}
Utility.extend(PreviousValueConstraint, Constraint);

PreviousValueConstraint.prototype.check = function(sourceDeck, targetDeck, cardIndex) {
    if(sourceDeck.cards.length == 0 || targetDeck.cards.length == 0) {
        return false;
    }
    return sourceDeck.peekCard(sourceDeck.selectedCardIndex).cardValue == targetDeck.peekTopCard().cardValue - 1;  
};

/*
 *  PreviousValueConstraint.
 */
function PreviousValueLoopingConstraint() {

}
Utility.extend(PreviousValueLoopingConstraint, Constraint);

PreviousValueLoopingConstraint.prototype.check = function(sourceDeck, targetDeck, cardIndex) {
    if(sourceDeck.cards.length == 0 || targetDeck.cards.length == 0) {
        return false;
    }
    return sourceDeck.peekCard(sourceDeck.selectedCardIndex).cardValue == targetDeck.peekTopCard().cardValue - 1 || sourceDeck.peekCard(sourceDeck.selectedCardIndex).cardValue == CardValue.king && targetDeck.peekTopCard().cardValue == CardValue.ace;
};

/*
 *  SameSuitConstraint
 */
function SameSuitConstraint() {

}
Utility.extend(SameSuitConstraint, Constraint);

SameSuitConstraint.prototype.check = function(sourceDeck, targetDeck, cardIndex) {
    if(sourceDeck.cards.length == 0 || targetDeck.cards.length == 0) {
        return false;
    }
    return sourceDeck.peekCard(cardIndex).suit == targetDeck.peekTopCard().suit;   
};

/*
 *  SameValueConstraint
 */
function SameValueConstraint() {

}
Utility.extend(SameValueConstraint, Constraint);

SameValueConstraint.prototype.check = function(sourceDeck, targetDeck, cardIndex) {
    if(sourceDeck.cards.length == 0 || targetDeck.cards.length == 0) {
        return false;
    }
    return sourceDeck.peekCard(cardIndex).cardValue == targetDeck.peekTopCard().cardValue;   
};

/*
 *  SourceDeckEmptyConstraint.
 */
function SourceDeckEmptyConstraint() {

}
Utility.extend(SourceDeckEmptyConstraint, Constraint);

SourceDeckEmptyConstraint.prototype.check = function(sourceDeck, targetDeck, cardIndex) {
    return sourceDeck.cards.length == 0;
};

/*
 *  SourceDeckSpecificValueConstraint returns true when the card of sourceDeck's value is equal to cardValue.
 */
function SourceDeckSpecificValueConstraint(cardValue) {
    if(cardValue == null) {
        this.cardValue = CardValue.ace;
    } else {
        this.cardValue = cardValue;
    }
}
Utility.extend(SourceDeckSpecificValueConstraint, Constraint);

SourceDeckSpecificValueConstraint.prototype.check = function(sourceDeck, targetDeck, cardIndex) {
    return sourceDeck.peekCard(cardIndex).cardValue == this.cardValue;
};

/*
 *  SuccessConstraint always returns true.
 */
function SuccessConstraint() {

}
Utility.extend(SuccessConstraint, Constraint);

SuccessConstraint.prototype.check = function(sourceDeck, targetDeck, cardIndex) {
    return true;    
};

/*
 *  TargetDeckEmptyConstraint always returns false.
 */
function TargetDeckEmptyConstraint() {

}
Utility.extend(TargetDeckEmptyConstraint, Constraint);

TargetDeckEmptyConstraint.prototype.check = function(sourceDeck, targetDeck, cardIndex) {
    return targetDeck.cards.length == 0;   
};

/*
 *  TopCardConstraint returns true when the top card is selected.
 */
function TopCardConstraint() {

}
Utility.extend(TopCardConstraint, Constraint);

TopCardConstraint.prototype.check = function(sourceDeck, targetDeck, cardIndex) {
    if(sourceDeck.cards.length == 0) {
        return false;
    }
    return cardIndex == sourceDeck.cards.length - 1;  
};

/*
 *  ValueOffByOneConstraint returns true when the absolute difference between card values is 1.
 */
function ValueOffByOneConstraint() {

}
Utility.extend(ValueOffByOneConstraint, Constraint);

ValueOffByOneConstraint.prototype.check = function(sourceDeck, targetDeck, cardIndex) {
    if(sourceDeck.cards.length == 0 || targetDeck.cards.length == 0) {
        return false;
    }
    var sourceVal = sourceDeck.peekTopCard().cardValue;
    var targetVal = targetDeck.peekTopCard().cardValue;
    return (sourceVal == targetVal - 1 || sourceVal == targetVal + 1);    
};
