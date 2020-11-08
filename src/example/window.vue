<template>
  <div >
    <theone-window
      :is-loading="false"
      @close="close"
      title="theone-window2"
      :show="true"
      style="left: 500px; top: 100px; width: 500px; height: 500px"
    >
      <div slot="body">
        <theone-button type="warning">警告按钮</theone-button>
        <theone-button type="danger">危险按钮</theone-button>
      </div>
    </theone-window>
    <theone-window
      id="test-window"
      :is-loading="false"
      @close="close"
      title="theone-window"
      :show="true"
      style="left: 500px; top: 100px; width: 500px; height: 500px"
    >
      <div slot="body">
        <theone-button></theone-button>
        <theone-button type="primary">主要按钮</theone-button>
        <theone-button type="success">成功按钮</theone-button>
      </div>
    </theone-window>

    
  </div>
</template>

<script>
export default {
  name: 'test-window',
  components: {},
  data() {
    return {
    }
  },
  methods: {
      close(){}
  },
}
</script>

<style>

</style>
