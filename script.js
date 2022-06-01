$( document ).ready(
    function() {
        // GLOBAL

        let deck;

        let cardsCounter;

        let scoreJ1 = 0;

        let scoreJ2 = 0;


        // EVENTS

        $("#start-game-btn").click(
            () => {

                hideStartButton();

                showPlayground();

                getDeck();

                getCards();

            }
        );

        $("#draw-cards-btn").click(
            () => {
                if(cardsCounter != 2 && cardsCounter > 0) {
                    getCards();
                } else {
                    if (cardsCounter == 2) {
                        getCards();
                    }
                    endGame();
                }
            }
        );

        // BEFORE GAME FUNCTIONS

        function hideStartButton() {

            $("#start-game-btn").hide();

        }// Eo hideStartButton()

        function showPlayground() {

            $("#playground").show();

        }// Eo showPlayground()

        function getDeck() {

            $.ajax(
                {
                    url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
                    type: "GET",
                    async: false,
                    success: function (deck) {
                        parseDeckRes(deck);
                    }
                }
            );

        }// Eo getDeck()

        function parseDeckRes(data) {

            deck = data;

            cardsCounter = data.remaining;

        }//parseDeckRes()

        // IN GAME FUNCTIONS

        function getCards() {

            let cardsReq ="https://deckofcardsapi.com/api/deck/" + deck.deck_id + "/draw/?count=2";

            $.ajax(
                {
                    url: cardsReq,
                    type: "GET",
                    async: false,
                    success: decrementCounter()
                }
            ).done((data) => {

                removeWinningStyle();

                displayCards(data.cards[0], data.cards[1]);

                compareCards(checkCardValue(data.cards[0].value), checkCardValue(data.cards[1].value));

                displayScores();


            });

        }//Eo getCards()

        function displayCards (card1, card2) {

            $("#card-player-1").attr("src", card1.image);

            $("#card-player-2").attr("src", card2.image);

        }// Eo displayCards()

        function decrementCounter() {

            cardsCounter -= 2;

            $("#cards-count").text("Cartes restante(s) : " + cardsCounter);

        }

        function compareCards(card1, card2) {

            let result;

            console.log("compareCards() card1 = " + card1);
            console.log("compareCards() card2 = " + card2);

            if (card1 == card2) {
                console.log("compareCards() -> DRAW")
            } else if (card1 > card2) {
                console.log("compareCards() -> P1 wins !")
                $("#card-player-1").addClass("winning-card");
                scoreJ1++;
            } else if (card2 > card1) {
                console.log("compareCards() -> P2 wins !")
                $("#card-player-2").addClass("winning-card");
                scoreJ2++;
            }

            return result;
        }

        function displayScores () {
            $("#score-p1").text(scoreJ1);
            $("#score-p2").text(scoreJ2);
        }

        function checkCardValue (value) {

            let newValue = value;

            if (value == "ACE") {
                newValue = 14;
            } else if (value == "KING") {
                newValue = 13;
            } else if (value == "QUEEN") {
                newValue = 12;
            } else if (value == "JACK") {
                newValue = 11;
            }

            return parseInt(newValue);
        }

        function endGame() {

            $("#main-content").fadeTo(1000, 0.2, function () {
                if (scoreJ1 > scoreJ2) {
                    $("#result-display").text("Félicitations Joueur 1 !");

                } else if ( scoreJ2 > scoreJ1) {

                    $("#result-display").text("Félicitations Joueur 2 !");

                } else if ( scoreJ1 == scoreJ2) {

                    $("#result-display").text("Egalité...");

                }
            });

        }

        function removeWinningStyle() {
            $("#card-player-1").removeClass("winning-card");
            $("#card-player-2").removeClass("winning-card");
        }

    }// Eo main function
);// Eo ready