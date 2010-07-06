var GUI = {
    availableMessagesDivId : "availableMessageList",
    
    tableDivId : "gameTable",
    tableLeft : 230,
    tableTop : 60,
    
    enableHelp : false,
    
    writeLog : function(str) {
        if(!this.logPanelDiv) {
            this.logPanelDiv = document.getElementById('logPanelDiv');
            if(!this.logPanelDiv) {
                alert("Logging Error. Message: " + str);
            }
        }
        var logDiv = document.createElement("div");
        logDiv.innerHTML = str;
        logDiv.style.padding = "2px";
        this.logPanelDiv.appendChild(logDiv);

    },
    
    changeCardBackIndex : function(idx) {
        Config.cardBackIndex = idx;
        GUI.redrawTable();
    },
    
    changeCardSetIndex : function(idx) {
        switch(idx) {
        case 0:
            GUI.changeCardSet("basic.gif", 71, 96);
            break;
        case 1:
            GUI.changeCardSet("small.gif", 43,58);
            break;
        case 2:
            GUI.changeCardSet("purty.gif", 90,120);
            break;
        case 3:
            GUI.changeCardSet("notthere.gif", 180,240);
            break;
        default:
            Utility.debug("Invalid Card Set");
            break;
        }
        GUI.redrawTable();
    },
    
    changeCardSet : function(url, width, height) {
        Config.cardImage = url;
        Config.cardFullWidth = width;
        Config.cardCoveredWidth = parseInt(width / 6);
        Config.cardFullHeight = height;
        Config.cardCoveredHeight = parseInt(height / 6);

        GUI.redrawTable(true);
    },
    
    changeTableColor : function(color) {
        Config.tableColor = color;
        var div = document.getElementById(GUI.tableDivId);
        if(div) {
            div.style.backgroundColor = color;   
        }
    },
    
    colorize : function(e, b, t) {
        e.style.backgroundColor = b;
        e.style.color = t;
    },
    
    renderAvailableMessages : function() {
        var game = GameObjectFactory.currentGame;
        if(game) {
            var msgs = game.availableMessages;
            var messagesDiv = document.getElementById(GUI.availableMessagesDivId);
            messagesDiv.innerHTML = "";
            for(var i = 0; i < msgs.length; i++) {
                var div = document.createElement("span");
                var label = (typeof MessageTypeLabel[msgs[i]]) != "undefined" ? MessageTypeLabel[msgs[i]] : msgs[i]
                div.innerHTML = "&nbsp;&nbsp;&nbsp;<a class='LinkButton' href='' onclick=\"Utility.processMessage('" + msgs[i] + "');return false;\">" + label + "</a>"
                messagesDiv.appendChild(div);
            }
        }
    },
    
    clearAvailableMessages : function() {
        var messagesDiv = document.getElementById(GUI.availableMessagesDivId);
        messagesDiv.innerHTML = "";
    },
    
    showHelp : function(deckName) {
        if(GUI.enableHelp) {
            if(deckName == "selection" || DragDropSupport.activeDeck != null) {
                document.getElementById("helpMessage").style.display="none";
            } else {
                var game = GameObjectFactory.currentGame;
                if(game) {
                    var helpMessageDiv = document.getElementById("helpMessage");
                    if(helpMessageDiv == null) {
                        helpMessageDiv = document.createElement("div");
                        helpMessageDiv.id = "helpMessage";
                        helpMessageDiv.style.position="absolute";
                        helpMessageDiv.style.zIndex = 500004;
                        helpMessageDiv.className = "HelpMessage";
                        
                        helpMessageDiv.style.display = "none";
                        helpMessageDiv.innerHTML = "&nbsp;";
                        document.body.appendChild(helpMessageDiv);
                    }
                    var deck = game.table.decks[deckName];
                    helpMessageDiv.style.top = parseInt(deck.div.style.top) + parseInt(deck.div.style.height) + GUI.tableTop + 5 + "px";
                    helpMessageDiv.style.left = parseInt(deck.div.style.left) + GUI.tableLeft + "px";
                    
                    helpMessageDiv.innerHTML = GUI.getHelpMessage(deck);
                    helpMessageDiv.style.display="block";
                } else {
                    this.display(Panels.welcome);
                }
            }
        }
    },
    
    getHelpMessage : function(deck) {
        var ret = deck.helpMessage;
        if(ret == null) {
            ret = "No Help Message (" + deck.deckName + ")";
        }
        return ret;
    },
    
    setGameName : function(gameName) {
        document.getElementById('gameNameDiv').innerHTML = gameName;
    },

    setAbout : function(about) {
        document.getElementById('aboutDiv').innerHTML = about;
    },

    showOptions : function() {
        this.display(Panels.options);
    },

    showSelectGame : function(selectedGame) {
        if(selectedGame) {
            Config.selectedGame = selectedGame;
        } else if (Config.selectedGame != null && Config.selectedGame.length) {
            selectedGame= Config.selectedGame;
        } else {
            selectedGame = "Klondike";
        }
        Utility.persistPreferences();
        this.display(Panels.selectGame);
		for(var i = 0; i < GameTypes.length; i++) {
			var menuDiv = document.getElementById("mouseover" + GameTypes[i]);
			if(menuDiv == null) {
				menuDiv = document.createElement("div");
				menuDiv.id = "mouseover" + GameTypes[i];
				menuDiv.className = "GameListItem";
				menuDiv.style.padding="5px";
				menuDiv.onmousedown = new Function("GUI.showSelectGame('" + GameTypes[i] + "');return false;");
				menuDiv.innerHTML = eval(GameTypes[i]).prototype.friendlyName;
				document.getElementById("gameList").appendChild(menuDiv);
			}
			menuDiv.style.backgroundColor = (GameTypes[i] == selectedGame ? "#ffffff" : "#fff89d") ;
			menuDiv.style.borderRight = (GameTypes[i] == selectedGame ? "0px" : "#003A00 1px solid") ;
			menuDiv.style.borderTop = (GameTypes[i] == selectedGame ? "#003A00 1px solid" : "0px") ;
			menuDiv.style.borderBottom = (GameTypes[i] == selectedGame ? "#003A00 1px solid" : "0px") ;
		}
		
		var gameClass = eval(selectedGame).prototype;
        document.getElementById("gameDescriptionName").innerHTML = GUI.getLineGraph(gameClass.friendlyName*10);
        document.getElementById("gameDescriptionTime").innerHTML = GUI.getLineGraph(gameClass.time*10);
        document.getElementById("gameDescriptionDifficulty").innerHTML = GUI.getLineGraph(gameClass.difficulty*10);
        document.getElementById("gameDescriptionSkill").innerHTML = GUI.getLineGraph(gameClass.skill*10);
        document.getElementById("gameDescriptionSuccessPercent").innerHTML = GUI.getLineGraph(gameClass.successPercent);
    },
    
    getLineGraph : function(num) {
        var ret = "<font color='red'>";
        for(var i = 1; i < 101; i += 10) {
            if(i < num) {
                ret += "&diams;";
            }
        } 
        ret += "</font>";
        return ret;
    },
    
    doWin : function() {
        this.dialog("Winner!", "Congratulations - you have won the hand. You rule so much it hurts. Do you even realize how close to divine you have come with this victory? My god your hair smells good today. I love you. Run away with me, and we'll live in a small house by the sea, like you've always wanted. But first... Play Again?.");
    },

    doLoss : function() {
        this.dialog("Big Fat Loser!", "Your pathetic performance is only a sad reminder of the lonely, purposeless life that you ineptly struggle through, leaving no lasting impression on those you meet. Your weakness is repugnant. Play again?");
    },
    
    dialog : function(title, text)  {
        document.getElementById("dialogPanelTitle").innerHTML = title;
        document.getElementById("dialogPanelBody").innerHTML = text;
        this.display(Panels.dialog);
        if(GameObjectFactory.currentGame) {
            GameObjectFactory.currentGame.setAvailableMessages(["RESTART"]);
        }
    },

    display : function(panel) {
        this.hidePanels();
        this.disableTable();
        this.clearAvailableMessages();
        var table = document.getElementById(GUI.tableDivId);
        var div = document.getElementById(panel);
        div.style.display="block";        
    },
    
    resizeTable : function() {
        var tableWidth = parseInt(document.getElementById(GUI.tableDivId).style.width);
        var tableHeight = parseInt(document.getElementById(GUI.tableDivId).style.height);
        document.getElementById("headerDiv").style.width = tableWidth + 230 + "px";
        document.getElementById("footerDiv").style.width = tableWidth + 230 + "px";
        document.getElementById("menuDiv").style.width = tableWidth + "px";
        document.getElementById("panelContainer").style.width = tableWidth + "px";
        document.getElementById("panelContainer").style.height = tableHeight + "px";
        document.getElementById("leftColumnDiv").style.height = tableHeight + 30 + "px";
        if(tableHeight < 260) {
            document.getElementById("leftColOverflow").style.display = "none";
        } else {
            document.getElementById("leftColOverflow").style.display = "block";
            document.getElementById("logPanelDiv").style.height = tableHeight - 260 - 22 + "px";
            document.getElementById("leftColOverflow").style.height = tableHeight - 260 + "px";
        }

        document.getElementById("menuDiv").style.top = tableHeight + 60 + "px";
        document.getElementById("footerDiv").style.top = tableHeight + 90 + "px";
        
    },

    redrawTable : function(resized) {
        var game = GameObjectFactory.currentGame;
        if(game) {
            if(resized) {
                game.table.resize(game.tableHeight, game.tableWidth);
            }
            for(var deckName in game.table.decks) {
                var deck = game.table.decks[deckName];
                deck.update();
            }
        }
    },

    enableTable : function() {
        this.hidePanels();
        this.renderAvailableMessages();
        var game = GameObjectFactory.currentGame;
        if(game) {
            var screenDiv = document.getElementById("panelContainer");
            if(screenDiv) {
                screenDiv.style.display="none";
            }
            GUI.redrawTable();
        }
    },
    
    disableTable : function() {
        var game = GameObjectFactory.currentGame;
        if(game) {
            DragDropSupport.reset();
            var helpDiv = document.getElementById("helpMessage");
            if(helpDiv != null) {
                
            }
            var screenDiv = document.getElementById("panelContainer");
            if(screenDiv) {
                screenDiv.style.display="block";
            }
        }
    },
    
    hidePanels : function() {
        for(var panelName in Panels) {
            var div = document.getElementById(Panels[panelName]);
            div.style.display = "none";
        }
    }
    
}

