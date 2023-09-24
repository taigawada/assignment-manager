import {
  defineComponent,
  ref,
  PropType,
  watchEffect,
  watch,
  onMounted,
  toRefs,
  h,
  onUpdated,
  VNode,
} from "vue";
import { useScroll } from "@vueuse/core";
import "./SimpleSmoothPicker.scss";

export default defineComponent({
  props: {
    items: {
      type: Array as PropType<string[] | number[]>,
      required: true,
    },
    selected: {
      type: [String, Number],
      default: undefined,
      required: false,
    },
    suffix: {
      type: String,
      default: undefined,
      required: false,
    },
    width: {
      type: String,
      default: "80px",
      required: false,
    },
    itemContentHeight: {
      type: Number,
      default: 40,
      required: false,
    },
    distanceToDisplay: {
      type: Number,
      default: 800,
      required: false,
    },
    whichSide: {
      type: String as PropType<"left" | "right" | "center" | undefined>,
      default: undefined,
      required: false,
    },
  },
  setup(props, context) {
    // @ts-ignore
    const refs = context.refs;
    const showInsideItems = ref<(string | number | null)[]>([]);
    const insideContent = ref<HTMLElement | null>(null);
    const { y, isScrolling } = useScroll(insideContent);
    const centerShowIndex = ref<number>(0);
    // propsのitemが更新されると最初と最後にnullが二つずつ挿入される
    watchEffect(() => {
      showInsideItems.value = [null, null, ...props.items, null, null];
    });
    // マウント後、初期値の位置までスクロールする
    onMounted(() => {
      // Vue2環境のみ、mount時にrefを更新
      if (!isVue3) {
        insideContent.value = refs.insideContent;
      }
      const scrollQuantity =
        props.items.findIndex((elm) => props.selected === elm) *
        props.itemContentHeight;
      insideContent.value?.scrollTo(0, scrollQuantity);
    });
    // Vue2環境のみ、update時にrefを更新
    onUpdated(() => {
      if (!isVue3) {
        insideContent.value = refs.insideContent;
      }
    });
    // selectedの値が変わったときに、その時点でスクロールされていなければその位置までスクロールする
    const { selected } = toRefs(props);
    watch(selected, () => {
      const scrollQuantity =
        props.items.findIndex((elm) => props.selected === elm) *
        props.itemContentHeight;
      if (!isScrolling.value) {
        insideContent.value?.scrollTo(0, scrollQuantity);
      }
    });
    // スクロールが行われた時、スクロール量が中心から"5"以内の要素を拾えば、エミットする
    watch(y, () => {
      if (
        y.value % props.itemContentHeight < 15 &&
        y.value > -1 &&
        props.items.length * props.itemContentHeight > y.value
      ) {
        const selectIndex = (y.value / props.itemContentHeight) | 0;
        centerShowIndex.value = selectIndex;
        context.emit("change", props.items[selectIndex]);
      }
    });
    function smoothPickerStyles(ownIndex: number | null) {
      let result = undefined;
      if (ownIndex) {
        result =
          1 -
          Math.abs(y.value - (ownIndex - 2) * props.itemContentHeight) ** 2 /
            (props.itemContentHeight * props.distanceToDisplay);
      }
      let isLeft = true;
      let isRight = true;
      if (props.whichSide === "center") {
        isLeft = false;
        isRight = false;
      } else if (props.whichSide === "left") {
        isLeft = true;
        isRight = false;
      } else if (props.whichSide === "right") {
        isLeft = false;
        isRight = true;
      }
      return {
        "--smooth-picker-content-width": props.width,
        "--smooth-picker-box-height": `calc(${props.itemContentHeight}px * 5)`,
        "--smooth-picker-item-height": props.itemContentHeight + "px",
        "--contraction-ratio": result,
        "--border-left": isLeft ? "7px" : "0",
        "--border-right": isRight ? "7px" : "0",
      };
    }
    const drumRollItems = (): VNode[] =>
      showInsideItems.value.map((item, index) => {
        return h(
          "div",
          {
            class: [
              { simple_picker__calc_scale: true, smooth_picker__item: true },
            ],
            style: [smoothPickerStyles(index)],
          },
          item !== null ? String(item) : undefined
        );
      });
    return () =>
      h(
        "div",
        {
          class: [{ smooth_picker__base: true }],
          style: [smoothPickerStyles(null)],
        },
        [
          h("div", {
            class: [{ smooth_picker__select_rect: true }],
            style: [smoothPickerStyles(null)],
          }),
          h(
            "span",
            { class: [{ smooth_picker__suffix_text: true }] },
            props.suffix
          ),
          h(
            "div",
            {
              ref: isVue3 ? insideContent : "insideContent",
              class: [{ smooth_picker__box: true }],
            },
            [
              h(
                "div",
                { class: [{ smooth_picker__roll: true }] },
                drumRollItems()
              ),
            ]
          ),
        ]
      );
  },
});
