<!-- Прокручиваемая облась -->
<template>
  <div
    class="scroll-area"
    @wheel="wheelScroll"
  >
    <div
      class="scroll-area__content"
      :style="{
        top: `${-y}px`,
        left: `${-x}px`
      }"
    >
      <slot/>
    </div>
    <div
      v-if="containerHeight < contentHeight"
      class="scroll-area__vertical-scrollbar"
      @mousedown="clickScroll($event, 'vertical')"
      :style="{
        height: `${containerHeight}px`,
        opacity: scrolling == 'vertical' || highlighting.vertical ? 1 : undefined
      }"
    >
      <div
        class="scroll-area__vertical-scrollbar-slider"
        :style="{
          height: `${verticalScrollbarHeight}px`,
          top: `${verticalScrollbarOffset}px`
        }"
      />
    </div>
    <div
      v-if="containerWidth < contentWidth"
      class="scroll-area__horizontal-scrollbar"
      @mousedown="clickScroll($event, 'horizontal')"
      :style="{
        width: `${containerWidth}px`,
        opacity: scrolling == 'horizontal' || highlighting.horizontal ? 1 : undefined
      }"
    >
      <div
        class="scroll-area__horizontal-scrollbar-slider"
        :style="{
          width: `${horizontalScrollbarWidth}px`,
          left: `${horizontalScrollbarOffset}px`
        }"
      />
    </div>
  </div>
</template>

<script>
// Количество прокручиваемых за раз пикселей
const SCROLLING_RATE = 30;

