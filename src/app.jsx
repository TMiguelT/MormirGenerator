import Vue from 'vue'
import MtgJson from './AllCards.json'
import _ from 'lodash'
import Spinner from 'spin'

const groupedCards = _.chain(MtgJson)
    .filter(card => 'types' in card && card.types.indexOf('Creature') != -1)
    .groupBy('cmc')
    .value();

new Vue({
    el: '#content',
    data: {
        cards: [],
        cmc: 1,
        loading: true
    },
    computed: {
        cardsList(){
            return this.cards.join('\n');
        }
    },
    ready(){

        //Show the spinner
        const spinner = new Spinner({
            lines: 13 // The number of lines to draw
            , length: 28 // The length of each line
            , width: 14 // The line thickness
            , radius: 42 // The radius of the inner circle
            , scale: 0.5 // Scales overall size of the spinner
            , corners: 1 // Corner roundness (0..1)
            , color: '#000' // #rgb or #rrggbb or array of colors
            , opacity: 0.25 // Opacity of the lines
            , rotate: 0 // The rotation offset
            , direction: 1 // 1: clockwise, -1: counterclockwise
            , speed: 1 // Rounds per second
            , trail: 60 // Afterglow percentage
            , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
            , zIndex: 2e9 // The z-index (defaults to 2000000000)
            , className: 'spinner' // The CSS class to assign to the spinner
            , top: '50%' // Top position relative to parent
            , left: '50%' // Left position relative to parent
            , shadow: false // Whether to render a shadow
            , hwaccel: false // Whether to use hardware acceleration
            , position: 'absolute' // Element positioning
        }).spin();
        this.$els.spin.appendChild(spinner.el);

        //Load the cards
        require(["./AllCards.json"], (MtgJson) => {
            this.loading = false;
            this.groupedCards = _.chain(MtgJson)
                .filter(card => 'types' in card && card.types.indexOf('Creature') != -1)
                .groupBy('cmc')
                .value();
        });
    },
    methods: {
        generate(){
            const section = this.groupedCards[this.cmc];
            this.cards.push(_.sample(section).name);
        },

        copy(){
            const textarea = this.$els.ta;
            const lastCard = _.last(this.cards).length;
            const totalLength = this.cardsList.length;

            //Select the new area
            textarea.setSelectionRange(totalLength - lastCard, totalLength);

            //Copy if possible
            document.execCommand('copy');
            try {
                var successful = document.execCommand('cut');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Cutting text command was ' + msg);
            } catch (err) {
                console.log('Oops, unable to cut');
            }

            //Deselect text
            //textarea.setSelectionRange(0, 0);
        }
    }
});

