class Timer {
  constructor(durationInput, startButton, restartButton, callbacks) {
    this.durationInput = durationInput;
    this.startButton = startButton;
    this.restartButton = restartButton;
    this.startingVal = this.durationInput.value;

    // 0=nothing/restart 1=started 2=paused 3=resumed

    this.state = 0;

    //Callbacks
    if (callbacks) {
      this.onStart = callbacks.onStart;
      this.onPause = callbacks.onPause;
      this.onResume = callbacks.onResume;
      this.onTick = callbacks.onTick;
      this.onRestart = callbacks.onRestart;
      this.onComplete = callbacks.onComplete;
    }

    //Event handling

    //Start/Pause/Resume button:

    this.startButton.addEventListener("click", () => {
      //If the button icon is play:
      if (this.startButton.innerHTML === '<i class="fas fa-play"></i>') {
        //If you are starting the timer for the first time:
        if (this.state === 0) {
          this.startButton.innerHTML = '<i class="fas fa-pause"></i>';
          this.start();
          this.state = 1;
        }

        //If you paused the timer and want to resume:
        else if (this.state === 2) {
          //If the input is changed on resume: restart the timer
          if (this.durationInput.value != this.timeRemaining) {
            this.restart();
          }

          //Else resume the timer
          else {
            this.startButton.innerHTML = '<i class="fas fa-pause"></i>';
            this.resume();
            this.state = 3;
          }
        }
      }

      //If the button icon is pause:
      else if (
        this.startButton.innerHTML === '<i class="fas fa-pause"></i>' &&
        this.timeRemaining > 0
      ) {
        this.startButton.innerHTML = '<i class="fas fa-play"></i>';
        this.pause();
        this.state = 2;
      }
    });

    //Restart Button:
    this.restartButton.addEventListener("click", () => {
      this.restart();
    });

    //Changing the input value will change the starting val and restart the timer:
    this.durationInput.addEventListener("change", () => {
      this.pause();
      this.startingVal = this.durationInput.value;
      this.restart();
    });
  }

  start() {
    if (this.onStart) {
      this.onStart(this.timeRemaining);
    }
    this.startingVal = this.durationInput.value;
    this.tick();
    this.interval = setInterval(this.tick.bind(this), 20);
  }

  pause() {
    if (this.onPause) {
      this.onPause(this.timeRemaining);
    }
    clearInterval(this.interval);
  }

  resume() {
    if (this.onResume) {
      this.onResume(this.timeRemaining);
    }
    this.tick();
    this.interval = setInterval(this.tick.bind(this), 20);
  }

  restart() {
    if (this.onRestart) {
      this.onRestart();
    }
    if (this.state != 0) {
      this.startButton.innerHTML = '<i class="fas fa-play"></i>';
    }
    this.state = 0;
    clearInterval(this.interval);

    this.durationInput.value = this.startingVal;
  }

  tick() {
    if (this.timeRemaining <= 0) {
      this.pause();
      this.startButton.innerHTML = '<i class="fas fa-play"></i>';
      if (this.onComplete) {
        this.onComplete();
      }
    } else {
      this.timeRemaining = this.timeRemaining - 0.02;
      if (this.onTick) {
        this.onTick(this.timeRemaining);
      }
    }
  }

  get timeRemaining() {
    return parseFloat(this.durationInput.value);
  }

  set timeRemaining(time) {
    this.durationInput.value = time.toFixed(2);
  }
}
