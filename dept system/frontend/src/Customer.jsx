import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";

const products = new Array(8).fill({
  name: "Prod_name",
  price: "$###",
});

const Customer = () => {
  return (
    <Box display="flex" height="100vh">
      {/* Sidebar */}
      <Box
        width="200px"
        bgcolor="#0b1b3f"
        color="white"
        p={2}
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Customer
        </Typography>
        <List>
          {["Menu / Products", "Cart", "Order", "Logout"].map((text, index) => (
            <ListItem
              button
              key={index}
              sx={{
                color: "#fff",
                borderRadius: "10px",
                backgroundColor: text === "Menu / Products" ? "#b2b2d9" : "transparent",
                mb: 1,
                px: 2,
              }}
            >
              <ListItemText
                primary={text}
                primaryTypographyProps={{ fontWeight: text === "Menu / Products" ? "bold" : "normal" }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main content */}
      <Box flex={1} p={3}>
        <Typography variant="h6" mb={2}>
          Welcome, Hello Customer!
        </Typography>

        {/* Product Section */}
        <Box
          border={1}
          borderColor="#ccc"
          borderRadius="8px"
          p={2}
          position="relative"
          bgcolor="#f7f7f7"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              Products
            </Typography>
            <TextField
              placeholder="Search Products"
              size="small"
              sx={{
                backgroundColor: "#fff",
                borderRadius: "20px",
                width: "250px",
              }}
              InputProps={{
                endAdornment: <span role="img" aria-label="search">🔍</span>,
              }}
            />
          </Box>

          {/* Product Grid */}
          <Grid container spacing={2}>
            {products.map((product, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Card sx={{ textAlign: "center", p: 1 }}>
                  <CardMedia
                    component="img"
                    height="100"
                    image="https://via.placeholder.com/100x100?text=Image"
                    alt={product.name}
                    sx={{ objectFit: "contain", margin: "auto", my: 1 }}
                  />
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="body2">{product.name}</Typography>
                    <Typography variant="body2">{`Price: ${product.price}`}</Typography>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        mt: 1,
                        backgroundColor: "#8a88f2",
                        fontSize: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      ADD TO CART
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Customer;