export default {
  name: 'ScrollArea',
  data() {
    return {
      // Прокрутка по X
      x: 0,
      // Прокрутка по Y
      y: 0,
      // Размеры контейнера
      containerHeight: 0,
      containerWidth: 0,
      // Размеры контента
      contentHeight: 0,
      contentWidth: 0,
      // Тип прокрутки: вертикальная/горизонтальная
      scrolling: null,
      // Вспомогательные параментры при прокрутке передвижением мыши
      startPageCoord: 0,
      startOffset: 0,
      // Принудительная подцветка ползунков
      highlighting: {
        vertical: false,
        horizontal: false
      }
    };
  },
  computed: {
    // Максимальная прокрутка по горизонтали
    maxScrollX() {
      return Math.max(this.contentWidth - this.containerWidth, 0);
    },
    // Максимальная прокрутка по вертикали
    maxScrollY() {
      return Math.max(this.contentHeight - this.containerHeight, 0);
    },
    // Ширина ползунка горизонтального скроллбара
    horizontalScrollbarWidth() {
      return this.containerWidth == 0
        ? 0 
        : Math.pow(this.containerWidth, 2) / this.contentWidth;
    },
    // Смещение ползунка горизонтального скроллбара
    horizontalScrollbarOffset() {
      return this.containerWidth == 0
        ? 0
        : this.x * this.containerWidth / this.contentWidth;
    },
    // Высота ползунка вертикального скроллбара
    verticalScrollbarHeight() {
      return this.containerHeight == 0
        ? 0 
        : Math.pow(this.containerHeight, 2) / this.contentHeight;
    },
    // Смещение ползунка вертикального скроллбара
    verticalScrollbarOffset() {
      return this.containerHeight == 0
        ? 0
        : this.y * this.containerHeight / this.contentHeight;
    }
  },
  methods: {
    // Проверки на прокрутку за пределы области контента
    // Возвращает корректные для указанных входных параметров значения
    checkLimits(x, y) {
      x = x < 0 ? 0 : x;
      y = y < 0 ? 0 : y;

      x = x > this.maxScrollX ? this.maxScrollX : x;
      y = y > this.maxScrollY ? this.maxScrollY : y;

      return {x, y};
    },
    // Прокрутить относительно текущей позиции
    scroll(dx, dy) {
      this.scrollTo(
        this.x + SCROLLING_RATE * (
          dx == 0
            ? 0
            : dx < 0
              ? 1
              : -1
        ),
        this.y + SCROLLING_RATE * (
          dy == 0
            ? 0
            : dy < 0
              ? -1
              : 1
        )
      );
    },
    // Прокрутить в точку (x; y)
    scrollTo(x, y) {
      ({ x: this.x, y: this.y} = this.checkLimits(x, y));
    },
    // Прокрутка при клике по полосе
    clickScroll(ev, type) {
      switch (type) {
        case 'vertical':
          if (ev.target.classList.contains('scroll-area__vertical-scrollbar-slider')) {
            // Клик по полосе
            this.startPageCoord = ev.pageY;
            this.startOffset = this.verticalScrollbarOffset;
            this.scrolling = type;
          } else if (ev.offsetY < this.verticalScrollbarOffset) {
            this.scroll(0, -1) // Прокручиваем вверх
          } else {
            this.scroll(0, 1) // Прокручиваем вниз
          }
          break;
        case 'horizontal':
          if (ev.target.classList.contains('scroll-area__horizontal-scrollbar-slider')) {
            // Клик по полосе
            this.startPageCoord = ev.pageX;
            this.startOffset = this.horizontalScrollbarOffset;
            this.scrolling = type;
          } else if (ev.offsetX < this.horizontalScrollbarOffset) {
            this.scroll(1, 0) // Прокручиваем влево
          } else {
            this.scroll(-1, 0) // Прокручиваем вправо
          }
          break;
      }
    },
    // Прокрутка колёсиком мыши
    wheelScroll(ev) {
      // Подсвечиваем
      if (ev.deltaX) {
        this.highlight('horizontal');
      } else {
        this.highlight('vertical');
      }
      // Прокручиваем
      this.scroll(ev.deltaX, ev.deltaY);
    },
    // Подсвечивает указанную полосу прокрутки
    highlight(type) {
      this.highlighting[type] = true;
      setTimeout(() => this.highlighting[type] = false, 500);
    }
  },
  created() {
    this.$nextTick(() => {
      // Элемент обёртка контента
      let contentContainer = this.$el.firstElementChild;
      let resizer = () => {
        if (this._inactive) {
          // Не обновляем значения размеров контейнеров, если компонент не активен
          return setTimeout(resizer, 1000);
        }
        this.containerWidth = this.$el.clientWidth;
        this.containerHeight = this.$el.clientHeight;
        this.contentWidth = contentContainer.clientWidth;
        this.contentHeight = contentContainer.clientHeight;
        this.scrollTo(this.x, this.y);
        setTimeout(resizer, 100);
      };
      // Наблюдаем за изменениям размеров контейнера и контента
      setTimeout(resizer, 100);
    });
    // Отлавливаем отжатие клавиши мыши глобально
    document.addEventListener('mouseup', event => this.scrolling = null );
    // Аналогично отлавливаем перемещение мыши
    document.addEventListener('mousemove', ev => {
      if (this.scrolling == null)
        return;

      switch (this.scrolling) {
        case 'vertical':
          this.scrollTo(this.x, (this.startOffset + (ev.pageY - this.startPageCoord)) * this.contentHeight / this.containerHeight);
          break;
        case 'horizontal':
          this.scrollTo((this.startOffset + (ev.pageX - this.startPageCoord)) * this.contentWidth / this.containerWidth, this.y);
          break;
      }
    });
  }
}
</script>

<style lang="scss">
// Ширина полос прокрутки
$scrollbarWidth: 5px;

.scroll-area {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.scroll-area__content {
  // transition: top .16s linear,
  //   left .16s linear;
  position: absolute;
}

.scroll-area__vertical-scrollbar {
  top: 0;
  right: 0;
  width: $scrollbarWidth;
}

.scroll-area__horizontal-scrollbar {
  bottom: 0;
  left: 0;
  height: $scrollbarWidth;
}

.scroll-area__vertical-scrollbar-slider {
  width: 100%;
}

.scroll-area__horizontal-scrollbar-slider {
  height: 100%;
}

.scroll-area__vertical-scrollbar,
.scroll-area__horizontal-scrollbar {
  transition: opacity .5s;
  position: absolute;
  border-radius: 5px;
  opacity: 0;
  user-select: none;

  &-slider {
    position: absolute;
    top: 0;
    border-radius: 5px;
    background: rgba(0, 0, 0, .5);
  }

  &:hover {
    opacity: 1;
  }
}
</style>
