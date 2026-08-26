embedcalendar();

function embedcalendar(){


// 1. Define your HTML, CSS, and JavaScript string
const template = `
  <style>
#elxn-calendar{
    -webkit-box-sizing:border-box;
    -moz-box-sizing: border-box;
    box-sizing:border-box;
    position:relative;
    --debate-color:#ffd166;
    --vote-color: #0BADFE;
    --deadline-color:#EF476F;
    --sans-serif: "HEXFranklin", sans-serif;

    font-family: "TiemposText",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
    h2{
        font-weight:600;
    }
    /*GRID*/
    ol{
        display:grid;
        list-style-type:none;
        grid-template-columns:repeat(7,1fr);
        grid-template-rows:repeat(5,1fr);
        padding:0;
        height:400px;

        li{
            padding:5px;
            font-family: var(--sans-serif);

        }
        .debate{
              background-color: rgb(from var(--debate-color) r g b / 0.5);}
        .vote{
              background-color: rgb(from var(--vote-color) r g b / 0.5);}
        .deadline{
              background-color: rgb(from var(--deadline-color) r g b / 0.5);}

        .debate.deadline{background: linear-gradient(135deg,rgba(255, 209, 102, .5) 0%, rgba(255, 209, 102, .5) 50%, rgba(239, 71, 111, .5) 50%, rgba(239, 71, 111, .5) 100%);}
        .vote.deadline{background: linear-gradient(-45deg,rgba(239, 71, 111, .5) 0%, rgba(239, 71, 111, .5) 50%, rgba(11, 173, 254, .5) 50%, rgba(11, 173, 254, .5) 100%);}

    }

    #day-grid li:nth-child(even):not(.modal-entry) {
    background-color: #f2f2f2;}

    /*LEGEND*/
    #legend{
        display:flex;
        flex-direction:row;
        margin:.75rem 0;
    }

    .legend{
            display:flex;
            margin-right:1rem;
            align-items: center;
            font-family: var(--sans-serif);

        }
        .legend::before{
                content:"";
                display:inline-block;
                width:1rem;
                height:1rem;
                border-radius:100%;
                margin-right:.3rem;
        }
        .legend.vote::before{background-color: rgb(from var(--vote-color) r g b / .5);}
        .legend.debate::before{background-color: rgb(from var(--debate-color) r g b / .5);}
        .legend.deadline::before{background-color: rgb(from var(--deadline-color) r g b / .5);}

    /*HOVER STATE*/
    .modal-entry:hover{
        cursor:pointer;
    }
    .modal-entry.debate:hover{
        background-color: rgb(from var(--debate-color) r g b / 1);}
    .modal-entry.vote:hover{
        background-color: rgb(from var(--vote-color) r g b / 1);}
    .modal-entry.deadline:hover{
        background-color: rgb(from var(--deadline-color) r g b / 1);}
    .modal-entry.debate.deadline:hover{background: linear-gradient(135deg,rgba(255, 209, 102, 1) 0%, rgba(255, 209, 102, 1) 50%, rgba(239, 71, 111, 1) 50%, rgba(239, 71, 111, 1) 100%);}
    .modal-entry.vote.deadline:hover{background: linear-gradient(-45deg,rgba(239, 71, 111, 1) 0%, rgba(239, 71, 111, 1) 50%, rgba(11, 173, 254, 1) 50%, rgba(11, 173, 254, 1) 100%);}

    /*MODAL*/
    .calendar-modal {
    display: none;
    position: absolute;
    inset: 0;
    z-index: 1000;}

    .calendar-modal-panel {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    padding: 20px;
    width:100%;
    max-width:500px;
    border:1px solid black;
    display: grid;
    grid-template-columns: auto min-content;
    grid-template-rows: min-content auto;
    align-items:center;
    }
     .calendar-modal-content{
        grid-column:1/span 2;
       
    }

    .calendar-modal-date{
        grid-colum: 1/span 1;
        grid-row:1/span 1;
        h3{
            margin-top:0;
            font-family: var(--sans-serif);
        }
    }
   
    .calendar-modal-close {
    border:none;
    background: none;
    cursor: pointer;
    grid-column: 2/span 1;
    grid-row:1/span 1;
    font-family: var(--sans-serif);}
    line-height:1;
    margin-bottom: var(--wp--preset--spacing--05);
    font-size:24px;
    font-size: clamp(var(--wp--custom--font-size--type-size-19), 0.47vw + 14.5px, var(--wp--custom--font-size--type-size-22));
}
  </style>
  
  <div id="elxn-calendar">
            <h2>Quebec election key dates</h2>
            <div id="legend"><span class="legend deadline">Deadline</span><span class="legend debate">Debate</span><span class="legend vote">Voting</span></div>
            <div id="calendar-modal" class="calendar-modal">
                <div class="calendar-modal-panel">
                    <button type="button" class="calendar-modal-close">
                        &times;
                    </button>
                    <div class="calendar-modal-date"></div>
                    <div class="calendar-modal-content"></div>
                </div>
            </div>
            <ol id="day-grid">
                <li data-date="09/06/2026" class="calendar-entry">6 Sept.</li>
                <li data-date="09/07/2026" class="calendar-entry">7</li>
                <li data-date="09/08/2026" class="calendar-entry">8</li>
                <li data-date="09/09/2026" data-debate="Cinq chefs, une élection, a special program with all five leaders, 8 p.m. on Radio-Canada" class="calendar-entry debate modal-entry">9</li>
                <li data-date="09/10/2026" class="calendar-entry">10</li>
                <li data-date="09/11/2026" class="calendar-entry">11</li>
                <li data-date="09/12/2026" class="calendar-entry">12</li>
                <li data-date="09/13/2026" class="calendar-entry">13</li>
                <li data-date="09/14/2026" class="calendar-entry">14</li>
                <li data-date="09/15/2026" data-debate="TVA leaders&#x27; debate, 8 p.m." class="calendar-entry debate modal-entry">15</li>
                <li data-date="09/16/2026" data-deadline="Deadline to request a ballot to vote from outside Quebec." data-debate="Noovo/Crave leaders&#x27; debate, 8 p.m." class="calendar-entry deadline debate modal-entry">16</li>
                <li data-date="09/17/2026" class="calendar-entry">17</li>
                <li data-date="09/18/2026" class="calendar-entry">18</li>
                <li data-date="09/19/2026" class="calendar-entry">19</li>
                <li data-date="09/20/2026" class="calendar-entry">20</li>
                <li data-date="09/21/2026" class="calendar-entry">21</li>
                <li data-date="09/22/2026" class="calendar-entry">22</li>
                <li data-date="09/23/2026" data-debate="Radio-Canada leaders&#x27; debate, 8 p.m." class="calendar-entry debate modal-entry">23</li>
                <li data-date="09/24/2026" class="calendar-entry">24</li>
                <li data-date="09/25/2026" data-vote="Registration and voting at the office of the returning officer" class="calendar-entry vote modal-entry">25</li>
                <li data-date="09/26/2026" data-vote="Registration and voting at the office of the returning officer" class="calendar-entry vote modal-entry">26</li>
                <li data-date="09/27/2026" data-vote="Advance polling, 9:30 a.m. to 8 p.m." class="calendar-entry vote modal-entry">27</li>
                <li data-date="09/28/2026" data-vote="Advance polling, 9:30 a.m. to 8 p.m." class="calendar-entry vote modal-entry">28</li>
                <li data-date="09/29/2026" data-vote="Registration and voting at the office of the returning officer" class="calendar-entry vote modal-entry">29</li>
                <li data-date="09/30/2026" data-vote="Registration and voting at the office of the returning officer" class="calendar-entry vote modal-entry">30</li>
                <li data-date="10/01/2026" data-deadline="Deadline to add or correct entries on the list of electors." data-vote="Registration and voting at the office of the returning officer" class="calendar-entry deadline vote modal-entry">1 Oct.</li>
                <li data-date="10/02/2026" class="calendar-entry">2</li>
                <li data-date="10/03/2026" class="calendar-entry">3</li>
                <li data-date="10/04/2026" class="calendar-entry">4</li>
                <li data-date="10/05/2026" data-vote="Election day voting (9:30 a.m. to 8 p.m.)" class="calendar-entry vote modal-entry">5</li>
            </ol>
        </div>
        
    </div>

  <script>
    
    //load jquery
    (function (url, position, callback) {
    'use strict';

    var head;
    var script;
    var referenceNode;

    url = url || 'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js';
    position = Number.isInteger(position) ? position : 0;

    if (window.jQuery) {
        if (typeof callback === 'function') {
            callback(window.jQuery);
        }
        return;
    }

    head = document.head || document.getElementsByTagName('head')[0];

    if (!head) {
        return;
    }

    script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;

    script.onload = function () {
        if (window.jQuery && typeof callback === 'function') {
            callback(window.jQuery);
        }
    };

    script.onerror = function () {
        console.error('Failed to load jQuery from: ' + url);
    };

    referenceNode = head.childNodes[position] || null;
    head.insertBefore(script, referenceNode);
}(
    'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js',
    0,
    function ($) {
        console.log('jQuery loaded:', $.fn.jquery);

        function resize(){
        var w = $('#day-grid').width();
        var h = w*5/7;
        $('#day-grid').css('height',h);

    }


    resize();

    //popup opens+populates
    $('#elxn-calendar .modal-entry').on('click', function () {
        let html = '';
        const debate = $(this).data('debate');
        const deadline = $(this).data('deadline');
        const vote = $(this).data('vote');
        const date = $(this).data('date');


        if (date) {
        const months = [
            'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June',
            'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'
        ];

        const parts = date.split('/');
        const month = months[parseInt(parts[0], 10) - 1];
        const day = parseInt(parts[1], 10);
        const year = parts[2];

        $('.calendar-modal-date').html('<h3 class="modal-date">' +
                month + ' ' + day + ', ' + year +
                '</h3>');
        }

        if (debate) {
            html += '<p><strong class="legend debate modal-legend">Debate:</strong> ' + debate + '</p>';
        }

        if (deadline) {
            html += '<p><strong class="legend deadline modal-legend">Deadline:</strong> ' + deadline +'</p>';
        }

        if (vote) {
            html += '<p><strong class="legend vote modal-legend">Voting:</strong> ' + vote  + '</p>';
        }

        $('.calendar-modal-content').html(html);
        $('#calendar-modal').show();
    });


//options for closing modal
    $('.calendar-modal-close').on('click', function () {
        $('#calendar-modal').hide();
    });

    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            $('#calendar-modal').hide();
        }
    });

    $('#calendar-modal').on('click', function (e) {
        if (!$(e.target).closest('.calendar-modal-panel').length) {
            $('#calendar-modal').hide();
        }
    });

    }
));


</script>
`;

// 2. Select your target element
const targetDiv = document.getElementById('elxncalendar');

// 3. Convert the string into an executable DOM Fragment
const contextualFragment = document.createRange().createContextualFragment(template);

// 4. Append it to clean out old content and run the script
targetDiv.innerHTML = ''; 
targetDiv.appendChild(contextualFragment);
};
