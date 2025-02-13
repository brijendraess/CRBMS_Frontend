import { Card, CardContent, Typography, CardActions, IconButton, Box } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";

const InventoryCard = ({ stockItem, handleQuantityChange }) => {
  return (
    <Card sx={{ width: 300, p: 1, textAlign: "center" }}>
      <CardContent>
        <Typography variant="h6">{stockItem.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          Stock: {stockItem.quantity}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between" }}>
        <IconButton
          onClick={() =>
            handleQuantityChange(stockItem.amenityId, stockItem.uid, stockItem.id, -1)
          }
          sx={{ bgcolor: "error.main", color: "#fff", "&:hover": { bgcolor: "error.dark" } }}
        >
          <RemoveIcon />
        </IconButton>

        <Typography variant="h6">{stockItem.quantity}</Typography>

        <IconButton
          onClick={() =>
            handleQuantityChange(stockItem.amenityId, stockItem.uid, stockItem.id, 1)
          }
          sx={{ bgcolor: "success.main", color: "#fff", "&:hover": { bgcolor: "success.dark" } }}
        >
          <AddIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default InventoryCard;
