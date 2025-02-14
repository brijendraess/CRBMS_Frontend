import { Card, CardActions, CardContent, IconButton, Typography, Tooltip, Switch } from "@mui/material";
import { EditOutlined, DeleteOutline } from "@mui/icons-material";
import React from "react";

const UserTypeCard = ({ role, handleEdit, handleDelete, handleStatusChange }) => {
    return (
        <Card sx={{ width: "100%", p: 1, textAlign: "left" }}>
            <CardContent>
                <Typography variant="h6">{role.userTypeName}</Typography>
                {/* Ensure permission is rendered correctly */}
                {role.permission ? (
                    <Typography variant="body2" color="textSecondary" dangerouslySetInnerHTML={{ __html: role.permission }} />
                ) : (
                    <Typography variant="body2" color="textSecondary">No Permissions Assigned</Typography>
                )}
            </CardContent>

            <CardActions sx={{ justifyContent: "space-between" }}>
                <div>
                    <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(role.uid)} color="primary">
                            <EditOutlined />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(role.uid)} color="error">
                            <DeleteOutline />
                        </IconButton>
                    </Tooltip>
                </div>
                <Tooltip title="Change Status">
                    <Switch checked={role.status} onChange={() => handleStatusChange(role.uid)} />
                </Tooltip>
            </CardActions>
        </Card>
    );
};

export default UserTypeCard;
