import {
  defineComponent,
  ref,
  PropType,
  onBeforeUpdate,
  onUpdated,
  h,
  VNode,
  onMounted,
} from "vue";
import { SimpleCheckbox } from "../SimpleCheckbox";
import { SimpleSpinner } from "../SimpleSpinner";
import "./SimpleResourceList.scss";
interface ItemClickFunc {
  (arg1: number, arg2: Event): void;
}

interface checkBoxRef {
  $el: HTMLElement;
  handleChange: () => void;
}
export default defineComponent({
  props: {
    items: {
      type: Array as PropType<{ id: string | number }[]>,
      default: () => [],
      required: false,
    },
    select: {
      type: Boolean,
      default: false,
      required: false,
    },
    selectedItems: {
      type: Array as PropType<(string | number)[]>,
      default: () => [],
      required: false,
    },
    loading: {
      type: Boolean,
      required: false,
    },
    height: {
      type: String,
      default: "50px",
      required: false,
    },
    weight: {
      type: Array as PropType<number[]>,
      default: () => [1],
      required: true,
    },
    onClickItem: {
      type: Function as PropType<ItemClickFunc>,
      default: undefined,
      required: false,
    },
  },
  setup(props, context) {
    let checkboxRefs: checkBoxRef[] = [];
    const setItemRef = (el: checkBoxRef) => {
      if (el) {
        checkboxRefs.push(el);
      }
    };
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const itemCheckBoxes = ref<checkBoxRef[]>();
    const bulkMultiActionActivator = ref();
    onBeforeUpdate(() => {
      checkboxRefs = [];
    });
    onUpdated(() => {
      if (!isVue3) {
        // @ts-ignore
        checkboxRefs = context.refs.itemCheckBoxes;
        // @ts-ignore
        bulkMultiActionActivator.value = context.refs.bulkMultiActionActivator;
      }
    });
    onMounted(() => {
      if (!isVue3) {
        // @ts-ignore
        checkboxRefs = context.refs.itemCheckBoxes;
        // @ts-ignore
        bulkMultiActionActivator.value = context.refs.bulkMultiActionActivator;
      }
    });
    const handleClickRow = (index: number, event: Event) => {
      event.stopPropagation();
      // クリックした要素がcheckboxのDOMnodeに含まれていなければ -> checkboxのchangeイベントを発火
      if (props.select) {
        if (checkboxRefs[index]) {
          if (!checkboxRefs[index].$el.contains(event.target as HTMLElement)) {
            if (typeof props.onClickItem === "undefined") {
              checkboxRefs[index].handleChange();
            } else {
              props.onClickItem(index, event);
            }
          }
        }
      } else {
        if (props.onClickItem) {
          props.onClickItem(index, event);
        }
      }
    };
    const bulkCheckBox = ref(false);
    const indeterminateRef = ref(false);
    const handleBulkCheckBoxChange = (bool: boolean) => {
      bulkCheckBox.value = bool;
      let newSelectedItems: (string | number)[] = [];
      if (bool) {
        newSelectedItems = props.items.map((item) => item.id);
      }
      indeterminateRef.value = false;
      context.emit("change", newSelectedItems);
    };
    const isSelected = (id: string | number) => {
      return props.selectedItems.indexOf(id) !== -1;
    };
    const handleItemCheckedChange = (bool: boolean, id: string | number) => {
      const newSelectedItems = [...props.selectedItems];
      if (bool) {
        newSelectedItems.push(id);
      } else {
        newSelectedItems.splice(newSelectedItems.indexOf(id), 1);
      }
      if (props.items.length === newSelectedItems.length) {
        indeterminateRef.value = false;
        bulkCheckBox.value = true;
      } else {
        indeterminateRef.value = true;
      }
      if (newSelectedItems.length === 0) bulkCheckBox.value = false;
      context.emit("change", newSelectedItems);
    };
    const rowStyles = () => ({
      "--child-item-weights": props.weight.map((num) => num + "fr").join(" "),
      "--child-item-height": props.height,
    });
    const SelectedHeaderNode = () => {
      if (props.selectedItems.length !== 0) {
        return h(
          "td",
          { class: [{ simple_resource_list__slot_data_label_wrapper: true }] },
          [
            h(
              "div",
              {
                class: [{ simple_resource_list__header_actions: true }],
              },
              [
                h(
                  "span",
                  {
                    class: [{ simple_resource_list__select_info_text: true }],
                  },
                  props.selectedItems.length + "件のデータを選択中",
                ),
                context.slots.headerActions
                  ? context.slots.headerActions()
                  : undefined,
              ],
            ),
          ],
        );
      } else {
        return h("th", [
          h(
            "div",
            {
              class: [{ simple_resource_list__slot_data: true }],
              style: [rowStyles()],
            },
            context.slots.header ? context.slots.header() : "",
          ),
        ]);
      }
    };
    const headerRowNode = () =>
      h("tr", { class: [{ simple_resource_list__header_row: true }] }, [
        /* eslint-disable */
        props.select
          ? h("th", { class: [{ simple_resource_list__header: true }] }, [
              h(SimpleCheckbox, {
                class: [{ simple_resource_list__checkbox: true }],
                indeterminate: indeterminateRef.value,
                size: "20px",
                value: bulkCheckBox.value,
                props: {
                  indeterminate: indeterminateRef.value,
                  size: "20px",
                  value: bulkCheckBox.value,
                },
                onChange: handleBulkCheckBoxChange,
                on: {
                  change: handleBulkCheckBoxChange,
                },
              }),
            ])
          : undefined,
        /* eslint-enable */
        SelectedHeaderNode(),
      ]);
    const dataRowNode = (): VNode[] =>
      props.items.map((item, index) => {
        return h(
          "tr",
          {
            class: [{ simple_resource_list__row: true }],
            onClick: (event: Event) => handleClickRow(index, event),
            on: {
              click: (event: Event) => handleClickRow(index, event),
            },
          },
          [
            /* eslint-disable */
            props.select
              ? h(
                  "td",
                  { class: [{ simple_resource_list__check_column: true }] },
                  [
                    // @ts-ignore (todo -> 型エラーの原因探す)
                    h(SimpleCheckbox, {
                      key: item.id,
                      ref: isVue3 ? setItemRef : "itemCheckBoxes",
                      refInFor: true,
                      class: [{ simple_resource_list__checkbox: true }],
                      value: isSelected(item.id),
                      size: "20px",
                      props: {
                        value: isSelected(item.id),
                        size: "20px",
                      },
                      onChange: (bool: boolean) =>
                        handleItemCheckedChange(bool, item.id),
                      on: {
                        change: (bool: boolean) =>
                          handleItemCheckedChange(bool, item.id),
                      },
                    }),
                  ],
                )
              : undefined,
            /* eslint-enable */
            h(
              "td",
              {
                class: [{ simple_resource_list__slot_data: true }],
                style: [rowStyles()],
              },
              /* eslint-disable */
              context.slots.data
                ? context.slots.data({
                    class: [{ simple_resource_list__slot: true }],
                    item: item,
                    props: { item: item },
                  })
                : undefined,
              /* eslint-enable */
            ),
          ],
        );
      });
    const tableNode = () =>
      h("table", { class: [{ simple_resource_list__base: true }] }, [
        headerRowNode(),
        /* eslint-disable */
        props.loading
          ? h("div", { class: [{ simple_resource_list__loading_bar: true }] }, [
              h(SimpleSpinner, {
                class: [{ simple_resource_list__loading_spinner: true }],
                size: "tiny",
                color: [0, 150, 138],
                props: { size: "tiny", color: [0, 150, 138] },
              }),
              h(
                "span",
                { style: [{ fontSize: "13px", color: "var(--text-black)" }] },
                "提出物を読み込んでいます...",
              ),
            ])
          : undefined,
        /* eslint-enable */
        dataRowNode(),
      ]);
    return () =>
      h("div", { class: [{ simple_resource_list__container: true }] }, [
        tableNode(),

        h("div", { class: [{ padding__elemet: true }] }),
        context.slots.pagination ? context.slots.pagination() : undefined,
      ]);
  },
});
