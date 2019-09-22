var container = document.getElementsByTagName('main')[0];

window.addEventListener('load', function () {
    if (sessionStorage.getItem('info')) {
        container.innerHTML = JSON.parse(sessionStorage.getItem('info'));

        var buttonStart = document.getElementsByClassName('button-start')[0],
            timeWindowArr = document.getElementsByClassName('time-window');

        if (buttonStart && buttonStart.dataset.state === 'stop') {
            setStopwatch(buttonStart, timeWindowArr);
        }
    }
}, false);

container.onclick = function createTimer(event) {
    var buttonStart = document.getElementsByClassName('button-start')[0],
        target = event.target,
        timeWindowArr = document.getElementsByClassName('time-window');

    if (buttonStart === target) {
        if (buttonStart.dataset.state === 'start') {
            buttonStart.dataset.state = 'stop';

            buttonStart.textContent = 'stop';

            container.insertAdjacentHTML('beforeEnd', '<button class="button button-reset">'
                + 'reset</button><button class="button button-save">save</button>');
        } else if (buttonStart.dataset.state === 'run') {
            buttonStart.dataset.state = 'stop';

            buttonStart.textContent = 'stop';
        } else if (buttonStart.dataset.state === 'stop') {
            buttonStart.dataset.state = 'run';

            buttonStart.textContent = 'run';
        }

        setStopwatch(buttonStart, timeWindowArr);
    }

    var resetBtn = document.getElementsByClassName('button-reset')[0],
        saveBtn = document.getElementsByClassName('button-save')[0];

    if (target === resetBtn) {
        if (!document.getElementsByClassName('button-start')[0]) {

            container.insertAdjacentHTML('afterBegin', '<button class="button button-start" ' +
                'data-state="start">start</button>');
        }

        clearInterval(JSON.parse(localStorage.getItem('timerId')));

        localStorage.removeItem('timerId');

        if (buttonStart) {
            buttonStart.dataset.state = 'start';

            buttonStart.textContent = 'start';
        }

        for (var i = 0; i < timeWindowArr.length; i++) {
            timeWindowArr[i].textContent = '00';
        }

        if (saveBtn) {
            saveBtn.remove();
        }

        resetBtn.remove();

        if (container.getElementsByClassName('value-wrapper')[0]) {
            container.getElementsByClassName('value-wrapper')[0].remove();
        }
    }

    if (target === saveBtn) {
        if (container.getElementsByClassName('value-wrapper')[0]) {
            var ind = document.getElementsByClassName('value-JS').length + 1;

            container.getElementsByClassName('value-wrapper')[0].insertAdjacentHTML('beforeEnd',
                '<span class="value-JS">' + ind + '\) '
                + document.getElementsByClassName('time-window')[0].textContent + ' : '
                + document.getElementsByClassName('time-window')[1].textContent + ' : '
                + document.getElementsByClassName('time-window')[2].textContent + '</span>');
        } else {
            container.insertAdjacentHTML('beforeEnd', '<div class="value-wrapper">'
                + '<span class="value-JS">1\) '
                + document.getElementsByClassName('time-window')[0].textContent + ' : '
                + document.getElementsByClassName('time-window')[1].textContent + ' : '
                + document.getElementsByClassName('time-window')[2].textContent + '</span></div>');
        }
    }
};

window.addEventListener('beforeunload', function () {
    sessionStorage.setItem('info', JSON.stringify(container.innerHTML));
}, false);

function setStopwatch(buttonStart, timeWindowArr) {
    var timerId = setInterval(function () {
        if (buttonStart.dataset.state === 'run') {
            clearInterval(timerId);
        }

        makeTwoDigits(timeWindowArr[2]);

        if (+timeWindowArr[2].textContent === 100) {
            makeTwoDigits(timeWindowArr[1]);

            timeWindowArr[2].textContent = '00';

            if (+timeWindowArr[1].textContent === 60) {
                makeTwoDigits(timeWindowArr[0]);

                timeWindowArr[1].textContent = '00';

                if (+timeWindowArr[0].textContent === 60) {
                    clearInterval(timerId);

                    buttonStart.remove();

                    document.getElementsByClassName('button-save')[0].remove();
                }
            }
        }

        localStorage.setItem('timerId', JSON.stringify(timerId));

        function makeTwoDigits(n) {
            if (+n.textContent < 9) {
                n.textContent = '0' + (+n.textContent + 1);
            } else {
                n.textContent = +n.textContent + 1;
            }
        }
    }, 10);
}