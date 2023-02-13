import {
  createDisclosure,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@hope-ui/solid";
import CustomInput from "./CustomInput";
import CustomSelect from "./CustomSelect";

const CustomModal = ({ isOpen, onClose, body, title, size = "md" }) => {
  return (
    <Modal size={size} opened={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{body}</ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
