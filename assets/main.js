const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PlAYER_STORAGE_KEY = 'GIN_CHAN';
const musicBanner = $('.music-banner')
const titleBanner = $('.titel-banner')
const tasbakImg = $('.tasbak-img')
const songName = $('.song-name')
const singer = $('.singer')
const play = $('.play')
const btnPlay = $('.play')
const btnNext = $('.next')
const btnPrev = $('.previous')
const btnRandom = $('.random')
const btnRepeat = $('.repeat')
const progress = $('#progress')
const audio = $('#audio')
const songInfo = $('.song-info')
const musicW = $('.music-waves')
const songItem = $('.song-item')
const song = $('.song')
const vol = $('#volume')
const startTime =$('.currTime')
const endTime =$('.durrTime')
const heart =$('.heart')

// app
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    setconfig: function(key , value) {
        this.config[key] = value;
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config))

    },
    songs: [{
            order: 1,
            name: 'Suzume no Tojimari',
            singer: ' Nanoka Hara',
            path: '../audio/suzume.mp3',
            image: '../img/suzume.jpg',
            time: '3:00'
        },
        {
            order: 2,
            name: 'Lemon',
            singer: 'Kenshi Yonezu',
            path: '../audio/lemon.mp3',
            image: '../img/lemon.jpg',
            time: '3:08'

        },
        {
            order: 3,
            name: 'Nandemonaiya',
            singer: 'Radwimps',
            path: '../audio/nandemonaiya.mp3',
            image: '../img/Nandemonaiya.jpg',
            time: '3:02'

        },
        {
            order: 4,
            name: 'Uchiage Hanabi',
            singer: 'Daoko',
            path: '../audio/Uchiage Hanabi.mp3',
            image: '../img/uchiage hanabi.jpg',
            time: '3:01'

        },
        {
            order: 5,
            name: 'Good Morning',
            singer: 'omori',
            path: '../audio/omori.mp3',
            image: '../img/omori.jpg',
            time: '3:01'

        },
        {
            order: 6,
            name: 'Genkai Toppa x Survivor',
            singer: 'Kiyoshi Hikawa',
            path: '../audio/Kiyoshi-Hikawa-Genkai-Toppa-Survivor.mp3',
            image: '../img/goku.jpg',
            time: '3:01'

        },

    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'melody' : ''}" data-index='${index}'>
                <div class="song-info">
                    <div class="order">
                        <span class="order-number">${song.order}</span>
                        <div class="music-waves">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                            <img src="${song.image}" alt="" class="img-song">                           
                            <div class="song-des">
                                <h4 class="song-name">${song.name}</h4>
                                <h4 class="singer">${song.singer}</h4>
                            </div>
                        </div>
                    <div class="time">
                        <div class="heart"><i class="material-symbols-outlined">favorite</i></div>
                        <span class="song-time">${song.time}</span>
                    </div>
            </div>
            `
        })
        $('.song-item').innerHTML = htmls.join('\n')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },


    handleEvents: function () {
        const _this = this

        // btn play 
        btnPlay.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // khi on playbtn
        audio.onplay = function () {
            _this.isPlaying = true
            btnPlay.classList.add('playing')
            // songInfo.classList.add('melody')

        }
        // khi off playbtn
        audio.onpause = function () {
            _this.isPlaying = false
            btnPlay.classList.remove('playing')
            // songInfo.classList.remove('melody')

        }
        // time update
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // xu li khi tua song
        progress.oninput = function (e) {
            // audio.pause()
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
            progress.onchange = function (){
                audio.play()
            }
        }

        // next song
        btnNext.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
        }
        // prev song
        btnPrev.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
        }
        // random
        btnRandom.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setconfig('isRandom', _this.isRandom)
            btnRandom.classList.toggle('active', _this.isRandom)

        }
        // next khi bai hat ket thuc
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                btnNext.click();
            }
        };

        // repeat
        btnRepeat.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            _this.setconfig('isRepeat', _this.isRepeat)
            btnRepeat.classList.toggle("active", _this.isRepeat)
        };
        // khi click vao playlist
        songItem.onclick = function(e) {
            const songNode = e.target.closest ('.song:not(.melody)')

            if ( songNode || e.target.closest('.heart')) {
                console.log(e.target)
                
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                  }
                
                //   if (e.target.closest(".heart")) {
                //     heart.classList.toggle('active')
                // }
            }
        };
        
        vol.onmousemove = function () {
            let count = vol.value / 100
            audio.volume = count;
            console.log(count)
        }



        audio.ontimeupdate = function () {
            //Hiển thị thời gian trên thanh progress

            // Khi tiến độ bài hát bị thay đổi
            if (audio.duration) {
              const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
              progress.value = progressPercent;
              // Đếm thời gian của thời gian hiện tại
              var time = Math.floor(audio.currentTime);
              var second = time % 60; // Số giây
              var minutes = Math.floor(time / 60); // Số phút
              if (second < 10) {
                var num = 0;
              } else {
                num = "";
              }
              startTime.textContent = '0' + minutes + ":" + num + second;
      
              // Đếm thời gian của thời lượng âm thanh
              var minutesDisplay = Math.floor(audio.duration);
              var secondDisplay = minutesDisplay % 60; //số giây
              var minu = Math.floor(minutesDisplay / 60); //số phút
              if (secondDisplay < 10) {
                var num = 0;
              } else {
                num = "";
              }
             
              endTime.textContent = '0' + minu + ":" + num + secondDisplay;
            }
      
            if(!audio.duration) {
              startTime.textContent = '00' + ":" + "00";
              endTime.textContent = '00' + ":" + "00";
            }
          }  
    },


    loadCurrentSong: function () {

        titleBanner.textContent = this.currentSong.name
        songName.textContent = this.currentSong.name
        singer.textContent = this.currentSong.singer
        tasbakImg.style.backgroundImage = `url('${this.currentSong.image}')`
        musicBanner.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },

    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()

    },
    randomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex

        this.loadCurrentSong()
    },
    // formatTimer: function (num){
    //     var min = Math.floor( num / 60);
    //     var sec = Math.floor( num - min*60);
    //     if ( sec < 10) {return `${min}:0${sec}`}
    //     else {return `${min}:${sec}`}
    // },

    // displayTimer: function (){
    //     const { duration, currentTime } = audio;
    //     progress.max = duration;
    //     progress.value = currentTime;
    //     endTime.textContent = this.formatTimer(duration);
    //     if (!duration) {
    //       startTime.textContent = "00:00";
    //     } else {
    //       startTime.textContent = this.formatTimer(duration);
    //     }
    // },


    start: function () {

        this.loadConfig()

        this.defineProperties() // dinh nghia thuoc tinh cho object

        this.handleEvents()

        this.loadCurrentSong()

        // this.displayTimer()

        this.render()

        btnRandom.classList.toggle("active", this.isRandom);
        btnRepeat.classList.toggle("active", this.isRepeat);
        
    }
}
app.start()