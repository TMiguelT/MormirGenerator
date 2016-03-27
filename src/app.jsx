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
        new Spinner({color:'#fff', lines: 12}).spin(this.$els.spin);

        //Load the cards
        require.ensure(['./AllCards.json'], require => {
            const MtgJson = require('./AllCards.json');

            this.loading = false;
            this.groupedCards = _.chain(MtgJson)
                .filter(card => 'types' in card && card.types.indexOf('Creature') != -1)
                .groupBy('cmc')
                .value();
        })
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
            } catch(err) {
                console.log('Oops, unable to cut');
            }

            //Deselect text
            //textarea.setSelectionRange(0, 0);
        }
    }
});

