export default {
  afterMount() {
    this.interval = setInterval(() => {
      this.$set('time', new Date());
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  model: {
    interval: null,
    time: new Date(),
    get hours() {
      return this.time.getHours();
    },
    get minutes() {
      return this.time.getMinutes();
    },
    get seconds() {
      return this.time.getSeconds();
    }
  }
};