var DragDropSupport = {

    leftMousePressed : false,
    hasMouseMoved : false,
    cardIndex : null,

    mouseDownX : null,
    mouseDownY : null,

    selectionDeckOffsetX : null,
    selectionDeckOffsetY : null,

    activeDeck : null,
    
    reset : function() {
            document.onmousemove = null;
            document.onmouseup = null;
            DragDropSupport.activeDeck = null;
            DragDropSupport.leftMousePressed = false;
            DragDropSupport.hasMouseMoved = false;
            //do not clear cardIndex. Need for doubleclick.
    },
    
    mouseDown : function(e) {
        e = Utility.normalizeEvent(e);
        if(DragDropSupport.activeDeck) {
            DragDropSupport.activeDeck.onDragCancel();
            DragDropSupport.reset();
        }
        if(e.button == 0 || e.button == 1) {
            var deckX = parseInt(this.style.left, 10) + e.layerX;
            var deckY = parseInt(this.style.top, 10) + e.layerY;
            var cardIndex = this.deck.getCardAtPoint(deckX, deckY);
            
            DragDropSupport.leftMousePressed = true;
            DragDropSupport.hasMouseMoved = false;
            DragDropSupport.activeDeck = this.deck;
            
            var mouseCardOffset = cardIndex;
            if(this.deck.visibleSize != -1 && cardIndex > this.deck.visibleSize - 1) {
                mouseCardOffset = this.deck.visibleSize - 1;
            }
            
            if(this.deck.orientation == Orientation.vertical) {
                DragDropSupport.selectionDeckOffsetX = deckX;
                DragDropSupport.selectionDeckOffsetY = deckY - (mouseCardOffset * Config.cardCoveredHeight);
            } else {
                DragDropSupport.selectionDeckOffsetX = deckX - (mouseCardOffset * Config.cardCoveredWidth);
                DragDropSupport.selectionDeckOffsetY = deckY;
            }
            DragDropSupport.mouseDownX = e.clientX;
            DragDropSupport.mouseDownY = e.clientY;

            DragDropSupport.cardIndex = cardIndex;
            
            document.onmousemove = DragDropSupport.mouseMove;
            document.onmouseup = DragDropSupport.mouseUp;
        }
        return false;

    },

    mouseMove : function(e) {
        e = Utility.normalizeEvent(e);
        if(DragDropSupport.leftMousePressed) {
            if(DragDropSupport.hasMouseMoved) {
                var div = DragDropSupport.activeDeck.game.selectionDeck.div
                var left = (e.clientX + parseInt(document.body.scrollLeft)) - GUI.tableLeft - DragDropSupport.selectionDeckOffsetX;
                var top = (e.clientY + parseInt(document.body.scrollTop)) - GUI.tableTop - DragDropSupport.selectionDeckOffsetY;
                
                var table = DragDropSupport.activeDeck.game.table.div;
                
                if(top < 0) {
                    top = 0;
                } else if((top + parseInt(div.style.height)) > parseInt(table.style.height)) {
                    top = parseInt(table.style.height) - parseInt(div.style.height);
                }
                
                if(left < 0) {
                    left = 0;
                }else if((left + parseInt(div.style.width)) > parseInt(table.style.width)) {
                    left = parseInt(table.style.width) - parseInt(div.style.width);
                }
                
                div.style.left = left;
                div.style.top = top;
            } else {
                var xDelta = (e.clientX - DragDropSupport.mouseDownX > 0) ? e.clientX - DragDropSupport.mouseDownX : -(e.clientX - DragDropSupport.mouseDownX);
                var yDelta = (e.clientY - DragDropSupport.mouseDownY > 0) ? e.clientY - DragDropSupport.mouseDownY : -(e.clientY - DragDropSupport.mouseDownY);
                
                if(xDelta > Config.mouseDragSensitivity || yDelta > Config.mouseDragSensitivity) {
                    DragDropSupport.hasMouseMoved = true;

                    if(DragDropSupport.activeDeck.onDragFrom(DragDropSupport.cardIndex)) {
                        DragDropSupport.mouseMove(e);
                    } else {
                        DragDropSupport.activeDeck.game.selectionDeck.setLocation(-1000,-1000);
                        DragDropSupport.reset();
                    }
                }
            }

        }
        return false;
    },

    mouseUp : function(e) {
        e = Utility.normalizeEvent(e);
        if(DragDropSupport.leftMousePressed) {
            if(!DragDropSupport.hasMouseMoved) {
                if(DragDropSupport.activeDeck.onSelect(DragDropSupport.cardIndex)) {
                    
                } else {
                    
                }
            } else {
                var decks = DragDropSupport.getDecks();
                var dragToSuccess = false;
                for(var targetDeck in decks) {
                    if((decks[targetDeck] != DragDropSupport.activeDeck && decks[targetDeck].onDragTo())) {
                        dragToSuccess = true;
                        break;
                    }
                }
                if(!dragToSuccess) {
                    DragDropSupport.activeDeck.onDragCancel();
                }
            }
        }
        if(DragDropSupport.activeDeck) {
            DragDropSupport.activeDeck.game.selectionDeck.setLocation(-1000,-1000);
        }
        DragDropSupport.reset();
        return false;
    },
    
    doubleClick : function() {
        if(!this.deck.onSelect(DragDropSupport.cardIndex)) {
            this.deck.dragToAny();
        }
    },
    
    mouseOver : function() {
        GUI.showHelp(this.id.substring(9));
    },
    
    mouseOut : function() {
        if(GUI.enableHelp) {
            document.getElementById("helpMessage").style.display="none";
        }
    },
    
    getDecks : function() {
        var table = DragDropSupport.activeDeck.game.table;
        var selDiv = DragDropSupport.activeDeck.game.selectionDeck.div;
        var deckMap = new Object();
        var ret = new Array();

        var l = parseInt(selDiv.style.left);
        var r = l + Config.cardFullWidth;
        var t = parseInt(selDiv.style.top);
        var b = t + Config.cardFullHeight;
        var x = l + DragDropSupport.selectionDeckOffsetX;
        var y = t + DragDropSupport.selectionDeckOffsetY;

        for(var deckName in table.decks) {
            var deck = table.decks[deckName];
            if(deck.deckName != "selection") {
            
                var vertOffset = 0;
                if(deck.orientation == Orientation.vertical) {
                    if(deck.visibleSize == -1 || deck.cards.length < deck.visibleSize) {
                        vertOffset = deck.cards.length - 1;
                    } else {
                        vertOffset = deck.visibleSize - 1;
                    }
                }
                vertOffset *= Config.cardCoveredHeight;
                
                var horizOffset = 0;
                if(deck.orientation == Orientation.horizontal) {
                    if(deck.visibleSize == -1 || deck.cards.length < deck.visibleSize) {
                        horizOffset = deck.cards.length - 1;
                    } else {
                        horizOffset = deck.visibleSize - 1;
                    }
                }
                horizOffset *= Config.cardCoveredWidth;
                                
                var dd = deck.div;
                var dl = parseInt(dd.style.left) + horizOffset;
                var dr = dl + Config.cardFullWidth;
                var dt = parseInt(dd.style.top) + vertOffset;
                var db = dt + Config.cardFullHeight;
                
                //mouse pointer
                if(deckMap["mp"] == null && x > dl && x < dr && y > dt && y < db) {
                    deckMap["mp"] = deck;
                }
                
                //upper left
                if(deckMap["ul"] == null && l > dl && l < dr && t > dt && t < db) {
                    deckMap["ul"] = deck;
                }
                
                //upper right
                if(deckMap["ur"] == null && r > dl && r < dr && t > dt && t < db) {
                    deckMap["ur"] = deck;
                }
                
                //lowerleft
                if(deckMap["ll"] == null && l > dl && l < dr && b > dt && b < db) {
                    deckMap["ll"] = deck;
                }
                
                //lower right
                if(deckMap["lr"] == null && r > dl && r < dr && b > dt && b < db) {
                    deckMap["lr"] = deck;
                }
            }
        }

        if(deckMap["mp"] != null) { ret.push(deckMap["mp"]); }
        if(deckMap["ul"] != null) { ret.push(deckMap["ul"]); }
        if(deckMap["ur"] != null) { ret.push(deckMap["ur"]); }
        if(deckMap["ll"] != null) { ret.push(deckMap["ll"]); }
        if(deckMap["lr"] != null) { ret.push(deckMap["lr"]); }
        
        return ret;
    }
};

var Panels = {
    welcome : "panelWelcome",
    selectGame : "panelSelectGame",
    dialog : "panelDialog",
    options : "panelOptions"
}
