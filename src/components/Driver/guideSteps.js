const guideSteps = {
  "/dashboard": (isSmallScreen, isAdmin) => {
    if (isAdmin) {
      // Admin sees all steps
      return [
        {
          element: ".rbc-calendar",
          popover: {
            title: "Meeting Calendar",
            description: "This is the calendar view of meetings and events.",
            position: "bottom",
          },
        },
        {
          element: ".rbc-toolbar",
          popover: {
            title: "Navigation Toolbar",
            description:
              "Use this toolbar to navigate to today, go back, or move forward.",
            position: "middle",
          },
        },
        {
          element: ".rbc-event",
          popover: {
            title: "Meeting/Event",
            description:
              "This indicates a scheduled meeting or event on the calendar.",
            position: "middle",
          },
        },
        {
          element: ".report-component",
          popover: {
            title: "Reports",
            description: "You can see the count of things here.",
            position: "middle",
          },
        },
        {
          element: ".user-report-card",
          popover: {
            title: "Reports",
            description: "Total User Count",
            position: "middle",
          },
        },
        {
          element: ".amenity-report-card",
          popover: {
            title: "Reports",
            description: "Total Amenity Count",
            position: "middle",
          },
        },
        {
          element: ".meeting-report-card",
          popover: {
            title: "Reports",
            description:
              "Total Meeting Count. Click on three dots to see more options.",
            position: "middle",
          },
        },
        {
          element: ".committee-report-card",
          popover: {
            title: "Reports",
            description: "Total Committee Count",
            position: "middle",
          },
        },
        {
          element: ".room-report-card",
          popover: {
            title: "Reports",
            description: "Total Room Count",
            position: "middle",
          },
        },
        {
          element: ".inventory",
          popover: {
            title: "Inventory",
            description:
              "You will see low stock items (items less than 5). You can directly increase or decrease the count from here.",
            position: "middle",
          },
        },
        {
          element: ".inventory-history",
          popover: {
            title: "Inventory History",
            description: "You can view the history of items here.",
            position: "middle",
          },
        },
        {
          element: ".pending-meetings",
          popover: {
            title: "Pending Meetings",
            description: "You can view the list of pending meetings here.",
            position: "middle",
          },
        },
      ];
    } else {
      // Normal user sees only the first three steps
      return [
        {
          element: ".rbc-calendar",
          popover: {
            title: "Meeting Calendar",
            description: "This is the calendar view of meetings and events.",
            position: "bottom",
          },
        },
        {
          element: ".rbc-toolbar",
          popover: {
            title: "Navigation Toolbar",
            description: "Use this toolbar to navigate to today, go back, or move forward.",
            position: "middle",
          },
        },
        {
          element: ".rbc-event",
          popover: {
            title: "Meeting/Event",
            description: "This indicates a scheduled meeting or event on the calendar.",
            position: "middle",
          },
        },
      ];
    }
  },
  "/members": (isSmallScreen, isAdmin) => [
    {
      element: ".page-header .add-user",
      popover: {
        title: "Add a New User",
        description: "Click this button to add a new user to the system.",
        position: "center",
      },
    },
    ...(isSmallScreen
      ? [
        {
          element: ".user-card",
          popover: {
            title: "User Information",
            description:
              "Each card displays user details. Use the icons to view, edit, or delete users.",
            position: "top",
          },
        },
        {
          element: ".user-card .view-button",
          popover: {
            title: "View User",
            description:
              "Click here to view detailed information about the user.",
            position: "bottom",
          },
        },
        {
          element: ".user-card .edit-button",
          popover: {
            title: "Edit User",
            description: "Click here to edit the user's information.",
            position: "bottom",
          },
        },
        {
          element: ".user-card .delete-button",
          popover: {
            title: "Delete User",
            description: "Click here to remove this user from the system.",
            position: "bottom",
          },
        },
        {
          element: ".user-card .switch-button",
          popover: {
            title: "Block/Unblock User",
            description: "Toggle this switch to block or unblock the user.",
            position: "bottom",
          },
        },
      ]
      : [
        {
          element: ".MuiDataGrid-root",
          popover: {
            title: "User List",
            description: "Displays all users in a tabular format.",
            position: "top",
          },
        },
        {
          element: ".tour-edit",
          popover: {
            title: "Edit User",
            description: "Click here to modify the user's details.",
            position: "left",
          },
        },
        {
          element: ".tour-view",
          popover: {
            title: "View User",
            description:
              "Click here to see detailed information about the user.",
            position: "left",
          },
        },
        {
          element: ".tour-delete",
          popover: {
            title: "Delete User",
            description: "Click here to remove the user from the list.",
            position: "left",
          },
        },
        {
          element: ".tour-block",
          popover: {
            title: "Block/Unblock User",
            description: "Click to block or unblock the user.",
            position: "left",
          },
        },
        {
          element: ".MuiTablePagination-actions",
          popover: {
            title: "Pagination",
            description: "Click These buttons to move through pages",
            position: "left",
          },
        },
      ]),
  ],
  "/committee": (isSmallScreen, isAdmin) => [
    {
      element: ".add-committee",
      popover: {
        title: "Add a New Committee",
        description: "Click this button to create a new committee.",
        position: "bottom",
      },
    },
    {
      element: ".go-to-committee-type",
      popover: {
        title: "Switch To Committee Type Tab",
        description: "List of Committee Type.",
        position: "bottom",
      },
    },
    {
      element: ".committee-filter",
      popover: {
        title: "Filter Committees",
        description: "Filter committees based on active or inactive status.",
        position: "bottom",
      },
    },
    ...(isSmallScreen
      ? [
        {
          element: ".committee-card",
          popover: {
            title: "Committee Details",
            description:
              "Each card displays committee details. Use the icons to view, edit, or delete.",
            position: "top",
          },
        },
        {
          element: ".committee-card .committee-delete",
          popover: {
            title: "Delete Committee",
            description: "Click here to remove this committee.",
            position: "bottom",
          },
        },
        {
          element: ".committee-card .committee-edit",
          popover: {
            title: "Edit Committee",
            description: "Click here to update the committee's information.",
            position: "bottom",
          },
        },
        {
          element: ".committee-card .committee-view",
          popover: {
            title: "View Committee",
            description: "Click here to view detailed committee information.",
            position: "bottom",
          },
        },
        {
          element: ".committee-card .committee-switch",
          popover: {
            title: "Activate/Deactivate Committee",
            description:
              "Toggle this switch to activate or deactivate the committee.",
            position: "bottom",
          },
        },
      ]
      : [
        {
          element: ".MuiDataGrid-root",
          popover: {
            title: "Committee List",
            description: "Displays all committees in a tabular format.",
            position: "top",
          },
        },
        {
          element: ".committee-delete",
          popover: {
            title: "Delete Committee",
            description: "Click here to remove this committee.",
            position: "left",
          },
        },
        {
          element: ".committee-edit",
          popover: {
            title: "Edit Committee",
            description: "Click here to modify committee details.",
            position: "left",
          },
        },
        {
          element: ".MuiSwitch-root",
          popover: {
            title: "Activate/Deactivate Committee",
            description:
              "Use this switch to activate or deactivate the committee.",
            position: "left",
          },
        },
        {
          element: ".committee-view",
          popover: {
            title: "View Committee",
            description:
              "View detailed information and total members in this committee.",
            position: "left",
          },
        },
        {
          element: ".MuiTablePagination-actions",
          popover: {
            title: "Pagination Controls",
            description: "Navigate between pages of the committee list.",
            position: "bottom",
          },
        },
      ]),
  ],
  "/my-committee": (isSmallScreen, isAdmin) => [
    {
      element: ".my-committee-filter",
      popover: {
        title: "Filter Committees",
        description: "Filter committees based on active or inactive status.",
        position: "bottom",
      },
    },

    {
      element: ".my-committee-card",
      popover: {
        title: "Committee Details",
        description:
          "Each card displays committee details. Use the icon to view committee member list",
        position: "top",
      },
    },
    {
      element: ".my-committee-card .my-committee-view",
      popover: {
        title: "View Committee",
        description: "Click here to view detailed committee information.",
        position: "bottom",
      },
    },
  ],
  "/committee-type": (isSmallScreen, isAdmin) => [
    {
      element: ".add-committeeType",
      popover: {
        title: "Add a New Committee Type",
        description: "Click this button to create a new committee.",
        position: "bottom",
      },
    },
    {
      element: ".go-to-committee",
      popover: {
        title: "Switch To Committee Tab",
        description: "List of Committee.",
        position: "bottom",
      },
    },
    ...(isSmallScreen
      ? [
        {
          element: ".committee-type-card",
          popover: {
            title: "Committee Type Details",
            description:
              "Each card displays committee details. Use the icons to view, edit, or delete.",
            position: "top",
          },
        },
        {
          element: ".committee-type-card .committee-type-delete",
          popover: {
            title: "Delete Committee Type",
            description: "Click here to remove this committee.",
            position: "bottom",
          },
        },
        {
          element: ".committee-type-card .committee-type-edit",
          popover: {
            title: "Edit Committee Type",
            description: "Click here to update the committee's information.",
            position: "bottom",
          },
        },
        {
          element: ".committee-type-card .committee-type-switch",
          popover: {
            title: "Activate/Deactivate Committee Type",
            description:
              "Toggle this switch to activate or deactivate the committee.",
            position: "bottom",
          },
        },
      ]
      : [
        {
          element: ".MuiDataGrid-root",
          popover: {
            title: "Committee Type List",
            description: "Displays all committees in a tabular format.",
            position: "top",
          },
        },
        {
          element: ".committee-type-edit",
          popover: {
            title: "Edit Committee",
            description: "Click here to modify committee details.",
            position: "left",
          },
        },
        {
          element: ".committee-type-delete",
          popover: {
            title: "Delete Committee",
            description: "Click here to remove this committee.",
            position: "left",
          },
        },
        {
          element: ".MuiSwitch-root",
          popover: {
            title: "Activate/Deactivate Committee",
            description:
              "Use this switch to activate or deactivate the committee.",
            position: "left",
          },
        },
        {
          element: ".MuiTablePagination-actions",
          popover: {
            title: "Pagination Controls",
            description: "Navigate between pages of the committee list.",
            position: "bottom",
          },
        },
      ]),
  ],
  "/amenities": (isSmallScreen, isAdmin) => [
    {
      element: ".add-amenity",
      popover: {
        title: "Add Amenity",
        description: "Click this button to add a new amenity.",
        position: "bottom",
      },
    },
    ...(isSmallScreen
      ? [
        {
          element: ".amenity-card",
          popover: {
            title: "Amenity Card",
            description:
              "Each card represents an amenity. Click the icons to view, edit, or delete.",
            position: "top",
          },
        },
        {
          element: ".amenity-card .amenity-edit",
          popover: {
            title: "Edit Amenity",
            description: "Click to modify the details of this amenity.",
            position: "bottom",
          },
        },
        {
          element: ".amenity-card .amenity-delete",
          popover: {
            title: "Delete Amenity",
            description: "Click to remove this amenity.",
            position: "bottom",
          },
        },
        {
          element: ".amenity-card .amenity-switch",
          popover: {
            title: "Toggle Amenity Status",
            description:
              "Use this switch to activate or deactivate the amenity.",
            position: "bottom",
          },
        },
      ]
      : [
        {
          element: ".MuiDataGrid-root",
          popover: {
            title: "Amenity List",
            description: "View all amenities in a structured list format.",
            position: "top",
          },
        },
        {
          element: ".amenity-edit",
          popover: {
            title: "Edit Amenity",
            description: "Click to modify this amenity's details.",
            position: "left",
          },
        },
        {
          element: ".amenity-delete",
          popover: {
            title: "Delete Amenity",
            description: "Click to remove this amenity from the list.",
            position: "left",
          },
        },
        {
          element: ".MuiSwitch-root",
          popover: {
            title: "Toggle Amenity Status",
            description:
              "Activate or deactivate the amenity using this switch.",
            position: "left",
          },
        },
        {
          element: ".MuiTablePagination-actions",
          popover: {
            title: "Pagination Controls",
            description:
              "Navigate through the list of amenities using these controls.",
            position: "bottom",
          },
        },
      ]),
  ],
  "/rooms": (isSmallScreen, isAdmin) => {
    // Start with an empty steps array
    const steps = [];

    // Always add the small screen (or normal screen) filter step first
    if (isSmallScreen) {
      steps.push({
        element: ".room-filter-responsive",
        popover: {
          title: "Filter Rooms",
          description: "Apply filters to view specific rooms.",
          position: "bottom",
        },
      });
    } else {
      steps.push({
        element: ".room-filter",
        popover: {
          title: "Filter Rooms",
          description: "Use these options to filter rooms in the list.",
          position: "bottom",
        },
      });
    }
    if (isAdmin) {
      steps.push(
        {
          element: ".add-room",
          popover: {
            title: "Add Room",
            description: "Click this button to add a new room.",
            position: "bottom",
          },
        },
        {
          element: ".room-card",
          popover: {
            title: "Room Card",
            description:
              "Each card displays details of a room. Use the icons to view, edit, or manage the room.",
            position: "top",
          },
        },
        {
          element: ".room-card .room-sanitation",
          popover: {
            title: "Sanitation Status",
            description: "Update the sanitation status for this room.",
            position: "bottom",
          },
        },
        {
          element: ".room-card .room-view",
          popover: {
            title: "View Room Details",
            description: "Click to view more information about this room.",
            position: "bottom",
          },
        },
        {
          element: ".room-card .room-gallery",
          popover: {
            title: "Manage Gallery",
            description: "Update or view the room's photo gallery.",
            position: "bottom",
          },
        },
        {
          element: ".room-card .room-amenities",
          popover: {
            title: "Manage Amenities",
            description: "View or update the amenities for this room.",
            position: "bottom",
          },
        },
        {
          element: ".room-card .room-food",
          popover: {
            title: "Food Preferences",
            description: "View or modify food preferences for the room.",
            position: "bottom",
          },
        },
        {
          element: ".room-card .room-barcode",
          popover: {
            title: "Room Barcode",
            description: "Scan or manage the barcode for this room.",
            position: "bottom",
          },
        },
        {
          element: ".room-card .room-edit",
          popover: {
            title: "Edit Room",
            description: "Click to modify this room's details.",
            position: "bottom",
          },
        },
        {
          element: ".room-card .room-delete",
          popover: {
            title: "Delete Room",
            description: "Click to remove this room from the system.",
            position: "bottom",
          },
        },
      );
    } else {
      // Normal user: only add the common steps
      steps.push(
        {
          element: ".room-card .room-user-view",
          popover: {
            title: "View User Details",
            description: "See information about users assigned to this room.",
            position: "bottom",
          },
        },
        {
          element: ".room-card .room-user-book-now",
          popover: {
            title: "Book Room",
            description: "Quickly book this room for a user.",
            position: "bottom",
          },
        }
      );
    }

    return steps;
  },
  "/location": (isSmallScreen, isAdmin) => [
    {
      element: ".add-location",
      popover: {
        title: "Add Location",
        description: "Click this button to add a new location.",
        position: "bottom",
      },
    },
    ...(isSmallScreen
      ? [
        {
          element: ".location-card",
          popover: {
            title: "Location Card",
            description:
              "Each card displays details of a location. Use the icons to view, edit, or delete.",
            position: "top",
          },
        },
        {
          element: ".location-card .location-edit",
          popover: {
            title: "Edit Location",
            description: "Click to update the details of this location.",
            position: "bottom",
          },
        },
        {
          element: ".location-card .location-delete",
          popover: {
            title: "Delete Location",
            description: "Click to remove this location.",
            position: "bottom",
          },
        },
        {
          element: ".MuiSwitch-root",
          popover: {
            title: "Activate/Deactivate Location",
            description:
              "Use this switch to activate or deactivate the Location.",
            position: "left",
          },
        },
      ]
      : [
        {
          element: ".MuiDataGrid-root",
          popover: {
            title: "Location List",
            description: "View all locations in a tabular format.",
            position: "top",
          },
        },
        {
          element: ".location-edit",
          popover: {
            title: "Edit Location",
            description: "Click to modify the location's details.",
            position: "left",
          },
        },
        {
          element: ".location-delete",
          popover: {
            title: "Delete Location",
            description: "Click to delete this location from the list.",
            position: "left",
          },
        },
        {
          element: ".MuiSwitch-root",
          popover: {
            title: "Activate/Deactivate Location",
            description:
              "Use this switch to activate or deactivate the Location.",
            position: "left",
          },
        },
        {
          element: ".MuiTablePagination-actions",
          popover: {
            title: "Pagination Controls",
            description:
              "Navigate through the list of locations using these controls.",
            position: "bottom",
          },
        },
      ]),
  ],
  "/food-beverages": (isSmallScreen, isAdmin) => [
    {
      element: ".add-food",
      popover: {
        title: "Add Food or Beverage",
        description: "Click this button to add a new food or beverage item.",
        position: "bottom",
      },
    },
    ...(isSmallScreen
      ? [
        {
          element: ".food-card",
          popover: {
            title: "Food or Beverage Card",
            description:
              "Each card displays a food or beverage item. Use the icons to view, edit, or delete.",
            position: "top",
          },
        },
        {
          element: ".food-card .food-edit",
          popover: {
            title: "Edit Item",
            description:
              "Click to update the details of this food or beverage item.",
            position: "bottom",
          },
        },
        {
          element: ".food-card .food-delete",
          popover: {
            title: "Delete Item",
            description: "Click to remove this item from the list.",
            position: "bottom",
          },
        },
        {
          element: ".MuiSwitch-root",
          popover: {
            title: "Activate/Deactivate Food or Beverage",
            description:
              "Use this switch to activate or deactivate the Food or Beverage.",
            position: "left",
          },
        },
      ]
      : [
        {
          element: ".MuiDataGrid-root",
          popover: {
            title: "Food and Beverage List",
            description:
              "View all food and beverage items in a tabular format.",
            position: "top",
          },
        },
        {
          element: ".food-edit",
          popover: {
            title: "Edit Item",
            description: "Click to modify the details of this item.",
            position: "left",
          },
        },
        {
          element: ".food-delete",
          popover: {
            title: "Delete Item",
            description: "Click to delete this item from the list.",
            position: "left",
          },
        },
        {
          element: ".MuiSwitch-root",
          popover: {
            title: "Activate/Deactivate Food or Beverage",
            description:
              "Use this switch to activate or deactivate the Food or Beverage.",
            position: "left",
          },
        },
        {
          element: ".MuiTablePagination-actions",
          popover: {
            title: "Pagination Controls",
            description:
              "Navigate through the list of items using these controls.",
            position: "bottom",
          },
        },
      ]),
  ],
  "/user-role": (isSmallScreen, isAdmin) => [
    {
      element: ".add-user-role",
      popover: {
        title: "Add New User Role",
        description: "Click this button to add a new user role.",
        position: "bottom",
      },
    },
    {
      element: ".MuiDataGrid-root",
      popover: {
        title: "User Role List",
        description:
          "View all User Role items in a tabular format.",
        position: "top",
      },
    },
    {
      element: ".user-role-edit",
      popover: {
        title: "Edit Item",
        description: "Click to modify the details of this role.",
        position: "left",
      },
    },
    {
      element: ".user-role-delete",
      popover: {
        title: "Delete Item",
        description: "Click to delete this role from the list.",
        position: "left",
      },
    },
    {
      element: ".MuiSwitch-root",
      popover: {
        title: "Activate/Deactivate User Role",
        description:
          "Use this switch to activate or deactivate the User Role.",
        position: "left",
      },
    },
    {
      element: ".MuiTablePagination-actions",
      popover: {
        title: "Pagination Controls",
        description:
          "Navigate through the list of items using these controls.",
        position: "bottom",
      },
    },
  ],
  "/logs": (isSmallScreen, isAdmin) => [
    {
      element: ".MuiDataGrid-root",
      popover: {
        title: "Logs Table",
        description:
          "View all logs in a tabular format for better insights.",
        position: "top",
      },
    },
    {
      element: ".meeting-logs-edit",
      popover: {
        title: "Edit Meeting",
        description: "Click to Edit the meeting.",
        position: "left",
      },
    },
    {
      element: ".meeting-logs-postpone",
      popover: {
        title: "Postpone Meeting",
        description: "Click to Postpone the meeting.",
        position: "left",
      },
    },
    {
      element: ".meeting-logs-swap",
      popover: {
        title: "Swap Meeting",
        description: "Click to Swap the meeting.",
        position: "left",
      },
    },
    {
      element: ".meeting-logs-cancel",
      popover: {
        title: "Cancel Meeting",
        description: "Click to Cancel the meeting.",
        position: "left",
      },
    },
    {
      element: ".meeting-logs-approve",
      popover: {
        title: "Approve Meeting",
        description: "Click to Approve the meeting.",
        position: "left",
      },
    },
    {
      element: ".MuiTablePagination-actions",
      popover: {
        title: "Pagination Controls",
        description:
          "Navigate through the log entries using these controls.",
        position: "bottom",
      },
    },
  ],
};

export default guideSteps;
