import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import CloseIcon from "@mui/icons-material/Close";
import "./PopupModals.css";

const PopupModals = ({
  modalBody,
  isOpen,
  setIsOpen,
  width = undefined,
  title = "",
}) => {
  const closeDialog = () => {
    setIsOpen(false);
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="dialogWrapper" onClose={closeDialog}>
        <Transition.Child
          as={Fragment}
          enter="dialogOverlay enter"
          enterTo="dialogOverlay enter-to"
          leave="dialogOverlay leave"
          leaveTo="dialogOverlay leave-to"
        >
          <div className="dialogOverlay" />
        </Transition.Child>

        <div className="dialogContainer">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="dialogPanel enter"
              enterTo="dialogPanel enter-to"
              leave="dialogPanel leave"
              leaveTo="dialogPanel leave-to"
            >
              <Dialog.Panel className="dialogPanel">
                <Dialog.Title className="dialogTitle">
                  <h2>{title}</h2>
                  <CloseIcon className="closeIcons" onClick={closeDialog} />
                </Dialog.Title>
                <div>{modalBody}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PopupModals;
