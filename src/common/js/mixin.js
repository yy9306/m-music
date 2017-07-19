import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playmode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted () {
    this.handlePlayList(this.playList)
  },
  activated () {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList (newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList () {
      throw new Error('component must implement handlePlayList methods')
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode () {
      return this.mode === playmode.sequence ? 'icon-sequence' : this.mode === playmode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList',
      'favoriteList'
    ])
  },
  methods: {
    //  改变播放模式
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setplayMode(mode)
      let list = null
      if (mode === playmode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setplayList(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getFavoriteIcon (song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavorite (song) {
      if (this.isFavorite(song)) {
        this.seleteFavorite(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite (song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapActions([
      'saveFavoriteList',
      'seleteFavorite'
    ]),
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setplayList: 'SET_SEQUENCE_LIST',
      setplayMode: 'SET_PLAY_MODE'
    })
  }
}

export const searchMixin = {
  data () {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    blurInput () {
      this.$refs.searchBox.blur()
    },
    saveSearch () {
      this.saveSearchHistory(this.query)
    },
    onQueryChange (query) {
      this.query = query.trim()
    },
    ...mapActions([
      'saveSearchHistory', 'deleteSearchHistory'
    ])
  }
}
