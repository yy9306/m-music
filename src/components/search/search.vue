<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @query="onQueryChange" ref="searchBox"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
       <scroll class="shortcut" ref="shortcut" :data="shortcut" :refreshDelay="refreshDelay">
         <div class="">
           <div class="hot-key">
              <h1 class="title">热门搜索</h1>
              <ul>
                  <li class="item" v-for="item in hotkey" @click="addQuery(item.k)">
                    <span>{{item.k}}</span>
                  </li>
              </ul>
           </div>
           <div class="search-history" v-show="searchHistory.length">
              <h1 class="title">
                <span class="text">搜索历史</span>
                <span class="clear" @click="showConfirm">
                  <i class="icon-clear"></i>
                </span>
              </h1>
              <search-list :searches="searchHistory" @select="addQuery" @del="deleteOne"></search-list>
           </div>
         </div>
       </scroll>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest :query="query" @listScroll="blurInput" @select="saveSearch" ref="suggest"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空所有搜索历史" cancelBtnText="清空" @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
  import SearchBox from 'base/search-box/search-box'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import suggest from 'components/suggest/suggest'
  import searchList from 'base/search-list/search-list'
  import confirm from 'base/confirm/confirm'
  import Scroll from 'base/scroll/scroll'
  import {playListMixin, searchMixin} from 'common/js/mixin'
  import {mapActions} from 'vuex'
  export default{
    mixins: [playListMixin, searchMixin],
    components: {
      SearchBox, suggest, searchList, confirm, Scroll
    },
    data () {
      return {
        hotkey: [],
        refreshDelay: 100
      }
    },
    created () {
      this._getHotKey()
    },
    computed: {
      shortcut () {
        return this.hotkey.concat(this.searchHistory)
      }
    },
    watch: {
      query (newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
    methods: {
      _getHotKey () {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotkey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      handlePlayList (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()
      },
      addQuery (item) {
        this.$refs.searchBox.setQuery(item)
      },
      showConfirm () {
        this.$refs.confirm.show()
      },
      deleteOne (item) {
        this.deleteSearchHistory(item)
      },
      ...mapActions([
        'clearSearchHistory'
      ])
    }
  }
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.search
  .search-box-wrapper
    margin: 20px
  .shortcut-wrapper
    position: fixed
    top: 178px
    bottom: 0
    width: 100%
    .shortcut
      height: 100%
      overflow: hidden
      .hot-key
        margin: 0 20px 20px 20px
        .title
          margin-bottom: 20px
          font-size: $font-size-medium
          color: $color-text-l
        .item
          display: inline-block
          padding: 5px 10px
          margin: 0 20px 10px 0
          border-radius: 6px
          background: $color-highlight-background
          font-size: $font-size-medium
          color: $color-text-d
      .search-history
        position: relative
        margin: 0 20px
        .title
          display: flex
          align-items: center
          height: 40px
          font-size: $font-size-medium
          color: $color-text-l
          .text
            flex: 1
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
  .search-result
    position: fixed
    width: 100%
    top: 178px
    bottom: 0
</style>
