import { defineComponent, ref, onMounted, onUpdated, h, VNode } from "vue";
import { onKeyPressed } from "@vueuse/core";
import { ArrowLeft, ArrowRight, ThreePointLeader } from "../../icons.index";
import { SimpleIcon } from "../SimpleIcon";
import "./SimplePagination.scss";

export default defineComponent({
  props: {
    length: {
      type: Number,
      required: true,
    },
    current: {
      type: Number,
      required: true,
    },
    suffix: {
      type: String,
      default: undefined,
      required: false,
    },
  },
  setup(props, context) {
    const handlePreviousPage = () => {
      if (props.current > 0) {
        context.emit("previous");
      }
    };
    const handleNextPage = () => {
      if (props.current < props.length - 1) {
        context.emit("next");
      }
    };
    const enteredItem = ref<number | null>();
    const mouseenter = (index: number) => {
      enteredItem.value = index;
    };
    const mouseleave = () => {
      enteredItem.value = null;
    };
    const isHovered = (index: number) => {
      return enteredItem.value === index;
    };
    const handleChange = (index: number) => {
      context.emit("change", index);
    };
    const isSelected = (index: number) => {
      return props.current === index;
    };
    onKeyPressed(["j", "J", "ArrowLeft"], () => handlePreviousPage());
    onKeyPressed(["k", "K", "ArrowRight"], () => handleNextPage());
    const toIndex = (index: number): number => {
      if (props.current < 4) {
        return index + 1;
      } else if (props.current > props.length - 5) {
        return props.length - 4 + index;
      } else {
        return props.current - 1 + index;
      }
    };
    const previousPageActivator = ref<HTMLElement | null>(null);
    const nextPageActivator = ref<HTMLElement | null>(null);
    // @ts-ignore
    const refs = context.refs;
    onMounted(() => {
      if (!isVue3) {
        previousPageActivator.value = refs.previousPageActivator;
        nextPageActivator.value = refs.nextPageActivator;
      }
    });
    onUpdated(() => {
      if (!isVue3) {
        previousPageActivator.value = refs.previousPageActivator;
        nextPageActivator.value = refs.nextPageActivator;
      }
    });
    const previousButtonHovered = ref(false);
    const nextButtonHovered = ref(false);
    let previousHoverTimerId: any;
    const previousEnter = async () => {
      previousHoverTimerId = setTimeout(() => {
        previousButtonHovered.value = true;
      }, 1000);
    };
    const previousLeave = () => {
      clearTimeout(previousHoverTimerId);
      previousButtonHovered.value = false;
    };
    let nextHoverTimerId: any;
    const nextEnter = async () => {
      nextHoverTimerId = setTimeout(() => {
        nextButtonHovered.value = true;
      }, 1000);
    };
    const nextLeave = () => {
      clearTimeout(nextHoverTimerId);
      nextButtonHovered.value = false;
    };
    const pagesNode = (): VNode[] => {
      if (props.length <= 7) {
        return [...new Array(props.length).keys()].map((pageIndex) => {
          return h(
            "span",
            {
              class: [
                {
                  simple_pagination__index_text: true,
                  simple_pagination__hovered:
                    isHovered(pageIndex) && !isSelected(pageIndex),
                  simple_pagination__selected: isSelected(pageIndex),
                },
              ],
              onMouseenter: () => mouseenter(pageIndex),
              onMouseleave: mouseleave,
              onClick: () => handleChange(pageIndex),
              on: {
                mouseenter: () => mouseenter(pageIndex),
                mouseleave: mouseleave,
                click: () => handleChange(pageIndex),
              },
            },
            pageIndex + 1
          );
        });
      } else {
        return [
          h(
            "span",
            {
              class: [
                {
                  simple_pagination__index_text: true,
                  simple_pagination__hovered: isHovered(0) && !isSelected(0),
                  simple_pagination__selected: isSelected(0),
                },
              ],
              onMouseenter: () => mouseenter(0),
              onMouseleave: mouseleave,
              onClick: () => handleChange(0),
              on: {
                mouseenter: () => mouseenter(0),
                mouseleave: mouseleave,
                click: () => handleChange(0),
              },
            },
            1
          ),
          h(SimpleIcon, {
            class: [{ simple_pagination__threepoint_leader: true }],
            style: [{ display: props.current > 3 ? "inline" : "none" }],
            source: ThreePointLeader,
            size: "18px",
            fill: "var(--text)",
            props: {
              source: ThreePointLeader,
              size: "18px",
              fill: "var(--text)",
            },
          }),
          ...[0, 1, 2].map((index: number) => {
            return h(
              "span",
              {
                class: [
                  {
                    simple_pagination__index_text: true,
                    simple_pagination__hovered:
                      isHovered(toIndex(index)) && !isSelected(toIndex(index)),
                    simple_pagination__selected: isSelected(toIndex(index)),
                  },
                ],
                onMouseenter: () => mouseenter(toIndex(index)),
                onMouseleave: mouseleave,
                onClick: () => handleChange(toIndex(index)),
                on: {
                  mouseenter: () => mouseenter(toIndex(index)),
                  mouseleave: mouseleave,
                  click: () => handleChange(toIndex(index)),
                },
              },
              toIndex(index) + 1
            );
          }),
          h(SimpleIcon, {
            class: [{ simple_pagination__threepoint_leader: true }],
            style: [
              { display: props.current < props.length - 4 ? "inline" : "none" },
            ],
            source: ThreePointLeader,
            size: "18px",
            fill: "var(--text)",
            props: {
              source: ThreePointLeader,
              size: "18px",
              fill: "var(--text)",
            },
          }),
          h(
            "span",
            {
              class: [
                {
                  simple_pagination__index_text: true,
                  simple_pagination__hovered:
                    isHovered(toIndex(props.length - 1)) &&
                    !isSelected(toIndex(props.length - 1)),
                  simple_pagination__selected: isSelected(props.length - 1),
                },
              ],
              onMouseenter: () => mouseenter(props.length - 1),
              onMouseleave: mouseleave,
              onClick: () => handleChange(props.length - 1),
              on: {
                mouseenter: () => mouseenter(props.length - 1),
                mouseleave: mouseleave,
                click: () => handleChange(props.length - 1),
              },
            },
            props.length
          ),
        ];
      }
    };
    return () =>
      h("div", { class: [{ simple_pagination__container: true }] }, [
        h("div", { class: [{ simple_pagination__flex_box: true }] }, [
          h(
            "div",
            {
              ref: isVue3 ? previousPageActivator : "previousPageActivator",
              style: [{ display: "inline-flex" }],
            },
            [
              h(SimpleIcon, {
                class: [{ simple_pagination__arrow_icons: true }],
                source: ArrowLeft,
                size: "14px",
                fill: "var(--text)",
                clickable: true,
                props: {
                  source: ArrowLeft,
                  size: "14px",
                  fill: "var(--text)",
                  clickable: true,
                },
                onClick: handlePreviousPage,
                onMouseenter: previousEnter,
                onMouseleave: previousLeave,
                on: {
                  click: handlePreviousPage,
                  mouseenter: previousEnter,
                  mouseleave: previousLeave,
                },
              }),
            ]
          ),
          ...pagesNode(),
          h(
            "div",
            {
              ref: isVue3 ? nextPageActivator : "nextPageActivator",
              style: [{ display: "inline-flex" }],
            },
            [
              h(SimpleIcon, {
                class: [{ simple_pagination__arrow_icons: true }],
                source: ArrowRight,
                size: "14px",
                fill: "var(--text)",
                clickable: true,
                props: {
                  source: ArrowRight,
                  size: "14px",
                  fill: "var(--text)",
                  clickable: true,
                },
                onClick: handleNextPage,
                onMouseenter: nextEnter,
                onMouseleave: nextLeave,
                on: {
                  click: handleNextPage,
                  mouseenter: nextEnter,
                  mouseleave: nextLeave,
                },
              }),
            ]
          ),
        ]),
      ]);
  },
});
