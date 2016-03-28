import Vue from 'vue'
import _ from 'lodash'
import Spinner from 'spin'

new Vue({
    el: '#content',
    data: {
        mo: [],
        jho: [],
        sto: [],
        moCmc: 1,
        stoCmc: 1,
        loading: true
    },
    watch:{
        mo(){
            const textarea = this.$els.mo_ta;
            textarea.scrollTop = textarea.scrollHeight;
        },
        jho(){
            const textarea = this.$els.jho_ta;
            textarea.scrollTop = textarea.scrollHeight;
        },
        sto(){
            const textarea = this.$els.sto_ta;
            textarea.scrollTop = textarea.scrollHeight;
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
        require(["./filtered.json"], (MtgJson) => {
            this.cards = MtgJson;
            this.loading = false;
        });
    },
    methods: {
        generate(type){
            switch (type) {
                case 'mo':
                    const section = this.cards.mo[this.moCmc];
                    this.mo.push(_.sample(section).name);
                    break;
                case 'jhoInstant':
                    for (let i = 0; i < 3; i++)
                        this.jho.push(_.sample(this.cards.jhoInstants).name);
                    break;
                case 'jhoSorcery':
                    for (let i = 0; i < 3; i++)
                        this.jho.push(_.sample(this.cards.jhoSorceries).name);
                    break;
                case 'sto':
                    const card = _.chain(this.cards.sto)
                        .pickBy((value, key) => parseInt(key) < this.stoCmc)
                        .values()
                        .flatten()
                        .sample()
                        .value();

                    this.sto.push(card.name);
                    break;
            }
        },

        text(type){
            return this[type].join('\n');
        },

        copy(type){
            let textarea;
            let lastCard;
            let totalLength;

            switch (type) {
                case "mo":
                    textarea = this.$els.mo_ta;
                    lastCard = _.last(this.mo).length;
                    totalLength = this.text('mo').length;
                    break;
                case "sto":
                    textarea = this.$els.sto_ta;
                    lastCard = _.last(this.sto).length;
                    totalLength = this.text('sto').length;
                    break;
            }

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

