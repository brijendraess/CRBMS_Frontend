import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import "./PopupModals.css";
import { Typography } from "@mui/material";
import { CloseIcon } from "../../CustomButton/CustomIcon";

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
      <Dialog
        as="div"
        className="dialogWrapper"
        onClose={closeDialog}
        style={{
          height: {
            xs: "300px",
            sm: "500px",
            md: "500px",
            lg: "500px",
            xl: "500px",
          },
        }}
      >
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
                  <Typography
                    variant="h4"
                    component="h4"
                    style={{
                      fontSize: "20px",
                      fontWeight: 400,
                      lineHeight: 1.4,
                      color: " #2E2E2E",
                    }}
                  >
                    {title}
                  </Typography>
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
