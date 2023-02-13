import {
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
} from "@hope-ui/solid";

const CustomInput = ({
  size = "md",
  placeholder = "",
  onChange,
  type = "text",
}) => {
  return (
    <Input
      type={type}
      onkeyup={onChange}
      variant="outline"
      size={size}
      placeholder={placeholder}
    />
  );
};

export default CustomInput;
