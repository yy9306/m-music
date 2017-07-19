<template id="">
  <div class="search-list">
     <transition-group name="list" tag="ul">
       <li class="search-item" v-for="item in searches" @click="selectItem(item)" :key="item">
         <span class="text">{{item}}</span>
         <span class="icon" @click.stop="deleteOne(item)">
           <i class="icon-delete"></i>
         </span>
       </li>
     </transition-group>
  </div>
</template>

<script type="text/javascript">
  export default{
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem (item) {
        this.$emit('select', item)
      },
      deleteOne (item) {
        this.$emit('del', item)
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

.search-list
  .search-item
    display: flex
    align-items: center
    height: 40px
    &.list-enter-active,&.list-leave-active
      transition: all 0.4s
    &.list-enter,&.list-leave-to
      opacity: 0
      height: 0
    .text
      flex: 1
      color: $color-text-l
    .icon
      extend-click()
      .icon-delete
        font-size: $font-size-small
        color: $color-text-d
</style>
