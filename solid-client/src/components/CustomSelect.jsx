import {
  Select,
  SelectTrigger,
  SelectPlaceholder,
  SelectValue,
  SelectTag,
  SelectTagCloseButton,
  SelectIcon,
  SelectContent,
  SelectListbox,
  SelectOptGroup,
  SelectLabel,
  SelectOption,
  SelectOptionText,
  SelectOptionIndicator,
  Avatar,
} from "@hope-ui/solid";

const CustomSelect = ({ options, onChange, placeholder }) => {
  console.log(options());
  return (
    <Select onChange={onChange}>
      <SelectTrigger>
        <SelectPlaceholder>{placeholder}</SelectPlaceholder>
        <SelectValue />
        <SelectIcon />
      </SelectTrigger>
      <SelectContent>
        <SelectListbox>
          <For each={options()}>
            {(item) => {
              return (
                <SelectOption value={item.id}>
                  <div style="display:flex;align-item:center;gap:12px">
                    {item.icon && <Avatar size="sm" src={item.icon} />}
                    <SelectOptionText>{item.name}</SelectOptionText>
                  </div>

                  <SelectOptionIndicator />
                </SelectOption>
              );
            }}
          </For>
        </SelectListbox>
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
