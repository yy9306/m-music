<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="Img">
       <div class="play-wrapper">
          <div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
             <i class="icon-play"></i>
             <span class="text">随机播放全部</span>
          </div>
       </div>
       <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs"
            :listenScroll="listenScroll"
            :probe-type="probeType"
            @scroll="scroll"
            class="list" ref="list" >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
 import scroll from 'base/scroll/scroll'
 import songList from 'base/songlist/songlist'
 import {prefixStyle} from 'common/js/dom'
 import {mapActions} from 'vuex'
 import {playListMixin} from 'common/js/mixin'
 const RESERVE_HEIGHT = 40
 const transform = prefixStyle('transform')
 const backdrop = prefixStyle('backdrop-filter')
 export default{
   mixins: [playListMixin],
   components: {scroll, songList},
   data () {
     return {
       scrollY: 0
     }
   },
   props: {
     bgImage: {
       type: String,
       default: ''
     },
     songs: {
       type: Array,
       default: []
     },
     title: {
       type: String,
       default: ''
     },
     rank: {
       type: Boolean,
       default: false
     }
   },
   mounted () {
     this.imageHeight = this.$refs.Img.clientHeight
     this.minTransalteY = -this.imageHeight + RESERVE_HEIGHT
     this.$refs.list.$el.style.top = `${this.$refs.Img.clientHeight}px`
   },
   created () {
     this.listenScroll = true
     this.probeType = 3
   },
   computed: {
     bgStyle () {
       return `background-image:url(${this.bgImage})`
     }
   },
   methods: {
     scroll (pos) {
       this.scrollY = pos.y
     },
     back () {
       this.$router.back()
     },
     selectItem (song, index) {
       this.selectPlay({
         list: this.songs,
         index
       })
     },
     random () {
       this.randomPlay({
         list: this.songs
       })
     },
     handlePlayList (playList) {
       const bottom = playList.length > 0 ? '60px' : ''
       this.$refs.list.$el.style.bottom = bottom
       this.$refs.list.refresh()
     },
     ...mapActions([
       'selectPlay',
       'randomPlay'
     ])
   },
   watch: {
     scrollY (newY) {
       let translateY = Math.max(this.minTransalteY, newY)
       let zIndex = 0
       let scale = 1
       let blur = 0
       this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
       let percent = Math.abs(newY / this.imageHeight)
       if (newY > 0) {
         scale = 1 + percent
         zIndex = 10
       } else {
         blur = Math.min(20 * percent, 20)
       }
       if (newY < this.minTransalteY) {
         zIndex = 10
         this.$refs.Img.style.paddingTop = 0
         this.$refs.Img.style.height = `${RESERVE_HEIGHT}px`
         this.$refs.playBtn.style.display = `none`
       } else {
         this.$refs.Img.style.paddingTop = '70%'
         this.$refs.Img.style.height = 0
       }
       this.$refs.Img.style[transform] = `scale(${scale})`
       this.$refs.filter.style[backdrop] = `blur(${blur})`
       this.$refs.Img.style.zIndex = zIndex
     }
   }
 }
</script>

<style lang="stylus" lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.music-list
  position: fixed
  z-index: 100
  top: 0
  left: 0
  bottom: 0
  right: 0
  background: $color-background
  .back
    position absolute
    top: 0
    left: 6px
    z-index: 50
    .icon-back
      display: block
      padding: 10px
      font-size: $font-size-large-x
      color: $color-theme
  .title
    position: absolute
    top: 0
    left: 10%
    z-index: 40
    width: 80%
    no-wrap()
    text-align: center
    line-height: 40px
    font-size: $font-size-large
    color: $color-text
  .bg-image
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
    transform-origin: top
    background-size: cover
    .play-wrapper
      position: absolute
      bottom: 20px
      z-index: 50
      width: 100%
      .play
        box-sizing: border-box
        width: 135px
        padding: 7px 0
        margin: 0 auto
        text-align: center
        border: 1px solid $color-theme
        color: $color-theme
        border-radius: 100px
        font-size: 0
        .icon-play
          display: inline-block
          vertical-align: middle
          margin-right: 6px
          font-size: $font-size-medium-x
        .text
          display: inline-block
          vertical-align: middle
          font-size: $font-size-small
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
  .bg-layer
    position: relative
    height: 100%
    background: $color-background
  .list
    position: absolute
    top: 0
    bottom: 0
    width: 100%
    background: $color-background
    .song-list-wrapper
      padding: 20px 30px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
