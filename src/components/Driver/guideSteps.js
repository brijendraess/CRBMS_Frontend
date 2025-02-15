const guideSteps = {
  "/dashboard": (isSmallScreen, isAdmin) => {
    if (isAdmin) {
      // Admin sees all steps
      return [
        {
          element: ".rbc-calendar",
          popover: {
            title: "Meeting Calendar",
            description: "View all scheduled meetings and events in a structured calendar format. Stay organized and easily navigate through upcoming engagements.",
            position: "bottom",
          },
        },
        {
          element: ".rbc-toolbar",
          popover: {
            title: "Navigation Toolbar",
            description:
              "Use the navigation toolbar to quickly jump to today’s date, move between previous and upcoming dates, and adjust your calendar view.",
            position: "middle",
          },
        },
        {
          element: ".rbc-event",
          popover: {
            title: "Meeting/Event",
            description:
              "Represents a scheduled meeting or event. Click to view details or make updates.",
            position: "middle",
          },
        },
        {
          element: ".report-component",
          popover: {
            title: "Reports",
            description: "This section displays the total count of items.",
            position: "middle",
          },
        },
        {
          element: ".user-report-card",
          popover: {
            title: "Reports",
            description: "Displays the total number of users. Provides insights into user activity and engagement.",
            position: "middle",
          },
        },
        {
          element: ".amenity-report-card",
          popover: {
            title: "Reports",
            description: "Shows the total number of amenities available. Helps track and manage facility usage.",
            position: "middle",
          },
        },
        {
          element: ".meeting-report-card",
          popover: {
            title: "Reports",
            description:
              "Displays the total number of meetings. Click the three dots for additional options and actions.",
            position: "middle",
          },
        },
        {
          element: ".committee-report-card",
          popover: {
            title: "Reports",
            description: "Shows the total number of committees. Helps monitor and manage committee activities.",
            position: "middle",
          },
        },
        {
          element: ".room-report-card",
          popover: {
            title: "Reports",
            description: "Displays the total number of rooms available. Helps in tracking and managing room allocations.",
            position: "middle",
          },
        },
        {
          element: ".inventory",
          popover: {
            title: "Inventory",
            description:
              "Here, you can see low-stock items (those with fewer than 5 units). You can directly increase or decrease the count from this section.",
            position: "middle",
          },
        },
        {
          element: ".inventory-history",
          popover: {
            title: "Inventory History",
            description: "View the complete history of inventory items, including updates and changes over time.",
            position: "middle",
          },
        },
        {
          element: ".pending-meetings",
          popover: {
            title: "Pending Meetings",
            description: "View and manage the list of pending meetings awaiting approval or action.",
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
            description: "View all scheduled meetings and events in a structured calendar format. Stay organized and easily navigate through upcoming engagements.",
            position: "bottom",
          },
        },
        {
          element: ".rbc-toolbar",
          popover: {
            title: "Navigation Toolbar",
            description: "Use the navigation toolbar to quickly jump to today’s date, move between previous and upcoming dates, and adjust your calendar view.",
            position: "middle",
          },
        },
        {
          element: ".rbc-event",
          popover: {
            title: "Meeting/Event",
            description: "Represents a scheduled meeting or event. Click to view details or make updates.",
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
        description: "Click to add a new user to the system. Provide necessary details to complete the registration.",
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
              "Displays user details at a glance. Use the available icons to view, edit, or remove users.",
            position: "top",
          },
        },
        {
          element: ".user-card .view-button",
          popover: {
            title: "View User",
            description:
              "Click to access detailed information about this user.",
            position: "bottom",
          },
        },
        {
          element: ".user-card .edit-button",
          popover: {
            title: "Edit User",
            description: "Click to update the user's details and settings.",
            position: "bottom",
          },
        },
        {
          element: ".user-card .delete-button",
          popover: {
            title: "Delete User",
            description: "Click to permanently remove this user from the system.",
            position: "bottom",
          },
        },
        {
          element: ".user-card .switch-button",
          popover: {
            title: "Block/Unblock User",
            description: "Toggle to restrict or restore the user's access.",
            position: "bottom",
          },
        },
      ]
      : [
        {
          element: ".MuiDataGrid-root",
          popover: {
            title: "User List",
            description: "Displays all users in a structured table for easy management and navigation.",
            position: "top",
          },
        },
        {
          element: ".tour-edit",
          popover: {
            title: "Edit User",
            description: "Click to modify the user's details and update their information.",
            position: "left",
          },
        },
        {
          element: ".tour-view",
          popover: {
            title: "View User",
            description:
              "Click to see a detailed profile and activity of the user",
            position: "left",
          },
        },
        {
          element: ".tour-delete",
          popover: {
            title: "Delete User",
            description: "Click to remove this user permanently from the system.",
            position: "left",
          },
        },
        {
          element: ".tour-block",
          popover: {
            title: "Block/Unblock User",
            description: "Click to restrict or restore the user's access.",
            position: "left",
          },
        },
        {
          element: ".MuiTablePagination-actions",
          popover: {
            title: "Pagination",
            description: "Use these controls to navigate between pages of user records.",
            position: "left",
          },
        },
      ]),
  ],
  "/committee": (isSmallScreen, isAdmin) => [
    {
      element: ".add-committee",
      popover: {
        title: "Create a New Committee",
        description: "Click to create a new committee and define its details.",
        position: "bottom",
      },
    },
    {
      element: ".go-to-committee-type",
      popover: {
        title: "Committee Type Tab",
        description: "View the list of different committee types available.",
        position: "bottom",
      },
    },
    {
      element: ".committee-filter",
      popover: {
        title: "Committee Filter",
        description: "Filter committees based on their active or inactive status.",
        position: "bottom",
      },
    },
    ...(isSmallScreen
      ? [
        {
          element: ".committee-card",
          popover: {
            title: "Committee Overview",
            description:
              "Displays key committee information. Use the icons to view, edit, or delete.",
            position: "top",
          },
        },
        {
          element: ".committee-card .committee-delete",
          popover: {
            title: "Remove Committee",
            description: "Click to permanently remove this committee.",
            position: "bottom",
          },
        },
        {
          element: ".committee-card .committee-edit",
          popover: {
            title: "Edit Committee Details",
            description: "Click to update the committee's details and settings.",
            position: "bottom",
          },
        },
        {
          element: ".committee-card .committee-view",
          popover: {
            title: "View Committee Details",
            description: "Click to see comprehensive information about this committee.",
            position: "bottom",
          },
        },
        {
          element: ".committee-card .committee-switch",
          popover: {
            title: "Enable/Disable Committee",
            description:
              "Toggle this switch to enable or disable the committee.",
            position: "bottom",
          },
        },
      ]
      : [
        {
          element: ".MuiDataGrid-root",
          popover: {
            title: "Committee Overview",
            description: "Displays all committees in a structured table for easy management.",
            position: "top",
          },
        },
        {
          element: ".committee-delete",
          popover: {
            title: "Delete Committee",
            description: "Click to remove this committee from the system.",
            position: "left",
          },
        },
        {
          element: ".committee-edit",
          popover: {
            title: "Modify Committee Details",
            description: "Click to modify committee details and update its settings.",
            position: "left",
          },
        },
        {
          element: ".MuiSwitch-root",
          popover: {
            title: "Enable/Disable Committee",
            description:
              "Use this switch to enable or disable the committee.",
            position: "left",
          },
        },
        {
          element: ".committee-view",
          popover: {
            title: "Committee Details & Members",
            description:
              "Click to view detailed information, including total members.",
            position: "left",
          },
        },
        {
          element: ".MuiTablePagination-actions",
          popover: {
            title: "Pagination Controls",
            description: "Use these buttons to navigate between pages of the committee list.",
            position: "bottom",
          },
        },
      ]),
  ],
  "/my-committee": (isSmallScreen, isAdmin) => [
    {
      element: ".my-committee-filter",
      popover: {
        title: "Committee Filter",
        description: "Refine the committee list by filtering based on active or inactive status.",
        position: "bottom",
      },
    },

    {
      element: ".my-committee-card",
      popover: {
        title: "Committee Overview",
        description:
          "Each card provides key committee details. Use the icon to view the member list.",
        position: "top",
      },
    },
    {
      element: ".my-committee-card .my-committee-view",
      popover: {
        title: "View Committee Details",
        description: "Click to access detailed information about this committee.",
        position: "bottom",
      },
    },
  ],
  "/committee-type": (isSmallScreen, isAdmin) => [
    {
      element: ".add-committeeType",
      popover: {
        title: "Create a New Committee Type",
        description: "Click to add and define a new committee type.",
        position: "bottom",
      },
    },
    {
      element: ".go-to-committee",
      popover: {
        title: "Switch to Committee Tab",
        description: "Navigate to the main committee list.",
        position: "bottom",
      },
    },
    ...(isSmallScreen
      ? [
        {
          element: ".committee-type-card",
          popover: {
            title: "Committee Type Overview",
            description:
              "Each card provides key details about a committee type. Use the icons to view, edit, or delete.",
            position: "top",
          },
        },
        {
          element: ".committee-type-card .committee-type-delete",
          popover: {
            title: "Remove Committee Type",
            description: "Click to permanently delete this committee type from the system.",
            position: "bottom",
          },
        },
        {
          element: ".committee-type-card .committee-type-edit",
          popover: {
            title: "Edit Committee Type",
            description: "Click to update the committee type's details and settings.",
            position: "bottom",
          },
        },
        {
          element: ".committee-type-card .committee-type-switch",
          popover: {
            title: "Enable/Disable Committee Type",
            description:
              "Toggle this switch to activate or deactivate the committee type.",
            position: "bottom",
          },
        },
      ]
      : [
        {
          element: ".MuiDataGrid-root",
          popover: {
            title: "Committee Type List",
            description: "Displays all committee types in a structured table for easy management.Displays all committees in a tabular format.",
            position: "top",
          },
        },
        {
          element: ".committee-type-edit",
          popover: {
            title: "Modify Committee Type",
            description: "Click to edit and update the committee type's settings.",
            position: "left",
          },
        },
        {
          element: ".committee-type-delete",
          popover: {
            title: "Delete Committee Type",
            description: "Click to remove this committee type from the system.",
            position: "left",
          },
        },
        {
          element: ".MuiSwitch-root",
          popover: {
            title: "Enable/Disable Committee",
            description:
              "Use this switch to activate or deactivate the committee type.",
            position: "left",
          },
        },
        {
          element: ".MuiTablePagination-actions",
          popover: {
            title: "Pagination Controls",
            description: "Use these buttons to navigate between pages of the committee type list.",
            position: "bottom",
          },
        },
      ]),
  ],
  "/amenities": (isSmallScreen, isAdmin) => [
    {
      element: ".add-amenity",
      popover: {
        title: "Add a New Amenity",
        description: "Click to create and configure a new amenity.",
        position: "bottom",
      },
    },
    ...(isSmallScreen
      ? [
        {
          element: ".amenity-card",
          popover: {
            title: "Amenity Overview",
            description:
              "Each card represents an amenity. Use the icons to view, edit, or delete.",
            position: "top",
          },
        },
        {
          element: ".amenity-card .amenity-edit",
          popover: {
            title: "Modify Amenity",
            description: "Click to update the amenity’s details.",
            position: "bottom",
          },
        },
        {
          element: ".amenity-card .amenity-delete",
          popover: {
            title: "Remove Amenity",
            description: "Click to delete this amenity from the system.",
            position: "bottom",
          },
        },
        {
          element: ".amenity-card .amenity-switch",
          popover: {
            title: "Enable/Disable Amenity",
            description:
              "Toggle this switch to activate or deactivate the amenity.",
            position: "bottom",
          },
        },
      ]
      : [
        {
          element: ".MuiDataGrid-root",
          popover: {
            title: "Amenity List",
            description: "Displays all amenities in a structured table for efficient management.",
            position: "top",
          },
        },
        {
          element: ".amenity-edit",
          popover: {
            title: "Edit Amenity Details",
            description: "Click to modify and update this amenity’s settings.",
            position: "left",
          },
        },
        {
          element: ".amenity-delete",
          popover: {
            title: "Delete Amenity",
            description: "Click to permanently remove this amenity from the system.",
            position: "left",
          },
        },
        {
          element: ".MuiSwitch-root",
          popover: {
            title: "Enable/Disable Amenity",
            description:
              "Use this switch to enable or disable the amenity.",
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
          description: "Apply filters to view specific rooms based on your preferences.",
          position: "bottom",
        },
      });
    } else {
      steps.push({
        element: ".room-filter",
        popover: {
          title: "Filter Rooms",
          description: "Use the filtering options to refine your room search.",
          position: "bottom",
        },
      });
    }
    if (isAdmin) {
      steps.push(
        {
          element: ".add-room",
          popover: {
            title: "Add a New Room",
            description: "Click to create and configure a new room.",
            position: "bottom",
          },
        },
        {
          element: ".room-card",
          popover: {
            title: "Room Overview",
            description:
              "Each card displays essential details of a room. Use the icons to view, edit, or manage the room.",
            position: "top",
          },
        },
        {
          element: ".room-card .room-sanitation",
          popover: {
            title: "Sanitation Status",
            description: "Update and track the sanitation status of this room.",
            position: "bottom",
          },
        },
        {
          element: ".room-card .room-view",
          popover: {
            title: "Room Details",
            description: "Click to view complete information about this room.",
            position: "bottom",
          },
        },
        {
          element: ".room-card .room-gallery",
          popover: {
            title: "Manage Room Gallery",
            description: "Update or browse the room's photo gallery.",
            position: "bottom",
          },
        },
        {
          element: ".room-card .room-amenities",
          popover: {
            title: "Manage Room Amenities",
            description: "View or modify the amenities available in this room.",
            position: "bottom",
          },
        },
        {
          element: ".room-card .room-food",
          popover: {
            title: "Food Preferences",
            description: "View or adjust food preferences for the room.",
            position: "bottom",
          },
        },
        {
          element: ".room-card .room-barcode",
          popover: {
            title: "Room Barcode",
            description: "Scan or manage the room’s unique barcode for tracking.",
            position: "bottom",
          },
        },
        {
          element: ".room-card .room-edit",
          popover: {
            title: "Edit Room Details",
            description: "Modify room settings and update its details.",
            position: "bottom",
          },
        },
        {
          element: ".room-card .room-delete",
          popover: {
            title: "Delete Room",
            description: "Remove this room from the system permanently.",
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
            title: "View Assigned Users",
            description: "See details of users assigned to this room.",
            position: "bottom",
          },
        },
        {
          element: ".room-card .room-user-book-now",
          popover: {
            title: "Book a Room",
            description: "Quickly reserve this room for a user.",
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
        title: "Add a New Location",
        description: "Click to create and configure a new location.",
        position: "bottom",
      },
    },
    ...(isSmallScreen
      ? [
        {
          element: ".location-card",
          popover: {
            title: "Location Overview",
            description:
              "Each card displays essential details of a location. Use the icons to view, edit, or delete it.",
            position: "top",
          },
        },
        {
          element: ".location-card .location-edit",
          popover: {
            title: "Edit Location",
            description: "Modify and update the details of this location.",
            position: "bottom",
          },
        },
        {
          element: ".location-card .location-delete",
          popover: {
            title: "Delete Location",
            description: "Remove this location permanently from the system.",
            position: "bottom",
          },
        },
        {
          element: ".MuiSwitch-root",
          popover: {
            title: "Activate/Deactivate Location",
            description:
              "Toggle this switch to enable or disable the location.",
            position: "left",
          },
        },
      ]
      : [
        {
          element: ".MuiDataGrid-root",
          popover: {
            title: "Location List",
            description: "View all locations in an organized table format.",
            position: "top",
          },
        },
        {
          element: ".location-edit",
          popover: {
            title: "Edit Location",
            description: "Click to modify the details of a selected location.",
            position: "left",
          },
        },
        {
          element: ".location-delete",
          popover: {
            title: "Delete Location",
            description: "Remove a location from the list permanently.",
            position: "left",
          },
        },
        {
          element: ".MuiSwitch-root",
          popover: {
            title: "Activate/Deactivate Location",
            description:
              "Enable or disable a location using this switch.",
            position: "left",
          },
        },
        {
          element: ".MuiTablePagination-actions",
          popover: {
            title: "Pagination Controls",
            description:
              "Navigate through multiple pages of location records.",
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
        description: "Click to create and configure a new food or beverage item.",
        position: "bottom",
      },
    },
    ...(isSmallScreen
      ? [
        {
          element: ".food-card",
          popover: {
            title: "Item Overview",
            description:
              "Each card displays essential details of a food or beverage item. Use the icons to view, edit, or delete it.",
            position: "top",
          },
        },
        {
          element: ".food-card .food-edit",
          popover: {
            title: "Edit Item",
            description:
              "Modify and update the details of this food or beverage item.",
            position: "bottom",
          },
        },
        {
          element: ".food-card .food-delete",
          popover: {
            title: "Delete Item",
            description: "Remove this item permanently from the list.",
            position: "bottom",
          },
        },
        {
          element: ".MuiSwitch-root",
          popover: {
            title: "Activate/Deactivate Food or Beverage",
            description:
              "Toggle this switch to enable or disable the item.",
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
              "View all food and beverage items in an organized table format.",
            position: "top",
          },
        },
        {
          element: ".food-edit",
          popover: {
            title: "Edit Item",
            description: "Click to modify the details of a selected item.",
            position: "left",
          },
        },
        {
          element: ".food-delete",
          popover: {
            title: "Delete Item",
            description: "Remove an item from the list permanently.",
            position: "left",
          },
        },
        {
          element: ".MuiSwitch-root",
          popover: {
            title: "Activate/Deactivate Food or Beverage",
            description:
              "Enable or disable an item using this switch.",
            position: "left",
          },
        },
        {
          element: ".MuiTablePagination-actions",
          popover: {
            title: "Pagination Controls",
            description:
              "Navigate through multiple pages of food and beverage records.",
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
        description: "Click to create a new user role and configure its permissions.",
        position: "bottom",
      },
    },
    {
      element: ".MuiDataGrid-root",
      popover: {
        title: "User Role List",
        description:
          "View all user roles in a structured table format.",
        position: "top",
      },
    },
    {
      element: ".user-role-edit",
      popover: {
        title: "Modify User Role",
        description: "Modify the details and permissions of an existing role.",
        position: "left",
      },
    },
    {
      element: ".user-role-delete",
      popover: {
        title: "Delete user Role",
        description: "Remove a user role permanently from the system.",
        position: "left",
      },
    },
    {
      element: ".MuiSwitch-root",
      popover: {
        title: "Activate/Deactivate User Role",
        description:
          "Enable or disable a user role using this switch.",
        position: "left",
      },
    },
    {
      element: ".MuiTablePagination-actions",
      popover: {
        title: "Pagination Controls",
        description:
          "Navigate through multiple pages of user roles.",
        position: "bottom",
      },
    },
  ],
  "/reports": (isSmallScreen, isAdmin) => [
    {
      element: ".user-report-card",
      popover: {
        title: "Users",
        description:
          "Displays the total number of users.",
        position: "top",
      },
    },
    {
      element: ".amenity-report-card",
      popover: {
        title: "Amenities",
        description:
          "Shows the total count of amenities available.",
        position: "top",
      },
    },
    {
      element: ".meetings-report-card",
      popover: {
        title: "Meetings",
        description:
          "Indicates the total number of scheduled meetings.",
        position: "top",
      },
    },
    {
      element: ".cancelled-meetings-report-card",
      popover: {
        title: "Cancelled Meetings",
        description:
          "Tracks meetings that were canceled. Use the three-dot menu to filter by Today, This Week, or This Month.",
        position: "top",
      },
    },
    {
      element: ".completed-meetings-report-card",
      popover: {
        title: "Completed Meetings",
        description:
          "Displays the count of successfully completed meetings. Use the three-dot menu for time-based filtering.",
        position: "top",
      },
    },
    {
      element: ".food-report-card",
      popover: {
        title: "Food & Beverages",
        description:
          "Lists the total number of food and beverage items.",
        position: "top",
      },
    },
    {
      element: ".committee-report-card",
      popover: {
        title: "Committee Meetings",
        description:
          "Shows the total number of committee-related meetings.",
        position: "top",
      },
    },
    {
      element: ".room-report-card",
      popover: {
        title: "Room",
        description:
          "Indicates the total number of rooms available.",
        position: "top",
      },
    },
    {
      element: ".most-used-room",
      popover: {
        title: "Most Used Room",
        description:
          "A table displaying rooms ranked by usage percentage.",
        position: "top",
      },
    },
    {
      element: ".most-frequent-organizer",
      popover: {
        title: "Most Frequent Organizer",
        description:
          "A table showing the most frequent meeting organizers by percentage.",
        position: "top",
      },
    },
  ],
  "/notification-all": (isSmallScreen, isAdmin) => [
    {
      element: ".MuiDataGrid-root",
      popover: {
        title: "Notification List",
        description:
          "View your latest meeting alerts here.",
        position: "top",
      },
    },
    {
      element: ".delete-notification",
      popover: {
        title: "Delete a Notification",
        description:
          "Remove a notification from your list.",
        position: "top",
      },
    },
    {
      element: ".read-unread-notification",
      popover: {
        title: "Change Notification Status",
        description:
          "Mark notifications as read or unread.",
        position: "top",
      },
    },
  ],
  "/logs": (isSmallScreen, isAdmin) => [
    {
      element: ".MuiDataGrid-root",
      popover: {
        title: "Logs Table",
        description:
          "View all meeting logs in a structured format.",
        position: "top",
      },
    },
    // {
    //   element: ".MuiDataGrid-root .meeting-logs-edit",
    //   popover: {
    //     title: "Modify Meeting",
    //     description: "Modify meeting details.",
    //     position: "left",
    //   },
    // },
    // {
    //   element: ".meeting-logs-postpone",
    //   popover: {
    //     title: "Reschedule Meeting",
    //     description: "Reschedule a meeting to a later time.",
    //     position: "left",
    //   },
    // },
    // {
    //   element: ".meeting-logs-swap",
    //   popover: {
    //     title: "Swap Meeting",
    //     description: "Exchange meeting slots between different times or rooms.",
    //     position: "left",
    //   },
    // },
    // {
    //   element: ".meeting-logs-cancel",
    //   popover: {
    //     title: "Cancel Meeting",
    //     description: "Click to Cancel the meeting.",
    //     position: "left",
    //   },
    // },
    // {
    //   element: ".meeting-logs-approve",
    //   popover: {
    //     title: "Approve Meeting",
    //     description: "Grant approval for a meeting request.",
    //     position: "left",
    //   },
    // },
    // {
    //   element: ".meeting-logs-approve",
    //   popover: {
    //     title: "Approve Meeting",
    //     description: "Grant approval for a meeting request.",
    //     position: "left",
    //   },
    // },
    {
      element: ".MuiTablePagination-actions",
      popover: {
        title: "Pagination Controls",
        description:
          "Navigate through log entries efficiently.",
        position: "bottom",
      },
    },
  ],
  "/services": (isSmallScreen, isAdmin) => [
    {
      element: ".add-new-service",
      popover: {
        title: "Add New Service",
        description:
          "Click to add a new service.",
        position: "top",
      },
    },
    {
      element: ".MuiDataGrid-root",
      popover: {
        title: "Service Table",
        description:
          "View all available services in a structured table.",
        position: "top",
      },
    },
    {
      element: ".edit-service",
      popover: {
        title: "Edit Service",
        description: "Modify service details.",
        position: "left",
      },
    },
    {
      element: ".delete-service",
      popover: {
        title: "Delete Service",
        description: "Remove a service from the system.",
        position: "left",
      },
    },
    {
      element: ".MuiSwitch-root",
      popover: {
        title: "Activate or Deactivate a service",
        description: "Enable or disable a service using this toggle.",
        position: "left",
      },
    },
    {
      element: ".MuiTablePagination-actions",
      popover: {
        title: "Pagination Controls",
        description:
          "Navigate through the service list.",
        position: "bottom",
      },
    },
  ],
  "/stocks": (isSmallScreen, isAdmin) => [
    {
      element: ".add-new-stock",
      popover: {
        title: "Add New Item",
        description:
          "Click to add a new stock item.",
        position: "top",
      },
    },
    {
      element: ".pending-amenities",
      popover: {
        title: "Pending Amenities",
        description:
          "View pending amenities that need approval or restocking.",
        position: "top",
      },
    },
    {
      element: ".pending-food",
      popover: {
        title: "Pending Food",
        description:
          "View pending food items that require action.",
        position: "top",
      },
    },
    {
      element: ".MuiDataGrid-root",
      popover: {
        title: "Stock Table",
        description:
          "View all stock items in a structured format.",
        position: "top",
      },
    },
    {
      element: ".decrease-stock",
      popover: {
        title: "Decrease Stock",
        description: "Reduce stock quantity.",
        position: "left",
      },
    },
    {
      element: ".increase-stock",
      popover: {
        title: "Increase Stock",
        description: "Increase stock quantity.",
        position: "left",
      },
    },
    {
      element: ".MuiTablePagination-actions",
      popover: {
        title: "Pagination Controls",
        description:
          "Navigate through the stock entries efficiently.",
        position: "bottom",
      },
    },
  ],
};

export default guideSteps;
