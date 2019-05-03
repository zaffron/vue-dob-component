<template>
  <div class="vue-dob-component">
    <div
      :style="{ flex: proportions[0] }"
      class="day">
      <label
        :class="labelClass"
        for="day"
        v-if="showLabels !== 'false'">
        {{ labels[0] }}
      </label>

      <select
        :class="dayClass"
        @blur="onBlur"
        @focus="onFocus"
        v-model="day">
        <option
          disabled="disabled"
          v-if="placeholders[0]"
          value="null">
          {{ placeholders[0] }}
        </option>
        <option
          :value="index + 1"
          :key="index"
          v-for="(item, index) in new Array(28)">
          {{ index + 1 }}
        </option>
        <option
          value="29"
          v-if="daysInMonth >= 29 || isLeapYear">
          29
        </option>
        <option
          value="30"
          v-if="daysInMonth >= 30">
          30
        </option>
        <option
          value="31"
          v-if="daysInMonth >= 31">
          31
        </option>
      </select>
    </div>

    <div
      :style="{ flex: proportions[1] }"
      class="month">
      <label
        :class="labelClass"
        for="month"
        v-if="showLabels !== 'false'">
        {{ labels[1] }}
      </label>
      <select
        :class="monthClass"
        @blur="onBlur"
        @focus="onFocus"
        v-model="month">
        <option
          v-if="placeholders[1]"
          value="null"
          disabled="disabled">
          {{ placeholders[1] }}
        </option>
        <option
          v-for="(item, index) in new Array(12)"
          :key="index"
          :value="index">
          {{ getDisplayedMonth(index) }}
        </option>
      </select>
    </div>

    <div
      :style="{ flex: proportions[2] }"
      class="year">
      <label
        :class="labelClass"
        for="year"
        v-if="showLabels !== 'false'">
        {{ labels[2] }}
      </label>
      <select
        :class="yearClass"
        @blur="onBlur"
        @focus="onFocus"
        v-model="year">
        <option
          disabled="disabled"
          v-if="placeholders[2]"
          value="null">
          {{ placeholders[2] }}
        </option>
        <option
          :key="index"
          :value="currentYear - index"
          v-for="(item, index) in new Array(100)">
          {{ currentYear - index }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
const datesInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export default {
  computed: {
    date: {
      get () {
        let daysInMonth = this.daysInMonth;
        if (this.isLeapYear && this.month === 1) {
          daysInMonth += 1;
        }
        if (this.day > daysInMonth) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.day = null;
        }
        if (this.day !== null && this.month !== null && this.year !== null) {
          return new Date(this.year, this.month, this.day, 0, 0, 0, 0);
        }

        return null;
      },
      set (date) {
        if (date) {
          this.day = date.getDate();
          this.month = date.getMonth();
          this.year = date.getFullYear();
        }
      },
    },
    daysInMonth () {
      return datesInMonths[this.month] || 31;
    },
    isLeapYear () {
      return ((this.year % 4 === 0) && (this.year % 100 !== 0)) || (this.year % 400 === 0);
    },
    dayClass () {
      if (this.selectPlaceholderClass && this.day === null) {
        return this.selectPlaceholderClass;
      }
      return this.selectClass;
    },
    monthClass() {
      if (this.selectPlaceholderClass && this.month === null) {
        return this.selectPlaceholderClass;
      }
      return this.selectClass;
    },
    yearClass () {
      if (this.selectPlaceholderClass && this.year === null) {
        return this.selectPlaceholderClass;
      }
      return this.selectClass;
    },
  },

  created() {
    this.date = this.value;
  },

  data() {
    return {
      blurTimeout: null,
      currentYear: (new Date()).getFullYear(),
      day: null,
      month: null,
      year: null,
    };
  },

  methods: {
    getDisplayedMonth(monthNum) {
      const monthDateObj = new Date(2000, monthNum, 1);
      const locale = this.locale || navigator.language;
      return monthDateObj.toLocaleString(locale, { month: this.monthFormat });
    },
    onBlur() {
      this.blurTimeout = window.setTimeout(() => {
        this.$emit('blur');
      }, 50);
    },
    onFocus() {
      window.clearTimeout(this.blurTimeout);
    },
  },

  name: 'vue-dob-component',

  props: {
    value: {
      type: Date,
    },
    selectClass: String,
    selectPlaceholderClass: String,
    labelClass: String,
    showLabels: String,
    locale: {
      type: String,
      default: navigator.language,
    },
    monthFormat: {
      type: String,
      default: '2-digit',
    },
    proportions: {
      type: Array,
      default: () => [1, 1, 2],
    },
    labels: {
      type: Array,
      default: () => ['Date', 'Month', 'Year'],
    },
    placeholders: {
      type: Array,
      default: () => [],
    },
  },

  watch: {
    date () {
      if (this.date) {
        this.$emit('input', this.date);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.vue-dob-component {
  display: flex;
  label {
    display: inline-block;
    padding: 0 4px;
  }
  label:first-child {
    padding-left: 0;
  }
  label:last-child {
    padding-right: 0;
  }
  select {
    width: 100%;
  }
}
</style>
