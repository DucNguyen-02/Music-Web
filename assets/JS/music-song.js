const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.songname-content-list');
const footerImg = $('.footer-thumb-img');
const footerSong = $('.footer-songname');
const footerSinger = $('.songname-content-item-detail-left-author');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const bigImg = $('.songname-content-img');
const footerControl = $('.footer-control');
const progress = $('#progress');
const repeatBtn = $('.btn-repeat');
const randomBtn = $('.btn-random');
const volume = $('#progressVolume');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    songs: [
        {
            name:'Nàng thơ',
            singer: 'Hoàng Dũng',
            path: './assets/music/song1.mp3',
            image: './assets/img/img-song/song1.jpg'
        },
        {
            name:'Đường chân trời',
            singer: 'Chillies',
            path: './assets/music/song2.mp3',
            image: './assets/img/img-song/song2.jpg'
        },
        {
            name:'Nép vào anh và nghe anh hát',
            singer: 'Hoàng Dũng',
            path: './assets/music/song3.mp3',
            image: './assets/img/img-song/song3.jpg'
        },
        {
            name:'Thở',
            singer: 'Dalab',
            path: './assets/music/song4.mp3',
            image: './assets/img/img-song/song4.jpg'
        }
    ],
    defineProperty: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },
    render: function() {
        progressVolume.value = 50;
        audio.value = 0.5;
        const htmls = this.songs.map((song,index) => {
            return `
                    <li class="songname-content-item ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                        <img src="${song.image}" alt="" class="songname-content-item-img">
                        <div class="songname-content-item-detail">
                            <div class="songname-content-item-detail-left">
                                <span class="songname-content-item-detail-left-name">
                                    ${song.name}
                                </span>
                                <a href="" class="songname-content-item-detail-left-author">${song.singer}</a>
                            </div>
                            <div class="songname-content-item-detail-right">
                                <button class="songname-content-btn">
                                    <i class="fas fa-heart"></i>
                                </button>
                                <button class="songname-content-btn-option songname-content-btn">
                                    <i class="fas fa-ellipsis-h"></i>
                                </button>
                            </div>
                        </div>
                    </li>
            `
        });
        playlist.innerHTML = htmls.join('');
    },
    handleEvent: function() {
        var _this = this;
        const cdThumb = footerImg.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000, // 10 second
            iterations: Infinity
        });
        cdThumb.pause();
        playBtn.onclick = function() {
            if(_this.isPlaying){
                audio.pause();
            } else {
                audio.play();
            }
        }

        audio.onplay = function() {
            _this.isPlaying = true;
            cdThumb.play();
            footerControl.classList.add('active');
        }

        audio.onpause = function() {
            _this.isPlaying = false;
            cdThumb.pause();
            footerControl.classList.remove('active');
        }

        nextBtn.onclick = function() {
            if(_this.isRandom){
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            _this.scrollToActiveSong();
            _this.loadCurrentSong();
            audio.play();
            _this.render();
        }

        prevBtn.onclick = function() {
            if(_this.isRandom){
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            _this.scrollToActiveSong();
            _this.loadCurrentSong();
            _this.render();
            audio.play();
        }

        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        progress.onchange = function(e) {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        volume.onchange = function(e) {
            audio.volume = e.target.value / 100;
        }

        playlist.onclick = function(e) {
            const songNode =  e.target.closest('.songname-content-item:not(.active)')
            if(songNode || e.target.closest('.songname-content-btn-option')) {
                // Xử lý khi click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Xử lý khi click vào song option

            }
        }
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex > this.songs.length -1 )
            this.currentIndex = 0;
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0)
            this.currentIndex = this.songs.length-1;
    },
    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex == this.currentSong);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.songname-content-item.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 300);
    },
    loadCurrentSong: function() {
        footerImg.src = this.currentSong.image;
        bigImg.src = this.currentSong.image;
        footerSinger.textContent = this.currentSong.singer;
        footerSong.textContent = this.currentSong.name
        audio.src = this.currentSong.path;
    },
    start: function() {
        this.defineProperty();  
        this.render();
        this.loadCurrentSong();
        this.handleEvent();
    }
}

app.start();

const playAll = document.querySelector('.songname-header-right-playall');
playAll.onclick = function() {
    playBtn.click();
}